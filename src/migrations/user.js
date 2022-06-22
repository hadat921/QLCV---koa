'use strict';
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Users', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            realName: {
                type: Sequelize.STRING
            },
            userName: {
                type: Sequelize.STRING

            },
            password: {
                type: Sequelize.STRING
            },
            avatar: {
                type: Sequelize.STRING
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            phoneNumber: {
                allowNull: false,
                type: Sequelize.STRING
            },
            email: {
                allowNull: true,
                type: Sequelize.STRING
            },
            accessToken: {
                default: "",
                type: Sequelize.STRING

            }

        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('Users');
        await Sequelize
    }
};