const db = require('../models');
const VideoSegment = db.VideoSegment;

module.exports = {
  create: async (req, res) => {
    const videoSegmentData = {
      cameraId: req.body.cameraId,
      description: req.body.description,
      startTime: req.body.startTime,
      endTime: req.body.endTime,
      videoFile: req.file ? req.file.path : null
    };

    try {
      const createdVideoSegment = await VideoSegment.create(videoSegmentData);
      res.status(201).send(createdVideoSegment);
    } catch (error) {
      console.error('Error creating video segment:', error);
      res.status(500).send({ error: 'Internal server error' });
    }
  },

  createWithRawData: async (data) => {
    const videoSegmentData = {
      cameraId: data.cameraId,
      description: data.description,
      startTime: data.startTime,
      endTime: data.endTime,
      videoFile: data.filePath ? data.filePath : null
    };

    try {
      const createdVideoSegment = await VideoSegment.create(videoSegmentData);
      return (createdVideoSegment);
    } catch (error) {
      console.error('Error creating video segment:', error);
      return ({ error: 'Internal server error' });
    }
  },

  getAllVideoSegments: async (req, res) => {
    try {
      const videoSegments = await VideoSegment.findAll();
      res.status(200).send(videoSegments);
    } catch (error) {
      console.error('Error retrieving video segments:', error);
      res.status(500).send({ error: 'Internal server error' });
    }
  },

  getVideoSegmentById: async (req, res) => {
    const id = req.params.id;

    try {
      const videoSegment = await VideoSegment.findByPk(id);
      if (!videoSegment) {
        res.status(404).send({ message: 'Video segment not found' });
      } else {
        res.status(200).send(videoSegment);
      }
    } catch (error) {
      console.error('Error retrieving video segment:', error);
      res.status(500).send({ error: 'Internal server error' });
    }
  },

  updateVideoSegment: async (req, res) => {
    const id = req.params.id;
    const updates = {
      cameraId: req.body.cameraId,
      description: req.body.description,
      startTime: req.body.startTime,
      endTime: req.body.endTime,
      videoFile: req.file ? req.file.path : null
    };

    try {
      const [rowsUpdated, [updatedVideoSegment]] = await VideoSegment.update(updates, {
        where: { id },
        returning: true
      });

      if (rowsUpdated === 0) {
        res.status(404).send({ message: 'Video segment not found' });
      } else {
        res.status(200).send(updatedVideoSegment);
      }
    } catch (error) {
      console.error('Error updating video segment:', error);
      res.status(500).send({ error: 'Internal server error' });
    }
  },

  deleteVideoSegmentById: async (req, res) => {
    const id = req.params.id;

    try {
      const deletedRowsCount = await VideoSegment.destroy({ where: { id } });
      if (deletedRowsCount === 0) {
        res.status(404).send({ message: 'Video segment not found' });
      } else {
        res.status(204).send();
      }
    } catch (error) {
      console.error('Error deleting video segment:', error);
      res.status(500).send({ error: 'Internal server error' });
    }
  },

  getVideoSegmentsByCameraId: async (req, res) => {
    const cameraId = req.params.cameraId;
    
    try {
      const videoSegments = await VideoSegment.findAll({ where: { cameraId }, order: [['createdAt', 'DESC']] });
      res.status(200).send(videoSegments);
    } catch (error) {
      console.error('Error retrieving video segments by cameraId:', error);
      res.status(500).send({ error: 'Internal server error' });
    }
  }
};
