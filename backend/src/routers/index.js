const express = require('express');
const router = express.Router();
const { startCaptureHandler, stopCaptureHandler, checkRtspHandler } = require('../handlers/cameraStreamHandlers');
const path = require('path');
const { authenticate, authorize } = require('../middlewares/auth');
const CameraCtrl = require('../controllers/camera.controller');
const VideoSegmentCtrl = require('../controllers/videoSegment.controller');
const MatchCtrl = require('../controllers/match.controller');

const customMiddleware = (req, res, next) => {
    console.log('Custom middleware called', req.body);
    next();
};

router.post('/api/login', authenticate);

router.use('/api/storage', express.static(path.join(__dirname, '..', '..', 'public', 'videos')));
router.get('/api/cameras', authorize, (req, res) => CameraCtrl.getAllCameras(req, res));
router.post('/api/camera', customMiddleware, authorize, (req, res) => CameraCtrl.createCamera(req, res));
router.put('/api/camera/:id', authorize, (req, res) => CameraCtrl.updateCamera(req, res));
router.delete('/api/camera/:id', authorize, (req, res) => CameraCtrl.deleteCameraById(req, res));
router.get('/api/camera/:cameraId/segments', (req, res) => VideoSegmentCtrl.getVideoSegmentsByCameraId(req, res));
router.get('/api/camera/:cameraId/matches', (req, res) => MatchCtrl.getAllMatchesByCameraId(req, res));
router.post('/api/camera/:cameraId/matches', (req, res) => MatchCtrl.createMatches(req, res));
router.delete('/api/camera/:cameraId/matches', (req, res) => MatchCtrl.deleteAllMatchesByCameraId(req, res));

router.post('/api/camera/:cameraId/start-capture', authorize, startCaptureHandler);
router.post('/api/camera/:cameraId/stop-capture', authorize, stopCaptureHandler);
router.post('/api/camera/:cameraId/check-rtsp', authorize, checkRtspHandler);

module.exports = router;
