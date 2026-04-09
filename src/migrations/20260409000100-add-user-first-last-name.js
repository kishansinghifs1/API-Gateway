'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const table = await queryInterface.describeTable('Users');

    if (!table.firstName) {
      await queryInterface.addColumn('Users', 'firstName', {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'User'
      });
    }

    if (!table.lastName) {
      await queryInterface.addColumn('Users', 'lastName', {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'Name'
      });
    }
  },

  async down(queryInterface) {
    const table = await queryInterface.describeTable('Users');

    if (table.lastName) {
      await queryInterface.removeColumn('Users', 'lastName');
    }

    if (table.firstName) {
      await queryInterface.removeColumn('Users', 'firstName');
    }
  }
};
