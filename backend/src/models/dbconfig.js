module.exports = {
  HOST: "localhost",
  USER: "postgres",
  PASSWORD: "RAPtor1234",
  DB: "camera",
  dialect: "postgres",
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
};
