"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const slots = [];
    const startHour = 10;
    const endHour = 22;
    const slotDuration = 45; // in minutes
    const terrains = ["A", "B", "C", "D"];

    // Calcule le nombre de créneaux pour les 6 prochains jours
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(startDate.getDate() + (6 - startDate.getDay()));

    // Récupère les ids des terrains "A", "B", "C", "D"
    const fields = await queryInterface.sequelize.query(
      'SELECT id, name FROM `Fields` WHERE name IN (:terrains)', // Use backticks for table name
      {
        replacements: { terrains },
        type: Sequelize.QueryTypes.SELECT
      }
    );
    console.log(
      "--------------------------------",
      fields,
      "--------------------------------"
    );
    const fieldsMap = fields.reduce((acc, field) => {
      acc[field.name] = field.id;
      return acc;
    }, {});

    for (let day = startDate; day <= endDate; day.setDate(day.getDate() + 1)) {
      for (let hour = startHour; hour < endHour; hour++) {
        for (let terrain of terrains) {
          const startTime = new Date(day);
          startTime.setHours(hour, 0, 0);

          const endTime = new Date(startTime);
          endTime.setMinutes(startTime.getMinutes() + slotDuration);

          slots.push({
            startTime: startTime.toTimeString().slice(0, 8),
            endTime: endTime.toTimeString().slice(0, 8),
            date: day.toISOString().slice(0, 10),
            isAvailable: true,
            fieldId: fieldsMap[terrain], // Utilise l'id du terrain récupéré dynamiquement
            createdAt: new Date(),
            updatedAt: new Date(),
          });
        }
      }
    }

    await queryInterface.bulkInsert("Slots", slots);
  },

  down: async (queryInterface, Sequelize) => {
    const { Op } = Sequelize;
    await queryInterface.bulkDelete("Slots", {
      date: {
        [Op.between]: [
          new Date().toISOString().slice(0, 10),
          new Date(new Date().setDate(new Date().getDate() + 6))
            .toISOString()
            .slice(0, 10),
        ],
      },
    });
  },
};
