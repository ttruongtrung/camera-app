const { DataTypes } = require('sequelize');

module.exports = (sequelize, Sequelize) => {
  const Camera = sequelize.define('videos_camera', {
    // id: {
    //   type: DataTypes.INTEGER,
    //   primaryKey: true,
    //   autoIncrement: true
    // },
    status: {
      type: DataTypes.STRING,
      allowNull: false
    },

    // streamingStatus: {
    //   type: DataTypes.STRING,
    //   allowNull: false
    // },
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
  });

  return Camera;
};

/**
 * create new Camera: create(object)
 * find a Camera: findByPk(id)
 * get all Camera: findAll()
 * update a Camera: update(data, where: { id: id })
 * remove a Camera: destroy(where: { id: id })
 * remove all Camera: destroy(where: {})
 * find all Camera by title: findAll({ where: { title: ... } })
 */
