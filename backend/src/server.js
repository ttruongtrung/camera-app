const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();
const port = process.env.PORT || 3001;
const cameraController = require('./controllers/camera.controller');
const router = require('./routers');
const intervalTime = 60000 * 60 * 4;
const http = require('http');
const socketIo = require('socket.io');
const streamHandler = require('./handlers/cameraStreamHandlers');

app.use(cors());


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/hls', express.static(path.join(__dirname, '../public/videos/VideoStreaming')));
app.use(express.static(path.join(__dirname, '../public')));


app.get('/', (req, res) => {
	res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.use('/', router);

const server = http.createServer(app);
const socketIO = socketIo(server, {
	cors: {
		origin: "http://localhost:3000",
		allowedHeaders: ["my-custom-header"],
		credentials: true
}
});

streamHandler.setSocketIO(socketIO)

server.listen(port, () => {
	console.log(`Server running on port ${port}`);
	setInterval(cameraController.cleanVideos, intervalTime);
	cameraController.resetAllCamerasStatusToReady();
	console.log(`Clean successfully`);
});
