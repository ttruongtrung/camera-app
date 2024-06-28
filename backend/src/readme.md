HOW TO MIGRATE DATABASE
1. cd to backend/src folder
2. configure the db setting in config/config.json
3. run command: npx sequelize-cli db:migrate


HOW TO CREATE NEW MIGRATION FILE FOR NEW MODEL
1. run command: npx sequelize-cli migration:generate --name create-videos-matches (for creating videos-matches table)
2. update the content of newly created file

HOW TO CREATE NEW MIGRATION FILE FOR UPDATING 
1. run command: npx sequelize-cli migration:generate --name add-description-to-videos-camera
2. update the content of newly created file

HOW TO ADD NEW FIELD INTO A EXISTING TABLE
1. add new field into existing model file, for example: Add new field rtspLink into table 'videos_camera':
    rtspLink: {
      type: DataTypes.STRING,
      allowNull: true
    },
2. run command to create new migration file:
    npx sequelize-cli migration:generate --name add-rtspLink-to-camera
3. edit new file migration:
    module.exports = {
      async up (queryInterface, Sequelize) {
        await queryInterface.addColumn('videos_cameras', 'rtspLink', {
          type: Sequelize.STRING,
          allowNull: true,
        });
      },

      async down (queryInterface, Sequelize) {
        await queryInterface.removeColumn('videos_cameras', 'rtspLink');
      }
    };
4. run command to migrate: npx sequelize-cli db:migrate
