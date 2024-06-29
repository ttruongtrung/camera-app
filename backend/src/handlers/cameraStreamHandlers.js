const { spawn } = require('child_process');
const path = require('path');
const moment = require('moment');
const VideoSegmentCtrl = require('../controllers/videoSegment.controller');
const CameraCtrl = require('../controllers/camera.controller');
const fs = require('fs');
const streamingProcesses = {}; 
const cameraStatus = {};
const cameraStreamingStatus = {};
const intervalTime = 60000;
const facebookStreamingProcess = {};
const { createCanvas  } = require('canvas');
const scoreboardPath = path.join(__dirname, '..', '..', 'public', 'videos', 'scoreboard.png');

let _socketIO;
const setSocketIO = (socketIoInstance) => _socketIO = socketIoInstance;

function startCaptureStream(cameraId, rtsp) {
  console.log('start capture on Backend');
  const fileName = `data_camera${cameraId}_${Date.now()}.mp4`;
  const outputPath = path.join(__dirname, '..', '..', 'public', 'videos', fileName);
  
  const args = [
    '-rtsp_transport', 'tcp',  
    '-i', rtsp,
    '-c:v', 'libx264',  
    '-preset', 'fast', 
    '-t', '60',  
    '-movflags', '+faststart',  
    '-bufsize', '4M',  
    '-y',  
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
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
      videoFile: outputPath
    });
    console.log('Finish write to record: ', data);
  });
}

