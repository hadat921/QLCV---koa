'use strict';
const {
    Model
} = require('sequelize');
const cards = require('./cards');
module.exports = (sequelize, DataTypes) => {
    class Users extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            Users.hasMany(models.Cards, {
                foreignKey: 'createBy',
                as: "Cards"
            });
            Users.hasMany(models.Columns, {
                foreignKey: 'createColumnBy',
                as: "Columns"
            });

        }
    }
    Users.init({
        userName: DataTypes.STRING,
        realName: DataTypes.STRING,
        email: DataTypes.STRING,
        password: DataTypes.STRING,
        avatar: DataTypes.STRING,
        phoneNumber: DataTypes.STRING,
        accessToken: {
            type: DataTypes.STRING,
            defaultValue: "",
        },





    }, {
        sequelize,
        modelName: 'Users',
    });
    return Users;
};