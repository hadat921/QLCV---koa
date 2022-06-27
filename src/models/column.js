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
        // references: {
        //     model: "Users",
        //     key: "id",
        //     as: "createColumnBy"
        // }
    },
    description: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    // Other model options go here
});

export default Column;