const { spawn } = require('child_process');
const path = require('path');
const moment = require('moment');
const VideoSegmentCtrl = require('../controllers/videoSegment.controller');
const CameraCtrl = require('../controllers/camera.controller');
const ffmpegPath = require('ffmpeg-static').path;
const fs = require('fs');
const cameraProcesses = {};
const streamingProcesses = {}; 
const cameraStatus = {};
const cameraStreamingStatus = {};
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
    const data = VideoSegmentCtrl.createWithRawData({
      cameraId: cameraId,
      description: fileName,
      startTime: startTime,
      endTime: endTime,
      videoFile: outputPath
    });
    console.log('Finish write to record: ', data);
  });
}

function startStreaming(cameraId, rtsp) {
  console.log(`Start streaming for camera ${cameraId}`);
  const OUTPUT_DIR = path.join(__dirname, '..', '..', 'public', 'videos', 'VideoStreaming');
  if (!fs.existsSync(OUTPUT_DIR)) {
      fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const OUTPUT_FILE = path.join(OUTPUT_DIR, `stream_${cameraId}.m3u8`);
  const command = [
    'ffmpeg',
    '-rtsp_transport', 'tcp', 
    '-i', rtsp,               
    '-an',                    
    '-vn',                    
    '-map', '0:v:0',          
    '-c:v', 'libx264',        
    '-preset', 'fast',        
    '-b:v', '2000k',          
    '-threads', 'auto',       
    '-hls_time', '15',        
    '-hls_list_size', '2',    
    '-hls_flags', 'delete_segments', 
    '-f', 'hls',              
    OUTPUT_FILE               
];


  // Start ffmpeg process
  const ffmpeg = spawn(command[0], command.slice(1));

  // Save process to the streamingProcesses object
  streamingProcesses[cameraId] = ffmpeg;

  ffmpeg.stdout.on('data', (data) => {
      console.log(`stdout: ${data}`);
  });

  ffmpeg.stderr.on('data', (data) => {
      console.error(`stderr: ${data}`);
  });

  ffmpeg.on('close', (code) => {
      console.log(`ffmpeg process for camera ${cameraId} exited with code ${code}`);s
      if (code !== 0) {
          console.error(`Error: ffmpeg process for camera ${cameraId} terminated unexpectedly. Restarting...`);
          startStreaming(cameraId, rtsp); 
      } else {
          delete streamingProcesses[cameraId];
      }
  });
  return ffmpeg;
}

function stopStream(cameraId) {
  if (streamingProcesses[cameraId]) {
      const ffmpegProcess = streamingProcesses[cameraId];     
      ffmpegProcess.kill('SIGTERM');
      delete streamingProcesses[cameraId];
      console.log(`Streaming for camera ${cameraId} has been stopped.`);
  } else {
      console.log(`No active streaming process found for camera ${cameraId}.`);
  }
}


const startCaptureHandler = async (req, res) => {
  const cameraId = req.params.cameraId;
  const rtsp = req.body.rtspLink;

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
    await CameraCtrl.updateCameraStatus(cameraId, isCapturing = cameraStatus[cameraId].isCapturing);
    res.status(200).send(`Capture process started successfully for camera ${cameraId}.`);
  } else {
    res.status(400).send(`Capture process is already running for camera ${cameraId}.`);
  }
};


const startStreamHandler = async (req, res) => {
  const cameraId = req.params.cameraId;
  const rtsp = req.body.rtspLink;

  // Initialize camera streaming status if not present
  if (!cameraStreamingStatus.hasOwnProperty(cameraId)) {
      cameraStreamingStatus[cameraId] = {
          isStreaming: false
      };
  }

  if (!cameraStreamingStatus[cameraId].isStreaming) {
      cameraStreamingStatus[cameraId].isStreaming = true;

      // Start the streaming process
      startStreaming(cameraId, rtsp);

      // Update streaming status in the database
      await CameraCtrl.updateCameraStatus(cameraId, isStreaming = true);

      res.status(200).send(`Streaming process started successfully for camera ${cameraId}.`);
  } else {
      res.status(400).send(`Streaming process is already running for camera ${cameraId}.`);
  }
};


const stopCaptureHandler = async (req, res) => {
  const cameraId = req.params.cameraId;

  if (cameraStatus.hasOwnProperty(cameraId)) {
    if (cameraStatus[cameraId].isCapturing) {
      clearInterval(cameraStatus[cameraId].intervalId);
      cameraStatus[cameraId].isCapturing = false;
      await CameraCtrl.updateCameraStatus(cameraId, isCapturing = cameraStatus[cameraId].isCapturing);
      res.status(200).send(`Capture process stopped successfully for camera ${cameraId}.`);
    } else {
      res.status(400).send(`Capture process is not running for camera ${cameraId}.`);
    }
  } else {
    res.status(400).send(`Camera ${cameraId} is not found.`);
  }
};

const stopStreamHandler = async (req, res) => {
  const cameraId = req.params.cameraId;
  stopStream(cameraId);

  if (!streamingProcesses[cameraId]) {
      if (cameraStreamingStatus.hasOwnProperty(cameraId)) {
          cameraStreamingStatus[cameraId].isStreaming = false;
      }

      try {
          await CameraCtrl.updateCameraStatus(cameraId, isStreaming = false);
          res.status(200).send(`Streaming stopped successfully for camera ${cameraId}.`);
      } catch (err) {
          res.status(500).send(`Error stopping streaming for camera ${cameraId}: ${err.message}`);
      }
  } else {
      res.status(400).send(`Streaming process is still running for camera ${cameraId}.`);
  }
};



const checkRtspHandler = async (req, res) => {
  try {
    console.log('..........start check rtsp');
    const rtsp_url = 'rtsp://admin:L2427AA6@192.168.1.13:554/cam/realmonitor?channel=1&subtype=0&unicast=true&proto=Onvif';
    const isRtspLinkValid = await CameraCtrl.checkRTSPStream(rtsp_url);
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
  startStreamHandler,
  stopCaptureHandler,
  stopStreamHandler,
  checkRtspHandler
};