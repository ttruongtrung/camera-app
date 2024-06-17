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