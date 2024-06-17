const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const VideoSegment = sequelize.define('VideoSegment', {
    description: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    startTime: {
      type: DataTypes.DATE,
      allowNull: true
    },
    endTime: {
      type: DataTypes.DATE,
      allowNull: true
    },
    videoFile: {
      type: DataTypes.STRING,
      allowNull: true
    },
		cameraId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'videos_cameras',
        key: 'id'
      }
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'videos_videosegments'
  });

  VideoSegment.associate = (models) => {
    VideoSegment.belongsTo(models.Camera, { foreignKey: 'cameraId', as: 'camera' });
  };

  return VideoSegment;
};
