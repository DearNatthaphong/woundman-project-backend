'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
    return queryInterface.bulkInsert('payment_types', [
      {
        name: 'ค่าบริการ',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'ค่าเวชภัณฑ์',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'ค่ายา',
        created_at: new Date(),
        updated_at: new Date()
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    return queryInterface.bulkDelete('payment_types', null, {});
  }
};
