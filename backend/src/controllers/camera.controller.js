const db = require('../models');
const Camera = db.Camera;
const Videos = db.VideoSegment
const CAMERA_STATUS = require('../constants');
const cron = require('node-cron');
const moment = require('moment');
const { Op } = require('sequelize');
const path = require('path');
const fs = require('fs');
const process = require('process');
const { spawn } = require('child_process');

module.exports = {
  createCamera: async (req, res) => {
    try {
      const cameraData = {
        status: req.body.status || 'create',
        model_type: req.body.model_type,
        name: req.body.name,
        ip_address: req.body.ip_address,
        streamingStatus : 'ready',
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

  getCameraStreamingStatusById: async (req, res) => {
    const id = req.params.cameraId;
    try {
      const camera = await Camera.findByPk(id, {
        attributes: ['streamingStatus']
      });
      if (!camera) {
        res.status(404).send({ message: 'Camera for streaming status not found' });
      } else {
        res.status(200).send(camera);
      }
    } catch (error) {
      console.error('Error retrieving camera for streaming status:', error);
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
  async updateCameraStatus(cameraId, isCapturing = null, isStreaming = null) {
    try {
      // Tìm camera dựa trên cameraId
      const camera = await Camera.findByPk(cameraId);
      if (!camera) {
        throw new Error(`Camera with ID ${cameraId} not found.`);
      }
  
      if (isCapturing !== null) {
        camera.isCapturing = isCapturing;
        camera.status = isCapturing ? CAMERA_STATUS.STARTING : CAMERA_STATUS.READY;

      }
  
      if (isStreaming !== null) {
        camera.isStreaming = isStreaming;
        camera.streamingStatus = isStreaming ? CAMERA_STATUS.STREAMING : CAMERA_STATUS.READY;
      }
  
      await camera.save();
  
      console.log(`Camera ${cameraId} status updated successfully.`);
    } catch (error) {
      console.error(`Error updating camera ${cameraId} status:`, error);
      throw error;
    }
  },


  /**
  * Hàm để xóa các bản ghi video cũ hơn 4 tiếng tính từ thời điểm hiện tại.
  * 
  */
  async cleanVideos() {
    try {
      // Lấy thời gian hiện tại và trừ đi 4 tiếng
      const fourHoursAgo = moment().subtract(4, 'hours');

      // Tìm và xóa các bản ghi từ bảng `Video` có trường `createdAt` nhỏ hơn thời gian đã tính toán
      const videos = await Videos.findAll({
        where: {
          createdAt: {
            [Op.lt]: fourHoursAgo
          }
        },
        attributes: ['description']
      });

      // Lấy danh sách tên video
      const videoNames = videos.map(video => video.description);

      // Xóa các video từ cơ sở dữ liệu
      await Videos.destroy({
        where: {
          createdAt: {
            [Op.lt]: fourHoursAgo
          }
        }
      });

      // Xóa các video từ local filesystem

      const projectRoot = process.cwd();

      const filePath = '\\public\\videos\\';

      const outputPath = projectRoot + filePath;

      console.log("outputPath:", outputPath);
      const deleteFile = async (videoNames) => {
        if (videoNames.length === 0) return;
        const videoName = videoNames.shift();
        const videoPath = outputPath + videoName;
        console.log(videoPath);
        try {
          if (fs.existsSync(videoPath)) {
            fs.unlinkSync(videoPath); // Xóa video từ local filesystem
            console.log(`Deleted video ${videoName} from local filesystem.`);
          } else {
            console.log(`File ${videoName} không tồn tại.`);
          }
        } catch (err) {
          console.error(`Error deleting video ${videoName} from local filesystem:`, err);
        }
        await deleteFile(videoNames);
      };

      await deleteFile([...videoNames]); // Gọi hàm đệ quy để xóa các tệp
      console.log(`Deleted ${videoNames.length} old videos.`);
    } catch (error) {
      console.error('Error occurred while deleting old videos:', error);
      throw error;
    }
  },

  // Reset state all camera to ready
  async resetAllCamerasStatusToReady() {
    try {
      const cameras = await Camera.findAll();
      for (const camera of cameras) {
        camera.status = CAMERA_STATUS.READY;
        camera.streamingStatus = CAMERA_STATUS.READY;
        await camera.save();
      }

      console.log("All cameras status reset to READY successfully.");
    } catch (error) {
      console.error("Error resetting cameras status:", error);
      throw error;
    }
  },

  async checkRTSPStream(rtspUrl) {
    return new Promise((resolve, reject) => {
      const args = [
        '-rtsp_transport', 'tcp',
        '-i', rtspUrl,
        '-t', '1',
        '-f', 'null', '-'
      ];
      
      const ffmpegProcess = spawn('ffmpeg', args);

      ffmpegProcess.on('close', (code) => {
        if (code === 0) {
          resolve(true);
        } else {
          reject(new Error(`RTSP stream check failed with code ${code}`));
        }
      });
  
      ffmpegProcess.on('error', (err) => {
        reject(err);
      });
    });
  }

};
