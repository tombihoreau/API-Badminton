"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "Fields",
      [
        {
          name: "A",
          available: true,
          reasonUnavailable: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "B",
          available: true,
          reasonUnavailable: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "C",
          available: true,
          reasonUnavailable: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "D",
          available: true,
          reasonUnavailable: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Fields", null, {});
  },
};
