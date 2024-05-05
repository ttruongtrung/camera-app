const db = require('../models/dbconnect');
const Camera = db.camera;

module.exports = {
  createCamera: async (req, res) => {
    try {
      const cameraData = {
        status: req.body.status || 'create',
        model_type: req.body.model_type,
        name: req.body.name,
        ip_address: req.body.ip_address,
        username: req.body.username,
        password: req.body.password
      };

      const createdCamera = await Camera.create(cameraData);
      res.status(201).send(createdCamera);
    } catch (error) {
      console.error('Error creating camera:', error);
      res.status(500).send({ message: 'Internal server error' });
    }
  },

  getAllCameras: async (req, res) => {
    try {
      const cameras = await Camera.findAll();
      res.status(200).send(cameras);
    } catch (error) {
      console.error('Error retrieving cameras:', error);
      res.status(500).send({ message: 'Internal server error' });
    }
  },

  getCameraById: async (req, res) => {
    const id = req.params.id;

    try {
      const camera = await Camera.findByPk(id);
      if (!camera) {
        res.status(404).send({ message: 'Camera not found' });
      } else {
        res.status(200).send(camera);
      }
    } catch (error) {
      console.error('Error retrieving camera:', error);
      res.status(500).send({ message: 'Internal server error' });
    }
  },

  updateCamera: async (req, res) => {
    const id = req.params.id;

    try {
      const camera = await Camera.findByPk(id);
      if (!camera) {
        res.status(404).send({ message: 'Camera not found' });
        return;
      }

      const updates = {
        status: req.body.status,
        model_type: req.body.model_type,
        name: req.body.name,
        ip_address: req.body.ip_address,
        username: req.body.username,
        password: req.body.password
      };

      await camera.update(updates);
      res.status(200).send(camera);
    } catch (error) {
      console.error('Error updating camera:', error);
      res.status(500).send({ message: 'Internal server error' });
    }
  },

  deleteCameraById: async (req, res) => {
    const id = req.params.id;

    try {
      const camera = await Camera.findByPk(id);
      if (!camera) {
        res.status(404).send({ message: 'Camera not found' });
        return;
      }

      await camera.destroy();
      res.status(204).send();
    } catch (error) {
      console.error('Error deleting camera:', error);
      res.status(500).send({ message: 'Internal server error' });
    }
  }
};
