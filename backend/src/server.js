const express = require('express');
const cors = require('cors');
const { spawn } = require('child_process');
const ffmpegPath = require('ffmpeg-static').path;
const path = require('path');
const Camera = require('./controllers/camera.controller');
const VideoSegment = require('./controllers/videoSegment.controller');
const moment = require('moment');

const app = express();
app.use(cors());
const port = process.env.PORT || 3001;
let captureProcess = null;
let isCapturing = false;
let captureInterval;

// parse requests of content-type - application/json and application/x-www-form-urlencoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const db = require('./models/dbconnect');
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
function startCaptureStream() {
	console.log('start capture on Backend');
	const fileName = `data_${Date.now()}.mp4`;
	const outputPath = path.join(__dirname, '..', 'public', 'videos', fileName);
	const rtsp_url = 'rtsp://admin:L2427AA6@192.168.1.13:554/cam/realmonitor?channel=1&subtype=0&unicast=true&proto=Onvif';
	// const rtsp_url = 'public/videos/meme-2.mp4';
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
    const data = VideoSegment.createWithRawData({
      cameraId: 1,
      description: fileName,
      startTime: '2024-05-05 14:46:16.765 +00:00',
			endTime: '2024-05-05 14:46:16.765 +00:00',
      // endTime: moment().format('DD/MM/YYYY - HH:mm:ss'),
      videoFile: outputPath
    });
    console.log('Finish write to record: ', data);
	});
}

app.get('/api/testdb', (req, res) => {
	const data = VideoSegment.createWithRawData({
		cameraId: 1,
		description: 'testFile',
		startTime: '',
		endTime: '',
		videoFile: 'testVideo File'
	});
	console.log('Finish write to record: ', data);
});

app.use('/api/storage', express.static(path.join(__dirname, '..','public', 'videos')));
app.get('/api/cameras', (req, res) => Camera.getAllCameras(req, res));
app.post('/api/camera', customMiddleware, (req, res) => Camera.createCamera(req, res));
app.put('/api/camera/:id', (req, res) => Camera.updateCamera(req, res));
app.delete('/api/camera/:id', (req, res) => Camera.deleteCameraById(req, res));
app.get('/api/camera/:cameraId/segments', (req, res) => VideoSegment.getVideoSegmentsByCameraId(req, res));
app.post('/api/camera/:cameraId/start-capture', (req, res) => {
	if (!isCapturing) {
		isCapturing = true;
		startCaptureStream();
		captureInterval = setInterval(startCaptureStream, 60000);
		res.status(200).send('Log::Capture process started successfully.');
	} else {
		res.status(400).send('Capture process is already running.');
	}
});

app.post('/api/camera/:cameraId/stop-capture', (req, res) => {
	if (isCapturing) {
		captureProcess.kill();
		captureProcess = null;
		clearInterval(captureInterval);
		isCapturing = false;
		res.status(200).send('Capture process stopped successfully.');
	} else {
		res.status(400).send('Capture process is not running.');
	}
});

app.listen(port, () => {
	console.log(`Server running on port ${port}`);
});
