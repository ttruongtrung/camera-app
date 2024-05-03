const { DataTypes, camera } = require('sequelize');
// const sequelize = require('./dbconnect.js');
//const Camera = require('./camera.model.js')(sequelize, Sequelize);

module.exports = (sequelize, Sequelize) => {
	const VideoSegment = sequelize.define('videos_videosegment', {
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

	return VideoSegment;
};
