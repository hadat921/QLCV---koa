import
db
from './db';
import {
    DataTypes
} from 'sequelize'

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