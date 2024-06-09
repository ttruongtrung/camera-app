const { DataTypes } = require('sequelize');

module.exports = (sequelize, Sequelize) => {
  const Match = sequelize.define('videos_match', {
    // id: {
    //   type: DataTypes.INTEGER,
    //   primaryKey: true,
    //   autoIncrement: true
    // },
    player1Name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    player2Name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    player1Score: {
      type: DataTypes.NUMBER,
      allowNull: false
    },
    player2Score: {
      type: DataTypes.NUMBER,
      allowNull: false
    },
    race: {
      type: DataTypes.NUMBER,
      allowNull: false
    },
    playerWin: {
      type: DataTypes.NUMBER,
      allowNull: false
    },
    time: {
			type: DataTypes.DATE,
			allowNull: true
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
  });

  return Match;
};

