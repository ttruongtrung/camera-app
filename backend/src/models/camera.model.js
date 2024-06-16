const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Camera = sequelize.define('Camera', {
    status: {
      type: DataTypes.STRING,
      allowNull: false
    },
    streamingStatus: {
      type: DataTypes.STRING,
      allowNull: false
    },
    model_type: {
      type: DataTypes.STRING,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    ip_address: {
      type: DataTypes.STRING,
      allowNull: false
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
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
    tableName: 'videos_cameras'
  });

  Camera.associate = (models) => {
    Camera.hasMany(models.VideoSegment, { as: 'video_segments', foreignKey: 'cameraId' });
    Camera.hasMany(models.Match, { as: 'video_matches', foreignKey: 'cameraId' });
  };

  return Camera;
};
