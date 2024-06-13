const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();
const port = process.env.PORT || 3001;
const db = require('./models/dbconnect');
const cameraController = require('./controllers/camera.controller');
const router = require('./routers');
const intervalTime = 60000*60*4

app.use(cors());


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/hls', express.static(path.join(__dirname, '../public/videos/VideoStreaming')));
app.use(express.static(path.join(__dirname, '../public')));


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

db.sequelize.sync()
    .then(() => {
        console.log("Synced db.");
    })
    .catch((err) => {
        console.log('Failed to sync db: ', err.message);
    });
app.use('/', router);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
    setInterval(cameraController.cleanVideos, intervalTime)
    cameraController.resetAllCamerasStatusToReady();
    console.log(`Clean successfully`);
});
