import
db
from './db';
import {

    DataTypes
} from 'sequelize';
const Card = db.define('Card', {
    cardName: {
        type: DataTypes.STRING,
        allowNull: true
    },
    attachment: {
        type: DataTypes.STRING,
        allowNull: true
    },
    comment: {
        type: DataTypes.STRING,
        allowNull: true
    },
    createBy: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    description: {
        type: DataTypes.STRING,
        allowNull: true
    },
    dueDate: {
        type: DataTypes.DATE,
        allowNull: true
    },
    idColumn: {
        type: DataTypes.INTEGER,
        allowNull: false
    },

});


export default Card;