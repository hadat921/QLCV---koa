'use strict';
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Cards', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            cardName: {
                type: Sequelize.STRING
            },
            description: {
                type: Sequelize.STRING
            },
            dueDate: {
                type: Sequelize.DATE
            },
            attachment: {
                type: Sequelize.STRING
            },
            comment: {
                type: Sequelize.STRING,
                default: "",
            },
            idColumn: {
                type: Sequelize.INTEGER,
                // references: {
                //   model: "Columns",
                //   key: "id",
                //   as: "idColumn"
                // }
            },
            createBy: {
                type: Sequelize.INTEGER,
                // references: {
                //   model: "Users",
                //   key: "id",
                //   as: "createBy"
                // }
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            token: {
                allowNull: true,
                type: Sequelize.STRING
            }
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('Cards');
        await Sequelize
    }
};