'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Columns extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            Columns.hasMany(models.Cards, {
                foreignKey: 'idColumn',
                as: "cards"
            });
            Columns.belongsTo(models.Users, {
                foreignKey: 'createColumnBy',
                as: "user_info",
            })

        }
    }
    Columns.init({
        columnName: {
            type: DataTypes.STRING,
            allowNull: false,


        },
        createColumnBy: {
            type: DataTypes.INTEGER,
            references: {
                model: "Users",
                key: "id",
                as: "createColumnBy"
            }
        },
        description: DataTypes.STRING,
        // cardOder: DataTypes.STRING
    }, {
        sequelize,
        modelName: 'Columns',
    });
    return Columns;
};