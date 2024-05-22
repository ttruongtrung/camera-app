const { spawn } = require('child_process');
const path = require('path');
const moment = require('moment');
const VideoSegment = require('../models/VideoSegment');
const cameraController = require('../controllers/cameraController');
const ffmpegPath = require('ffmpeg-static').path;

const cameraStatus = {};
const intervalTime = 60000; // 60 seconds

function startCaptureStream(cameraId, rtsp) {
    console.log('start capture on Backend');
    const fileName = `data_camera${cameraId}_${Date.now()}.mp4`;
    const outputPath = path.join(__dirname, '..', '..', 'public', 'videos', fileName);
    const args = [
        '-copyts',
        '-i', rtsp,
        '-c', 'copy',
        '-t', '60',
        outputPath
    ];
    const captureProcess = spawn('ffmpeg', args);

    captureProcess.stdout.on('data', (data) => {
        console.log(`stdout: ${data}`);
    });

    captureProcess.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`);
    });

    captureProcess.on('close', (code) => {
        console.log(`ffmpeg process exited with code ${code}`);
        const startTime = moment();
        const endTime = moment(startTime).add(intervalTime, 'milliseconds');
        const data = VideoSegment.createWithRawData({
            cameraId: cameraId,
            description: fileName,
            startTime: startTime,
            endTime: endTime,
            videoFile: outputPath
        });
        console.log('Finish write to record: ', data);
    });
}

const startCaptureHandler = async (req, res) => {
    const cameraId = req.params.cameraId;
    const rtsp = 'public/videos/video' + cameraId + '.mp4';

    if (!cameraStatus.hasOwnProperty(cameraId)) {
        cameraStatus[cameraId] = {
            isCapturing: false,
            intervalId: null
        };
    }

    if (!cameraStatus[cameraId].isCapturing) {
        cameraStatus[cameraId].isCapturing = true;
        startCaptureStream(cameraId, rtsp);
        cameraStatus[cameraId].intervalId = setInterval(() => {
            startCaptureStream(cameraId, rtsp);
        }, intervalTime);
        await cameraController.updateCameraStatus(cameraId, cameraStatus[cameraId].isCapturing);
        res.status(200).send(`Capture process started successfully for camera ${cameraId}.`);
    } else {
        res.status(400).send(`Capture process is already running for camera ${cameraId}.`);
    }
};

const stopCaptureHandler = async (req, res) => {
    const cameraId = req.params.cameraId;

    if (cameraStatus.hasOwnProperty(cameraId)) {
        if (cameraStatus[cameraId].isCapturing) {
            clearInterval(cameraStatus[cameraId].intervalId);
            cameraStatus[cameraId].isCapturing = false;
            await cameraController.updateCameraStatus(cameraId, cameraStatus[cameraId].isCapturing);
            res.status(200).send(`Capture process stopped successfully for camera ${cameraId}.`);
        } else {
            res.status(400).send(`Capture process is not running for camera ${cameraId}.`);
        }
    } else {
        res.status(400).send(`Camera ${cameraId} is not found.`);
    }
};

const checkRtspHandler = async (req, res) => {
    try {
        console.log('..........start check rtsp');
        const rtsp_url = 'rtsp://admin:L2427AA6@192.168.1.13:554/cam/realmonitor?channel=1&subtype=0&unicast=true&proto=Onvif';
        const isRtspLinkValid = await cameraController.checkRTSPStream(rtsp_url);
        console.log('..........finish check rtsp');
        if (isRtspLinkValid) res.status(200).send('status check with result: ', isRtspLinkValid);
        else res.status(500).send('RTSP stream is not available with code x000.');		
    } catch (err) {
        console.error('Error checking RTSP stream:', err);
        res.status(500).send('RTSP stream is not available.');
    }
};

module.exports = {
    startCaptureHandler,
    stopCaptureHandler,
    checkRtspHandler
};
