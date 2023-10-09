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
    return queryInterface.bulkInsert('payment_items', [
      {
        name: 'การทำแผลแห้ง/แผลเย็บ',
        price: 100.0,
        payment_type_id: 1,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'การทำแผลเปิดขนาดใหญ่ (มากกว่า 15 นาที)',
        price: 200.0,
        payment_type_id: 1,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'การทำแผลเปิด/ติดเชื้อ',
        price: 300.0,
        payment_type_id: 1,
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
    return queryInterface.bulkDelete('payment_items', null, {});
  }
};
