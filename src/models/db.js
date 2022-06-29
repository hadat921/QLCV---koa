import {
  getEnv
} from '../config';
import {
  Sequelize
} from 'sequelize';
const db = new Sequelize(getEnv("DB_NAME"), getEnv("DB_USERNAME"), getEnv("DB_PASSWORD"), {
  host: getEnv("DB_HOST"),
  dialect: 'postgres',
  port: getEnv("DB_PORT"),
  logging: getEnv("DB_LOGGING") && getEnv("DB_LOGGING") == "true" ? true : false,
})
db.authenticate().then(async () => {
    console.log('Connection successfully');
  })
  .catch((error) => {
    console.error('Unable to connect to the database:', error);
  })

export default db;