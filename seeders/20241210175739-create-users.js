"use strict";
const bcrypt = require("bcryptjs");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const adminPassword = bcrypt.hashSync("astrongpassword", 10);
    const playerPassword = bcrypt.hashSync("motdepasseplayer", 10);

    await queryInterface.bulkInsert(
      "Users",
      [
        {
          pseudo: "admybad",
          password: adminPassword,
          role: "admin",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          pseudo: "player1",
          password: playerPassword, 
          role: "user",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Users", null, {});
  },
};
