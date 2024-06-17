'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('videos_matchs', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      player1Name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      player2Name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      player1Score: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      player2Score: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      race: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      playerWin: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      time: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      cameraId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'videos_cameras',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('videos_matchs');
  }
};
