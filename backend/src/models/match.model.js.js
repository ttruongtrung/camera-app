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

/**
 * create new Match: create(object)
 * find a Match: findByPk(id)
 * get all Match: findAll()
 * update a Match: update(data, where: { id: id })
 * remove a Match: destroy(where: { id: id })
 * remove all Match: destroy(where: {})
 * find all Match by title: findAll({ where: { title: ... } })
 */
