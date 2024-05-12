const express = require('express');
const cors = require('cors');
const { spawn } = require('child_process');
const ffmpegPath = require('ffmpeg-static').path;
const path = require('path');
const Camera = require('./controllers/camera.controller');
const VideoSegment = require('./controllers/videoSegment.controller');
const moment = require('moment');
const { authenticate, authorize } = require('./middlewares/auth');
let cameraStatus = {};
let cameraId;
const CAMERA_STATUS = require('./constants');
let intervalTime = 5000;

const app = express();
app.use(cors());
const port = process.env.PORT || 3001;
let captureProcess = {};
let isCapturing = false;
let captureInterval;

// parse requests of content-type - application/json and application/x-www-form-urlencoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const db = require('./models/dbconnect');
const cameraController = require('./controllers/camera.controller');
db.sequelize.sync()
	.then(() => {
		console.log("Synced db.");
	})
	.catch((err) => {
		console.log('Failed to sync db: ', err.message)
	});

const customMiddleware = (req, res, next) => {
	console.log('Custom middleware called', req.body);
	next();
};

// Function to start capturing frames from RTSP stream and save to file
function startCaptureStream(cameraId, rtsp) {
	console.log('start capture on Backend');
	// const fileName = `data_${Date.now()}.mp4`;
	// const fileName = fileNameByCameraId
	const fileName = `data_camera${cameraId}_${Date.now()}.mp4`;
	const outputPath = path.join(__dirname, '..', 'public', 'videos', fileName);
	// const rtsp_url = 'rtsp://admin:L2427AA6@192.168.1.13:554/cam/realmonitor?channel=1&subtype=0&unicast=true&proto=Onvif';
	const rtsp_url = rtsp;
	const args = [
		'-copyts',
		'-i', rtsp_url,
		'-c', 'copy',
		'-t', '60',
		outputPath
	];
	captureProcess = spawn('ffmpeg', args);

	captureProcess.stdout.on('data', (data) => {
		console.log(`stdout: ${data}`);
	});

	captureProcess.stderr.on('data', (data) => {
		console.error(`stderr: ${data}`);
	});

	captureProcess.on('close', (code) => {
		console.log(`ffmpeg process exited with code ${code}`);
		const startTime = moment();
		const endTime = moment(startTime).add(intervalTime, 'milliseconds')
		const data = VideoSegment.createWithRawData({
			cameraId: cameraId,
			description: fileName,
			// startTime: '2024-05-05 14:46:16.765 +00:00',
			// endTime: '2024-05-05 14:46:16.765 +00:00',
			startTime : startTime,
			endTime : endTime,
			// endTime: moment().format('DD/MM/YYYY - HH:mm:ss'),
			videoFile: outputPath
		});
		console.log('Finish write to record: ', data);
	});
}

app.post('/api/login', authenticate);

app.use('/api/storage', express.static(path.join(__dirname, '..', 'public', 'videos')));
app.get('/api/cameras', authorize, (req, res) => Camera.getAllCameras(req, res));
app.post('/api/camera', customMiddleware, (req, res) => Camera.createCamera(req, res));
app.put('/api/camera/:id', (req, res) => Camera.updateCamera(req, res));
app.delete('/api/camera/:id', (req, res) => Camera.deleteCameraById(req, res));
app.get('/api/camera/:cameraId/segments', (req, res) => VideoSegment.getVideoSegmentsByCameraId(req, res));

/**
 * Start capturing API
 * 
 * @description This API endpoint is used to start the capturing process for a specified camera.
 * 
 * @param {string} req.params.cameraId - The ID of the camera for which the capturing process needs to be started.
 * 
 * @returns {object} Response object with status and message.
 */

app.post('/api/camera/:cameraId/start-capture', (req, res) => {
	const cameraId = req.params.cameraId;
	const rtsp = 'public/videos/video' + cameraId + '.mp4';
	const cameraStatusInfo = cameraController.getCameraInformation(cameraId);

	if (cameraStatusInfo) {
		const status = cameraStatusInfo.status;
		if (status == CAMERA_STATUS.CREATE || status == CAMERA_STATUS.READY)
		{
			if (!cameraStatus.hasOwnProperty(cameraId)) {
				cameraStatus[cameraId] = {
					isCapturing: false,
					intervalId: null
				};
			}

			if (!cameraStatus[cameraId].isCapturing) {
				cameraStatus[cameraId].isCapturing = true;
				startCaptureStream(cameraId);
				cameraStatus[cameraId].intervalId = setInterval(() => {
					startCaptureStream(cameraId, rtsp);				
				}, intervalTime);
				cameraController.updateCameraStatus(cameraId, cameraStatus[cameraId].isCapturing);
				res.status(200).send(`Capture process started successfully for camera ${cameraId}.`);
			} else {
				res.status(400).send(`Capture process is already running for camera ${cameraId}.`);
			}
		}
	}
	
});

/**
 * Stop capturing API
 * 
 * @description This API endpoint is used to stop the capturing process for a specified camera.
 * 
 * @param {string} req.params.cameraId - The ID of the camera for which the capturing process needs to be stopped.
 * 
 * @returns {object} Response object with status and message.
 */
app.post('/api/camera/:cameraId/stop-capture', async (req, res) => {
	const cameraId = req.params.cameraId; // Get the cameraId from the request parameters
	// Check if the camera status is stored

	if (cameraStatus.hasOwnProperty(cameraId)) {
		// Check if the capture process is running for the specified camera
		if (cameraStatus[cameraId].isCapturing) {
			// Clear the interval for the camera
			clearInterval(cameraStatus[cameraId].intervalId);
			// Set the capture status for the camera to false
			cameraStatus[cameraId].isCapturing = false;
			await cameraController.updateCameraStatus(cameraId, cameraStatus[cameraId].isCapturing)

			// Send a success response
			res.status(200).send(`Capture process stopped successfully for camera ${cameraId}.`);
		} else {
			// If the capture process is not running, send an error response
			res.status(400).send(`Capture process is not running for camera ${cameraId}.`);
		}

	} else {
		// If the camera status is not stored, send an error response
		res.status(400).send(`Camera ${cameraId} is not found.`);
	}
});

app.listen(port, () => {
	console.log(`Server running on port ${port}`);
	setInterval(cameraController.cleanVideos, 300000)
	console.log(`clean successfully`);
});
