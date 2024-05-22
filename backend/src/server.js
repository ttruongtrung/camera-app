const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
const port = process.env.PORT || 3001;
const db = require('./models/dbconnect');
const cameraController = require('./controllers/camera.controller');
const router = require('./routers');

// parse requests of content-type - application/json and application/x-www-form-urlencoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

db.sequelize.sync()
	.then(() => {
		console.log("Synced db.");
	})
	.catch((err) => {
		console.log('Failed to sync db: ', err.message)
	});

app.use('/', router);

app.listen(port, () => {
	console.log(`Server running on port ${port}`);
	//setInterval(cameraController.cleanVideos, intervalTime)
	console.log(`clean successfully`);

	// Reset state all cameray to ready when start server
	cameraController.resetAllCamerasStatusToReady()
});
