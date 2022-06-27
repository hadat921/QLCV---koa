import
db
from './db';
const {
    Sequelize,
    DataTypes
} = require('sequelize');
const User = db.define('User', {
    userName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    realName: {
        type: DataTypes.STRING,
        allowNull: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    avatar: {
        type: DataTypes.STRING,
        allowNull: true
    },
    phoneNumber: {
        type: DataTypes.STRING,
        allowNull: true
    },
    accessToken: {
        type: DataTypes.STRING,
        defaultValue: "",

    },

});


export default User