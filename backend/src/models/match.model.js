const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Match = sequelize.define('Match', {
    player1Name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    player2Name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    player1Score: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    player2Score: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    race: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    playerWin: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    time: {
      type: DataTypes.DATE,
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
    tableName: 'videos_matchs'
  });

  Match.associate = (models) => {
    Match.belongsTo(models.Camera, { foreignKey: 'cameraId', as: 'camera' });
  };

  return Match;
};
