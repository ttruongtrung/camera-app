const { Router } = require('express');
const router = Router();
const { startCaptureHandler, stopCaptureHandler, checkRtspHandler } = require('../handlers/cameraStreamHandlers');
const path = require('path');
const { authenticate, authorize } = require('./middlewares/auth');
const Camera = require('../models/Camera');
const VideoSegment = require('../models/VideoSegment');

const customMiddleware = (req, res, next) => {
    console.log('Custom middleware called', req.body);
    next();
};

router.post('/api/login', authenticate);

router.use('/api/storage', express.static(path.join(__dirname, '..', 'public', 'videos')));
router.get('/api/cameras', authorize, (req, res) => Camera.getAllCameras(req, res));
router.post('/api/camera', customMiddleware, authorize, (req, res) => Camera.createCamera(req, res));
router.put('/api/camera/:id', authorize, (req, res) => Camera.updateCamera(req, res));
router.delete('/api/camera/:id', authorize, (req, res) => Camera.deleteCameraById(req, res));
router.get('/api/camera/:cameraId/segments', (req, res) => VideoSegment.getVideoSegmentsByCameraId(req, res));

router.post('/api/camera/:cameraId/start-capture', authorize, startCaptureHandler);
router.post('/api/camera/:cameraId/stop-capture', authorize, stopCaptureHandler);
router.post('/api/camera/:cameraId/check-rtsp', authorize, checkRtspHandler);

module.exports = router;
