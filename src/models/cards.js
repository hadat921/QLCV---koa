'use strict';
const {
    Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Cards extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            Cards.belongsTo(models.Users, {
                foreignKey: 'createBy',
                as: "user_info",
            })

            ;
            Cards.belongsTo(models.Columns, {
                foreignKey: 'idColumn',
                as: "column_info"
            });

        }
    }
    Cards.init({
        cardName: DataTypes.STRING,
        dueDate: DataTypes.DATE,
        description: DataTypes.STRING,
        attachment: DataTypes.STRING,
        comment: {
            type: DataTypes.STRING,
            defaultValue: ""
        },
        idColumn: {
            type: DataTypes.INTEGER,
            references: {
                model: "Columns",
                key: "id",
                as: "idColumn"
            }
        },
        createBy: {
            type: DataTypes.INTEGER,
            references: {
                model: "Users",
                key: "id",
                as: "createBy"
            }
        }



    }, {
        sequelize,
        modelName: 'Cards',
    });
    return Cards;
};