const db = require('../models/dbconnect');
const Camera = db.camera;
const CAMERA_STATUS = require('../constants');


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
  },

  /**
 * Lấy thông tin của một camera dựa trên ID.
 * @param {number} cameraId - ID của camera cần lấy thông tin.
 */

  async getCameraInformation(cameraId) {
    try {
      const camera = await Camera.findOne({ where: { id: cameraId } });
      return camera;
    } catch (error) {
      console.error('Error fetching camera information:', error);
      throw error;
    }
  },


  /**
 * Cập nhật trạng thái isCapturing của một camera và cập nhật trạng thái status.
 * Nếu isCapturing là true, status sẽ được cập nhật thành 'starting', ngược lại status không thay đổi.
 * @param {number} cameraId - ID của camera cần cập nhật trạng thái.
 * @param {boolean} isCapturing - Trạng thái isCapturing mới của camera.
 * @throws {Error} Nếu không tìm thấy camera với ID tương ứng.
 * @throws {Error} Nếu có lỗi xảy ra trong quá trình cập nhật.
 */
  async updateCameraStatus(cameraId, isCapturing) {
    try {
      // Tìm camera dựa trên cameraId
      const camera = await Camera.findByPk(cameraId);
      if (!camera) {
        throw new Error(`Camera with ID ${cameraId} not found.`);
      }

      // Cập nhật trạng thái isCapturing và status
      camera.isCapturing = isCapturing;
      if (isCapturing) {
        camera.status = CAMERA_STATUS.STARTING;
      }
      else {
        camera.status = CAMERA_STATUS.READY;
      }

      await camera.save();

      console.log(`Camera ${cameraId} status updated successfully.`);
    } catch (error) {
      console.error(`Error updating camera ${cameraId} status:`, error);
      throw error;
    }
  }

};
