module.exports = {
  HOST: "localhost",
  USER: "postgres",
  PASSWORD: "postgres",
  DB: "postgres",
  dialect: "postgres",
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
};

// Danh
// module.exports = {
//   HOST: "localhost",
//   USER: "pktdanh",
//   PASSWORD: "1231",
//   DB: "camera",
//   dialect: "postgres",
//   pool: {
//     max: 10,
//     min: 0,
//     acquire: 30000,
//     idle: 10000
//   }
// };