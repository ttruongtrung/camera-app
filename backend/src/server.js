const express = require('express');
const { spawn } = require('child_process');
const ffmpegPath = require('ffmpeg-static').path;
const path = require('path');
const Camera = require('./controllers/camera.controller');
const VideoSegment = require('./controllers/videoSegment.controller');

const app = express();
const port = process.env.PORT || 3001;
let captureProcess = null;

const db = require('./models/dbconnect');
db.sequelize.sync()
	.then(() => {
		console.log("Synced db.");
	})
	.catch((err) => {
		console.log('Failed to sync db: ', err.message)
	});

// Function to start capturing frames from RTSP stream and save to file
function startCaptureStream() {
	const fileName = `data_${Date.now()}.mp4`;
	const outputPath = path.join(__dirname, '..', 'public', 'videos', fileName);
	const rtsp_url = 'rtsp://admin:L2427AA6@192.168.1.13:554/cam/realmonitor?channel=1&subtype=0&unicast=true&proto=Onvif';
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
      startTime: '',
      endTime: '',
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

app.get('/api/start-capture', (req, res) => {
	if (!captureProcess) {
		startCaptureStream();
		res.status(200).send('Capture process started successfully.');
	} else {
		res.status(400).send('Capture process is already running.');
	}
});

app.get('/api/stop-capture', (req, res) => {
	if (captureProcess) {
		captureProcess.kill();
		captureProcess = null;
		res.status(200).send('Capture process stopped successfully.');
	} else {
		res.status(400).send('Capture process is not running.');
	}
});

app.listen(port, () => {
	console.log(`Server running on port ${port}`);
});
