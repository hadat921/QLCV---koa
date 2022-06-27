import
db
from './db';
const {
    Sequelize,
    DataTypes
} = require('sequelize');

const Column = db.define('Column', {
    columnName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    createColumnBy: {
        type: DataTypes.INTEGER,
    },
    description: {
        type: DataTypes.STRING,
        allowNull: true
    }
});

export default Column;