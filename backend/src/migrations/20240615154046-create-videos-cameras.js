'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('videos_cameras', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      status: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      streamingStatus: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      model_type: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      ip_address: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      username: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      }
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('videos_camera');
  }
};
