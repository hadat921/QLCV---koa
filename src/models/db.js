import {
  getEnv
} from '../config';
const {
  Sequelize
} = require('sequelize');
const db = new Sequelize('koa', 'root', 'root', {
  host: 'localhost',
  dialect: 'postgres',
  port: getEnv("DB_PORT"),
  logging: getEnv("DB_LOGGING") && getEnv("DB_LOGGING") == "true" ? true : false,
})
db.authenticate().then(async () => {
    console.log('Connection thanh cong');
    // await db.sync();
  })
  .catch((error) => {
    console.error('Unable to connect to the database:', error);
  })

module.exports = db