// Start stream local 
function startStreaming(cameraId, rtsp) {
  console.log(`Start streaming for camera ${cameraId}`);
  _socketIO.emit('stream_started', { cameraId });
  const OUTPUT_DIR = path.join(__dirname, '..', '..', 'public', 'videos', 'VideoStreaming');
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }
  const OUTPUT_FILE = path.join(OUTPUT_DIR, `stream_${cameraId}.m3u8`);
  const command = [
    'ffmpeg',
    '-rtsp_transport', 'tcp',
    '-re', 
    '-i', rtsp,
    '-an',
    '-c:v', 'libx264',
    '-preset', 'fast',
    '-b:v', '2000k',
    '-threads', 'auto',
    '-hls_time', '3',
    '-hls_list_size', '2',
    '-hls_flags', 'delete_segments',
    OUTPUT_FILE
  ];

  const ffmpeg = spawn(command[0], command.slice(1));
  streamingProcesses[cameraId] = ffmpeg;
  ffmpeg.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`);
  });

  ffmpeg.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
  });

  ffmpeg.on('close', (code) => {
    console.log(`ffmpeg process for camera ${cameraId} exited with code ${code}`);
    delete streamingProcesses[cameraId];
  });
}

// Start facebook stream
function startFacebookStream(cameraId, rtsp) {
  const RTMP_URL = 'rtmps://live-api-s.facebook.com:443/rtmp/';
  const streamkey = 'FB-431798116501131-0-AbxcXthIUh6rBzlv';
  console.log(`Start streaming camera ${cameraId} to Facebook with stream key: ${streamkey}`);

  updateScoreboard();

  if (!fs.existsSync(scoreboardPath)) {
    console.error('Scoreboard file does not exist:', scoreboardPath);
    return;
  }

  const command = [
    'ffmpeg',
    '-rtsp_transport', 'tcp',
    '-i', rtsp,
    '-i', scoreboardPath,
    '-filter_complex', 'overlay=(main_w-overlay_w)/2:main_h-overlay_h',
    '-c:v', 'libx264',
    '-preset', 'veryfast',
    '-maxrate', '4000k',
    '-bufsize', '8000k',
    '-pix_fmt', 'yuv420p',
    '-g', '50',
    '-c:a', 'aac',
    '-b:a', '128k',
    '-ar', '44100',
    '-f', 'flv',
    `${RTMP_URL}/${streamkey}`
  ];

  const ffmpeg = spawn(command[0], command.slice(1));
  
  facebookStreamingProcess[cameraId] = ffmpeg;

  ffmpeg.stdout.on('data', (data) => {
    console.log(`stdout (${cameraId}): ${data}`);
  });

  ffmpeg.stderr.on('data', (data) => {
    console.error(`stderr (${cameraId}): ${data}`);
  });

  ffmpeg.on('close', (code) => {
    console.log(`ffmpeg process for camera ${cameraId} streaming to Facebook exited with code ${code}`);
    // delete facebookStreamingProcess[cameraId]; 
  });
}

// Stop facebook streaming
function stopFacebookStreaming(cameraId) {
  if (facebookStreamingProcess[cameraId]) {
    const ffmpegFacebookStreamingProcess = facebookStreamingProcess[cameraId];
    const kill = ffmpegFacebookStreamingProcess.kill('SIGTERM'); 
    console.log(kill);
    delete facebookStreamingProcess[cameraId];
    console.log(`Facebook streaming for camera ${cameraId} has been stopped.`);
  } else {
    console.log(`No active facebook streaming process found for camera ${cameraId}.`);
  }
}

// Stop stream
function stopStream(cameraId) {
  _socketIO.emit('stream_stopped', { cameraId });
  if (streamingProcesses[cameraId]) {
    const ffmpegProcess = streamingProcesses[cameraId];
    ffmpegProcess.kill('SIGTERM'); 
    delete streamingProcesses[cameraId]; 
    console.log(`Streaming for camera ${cameraId} has been stopped.`);
  } else {
    console.log(`No active streaming process found for camera ${cameraId}.`);
  }
}

// Call API to start capture 
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

// Call API to start stream
const startStreamHandler = async (req, res) => {
  const cameraId = req.params.cameraId;
  const rtsp = req.body.rtspLink;

  if (!cameraStreamingStatus.hasOwnProperty(cameraId)) {
      cameraStreamingStatus[cameraId] = {
          isStreaming: false
      };
  }

  if (!cameraStreamingStatus[cameraId].isStreaming) {
      cameraStreamingStatus[cameraId].isStreaming = true;
      startStreaming(cameraId, rtsp);
      await CameraCtrl.updateCameraStatus(cameraId, null, isStreaming = true);
      res.status(200).send(`Streaming process started successfully for camera ${cameraId}.`);
  } else {
      res.status(400).send(`Streaming process is already running for camera ${cameraId}.`);
  }
};

// Call API to start facebook stream
const startFacebookStreamHandler = async (req, res) => {
  const cameraId = req.params.cameraId;
  const rtsp = req.body.rtspLink;

  if (!cameraStreamingStatus.hasOwnProperty(cameraId)) {
      cameraStreamingStatus[cameraId] = {
          isStreaming: false
      };
  }

  if (!cameraStreamingStatus[cameraId].isStreaming) {
      cameraStreamingStatus[cameraId].isStreaming = true;
      startFacebookStream(cameraId, rtsp);
      await CameraCtrl.updateCameraStatus(cameraId, null , true);
      res.status(200).send(`Facebook Streaming process started successfully for camera ${cameraId}.`);
  } else {
      res.status(400).send(`Facebook Streaming process is already running for camera ${cameraId}.`);
  }
};

// Call API to stop capture
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

// Call API to stop stream
const stopStreamHandler = async (req, res) => {
  const cameraId = req.params.cameraId;
  stopStream(cameraId);

  if (!streamingProcesses[cameraId]) {
      if (cameraStreamingStatus.hasOwnProperty(cameraId)) {
          cameraStreamingStatus[cameraId].isStreaming = false;
      }

      try {
          await CameraCtrl.updateCameraStatus(cameraId, null,isStreaming = false);
          res.status(200).send(`Streaming stopped successfully for camera ${cameraId}.`);
      } catch (err) {
          res.status(500).send(`Error stopping streaming for camera ${cameraId}: ${err.message}`);
      }
  } else {
      res.status(400).send(`Streaming process is still running for camera ${cameraId}.`);
  }
};

// Call API to stop facebook stream 
const stopFacebookStreamHandler = async (req, res) => {
  const cameraId = req.params.cameraId;
  stopFacebookStreaming(cameraId);
  if (!facebookStreamingProcess[cameraId]) {
      if (cameraStreamingStatus.hasOwnProperty(cameraId)) {
        cameraStreamingStatus[cameraId].isStreaming = false;
      }

      try {
          await CameraCtrl.updateCameraStatus(cameraId, isCapturing = null, isStreaming = false);
          res.status(200).send(`Facebook Streaming stopped successfully for camera ${cameraId}.`);
      } catch (err) {
          res.status(500).send(`Error stopping streaming for camera ${cameraId}: ${err.message}`);
      }
  } else {
      res.status(400).send(`Facebook Streaming process is still running for camera ${cameraId}.`);
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

let player1Score = 0;
let player2Score = 0;
const maxScore = 11;

// Update score board
function updateScoreboard() {
  const width = 1920;
  const height = 150;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');
  const player1Name = 'Danh';
  const player2Name = 'Beo';

  // Colors and positions
  const blueGradient = ctx.createLinearGradient(0, 0, width / 2, height);
  blueGradient.addColorStop(0, '#0000A0');
  blueGradient.addColorStop(1, '#000070');

  const redGradient = ctx.createLinearGradient(width / 2, 0, width, height);
  redGradient.addColorStop(0, '#A00000');
  redGradient.addColorStop(1, '#700000');

  const whiteColor = '#FFFFFF';
  const blackColor = '#000000';

  // Draw background with gradient
  ctx.fillStyle = blueGradient;
  ctx.fillRect(0, 0, width / 2, height);

  ctx.fillStyle = redGradient;
  ctx.fillRect(width / 2, 0, width / 2, height);

  // Draw player names
  ctx.fillStyle = whiteColor;
  ctx.font = '50px Arial';
  ctx.textAlign = 'center';
  ctx.fillText(player1Name.toUpperCase(), width / 4, height / 2 + 15);
  ctx.fillText(player2Name.toUpperCase(), width - width / 4, height / 2 + 15);

  // Draw scores
  ctx.font = '60px Arial Bold';
  ctx.fillText(player1Score.toString().padStart(2, '0'), width / 2 - 200, height / 2 + 20);
  ctx.fillText(player2Score.toString().padStart(2, '0'), width / 2 + 200, height / 2 + 20);

  // Draw race info
  ctx.fillStyle = blackColor;
  ctx.fillRect(width / 2 - 150, 0, 300, height);
  ctx.fillStyle = whiteColor;
  ctx.font = '45px Arial';
  ctx.fillText(`RACE TO ${maxScore}`, width / 2, height / 2 + 15);

  // Save file
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(scoreboardPath, buffer);

  // Increment scores
  player1Score = (player1Score + 1) % maxScore;
  player2Score = (player2Score + 1) % maxScore;
}




module.exports = {
  startCaptureHandler,
  startStreamHandler,
  stopCaptureHandler,
  stopStreamHandler,
  startFacebookStreamHandler,
  stopFacebookStreamHandler,
  checkRtspHandler,
  updateScoreboard,
  setSocketIO,
};