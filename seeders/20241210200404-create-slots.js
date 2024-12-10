'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const slots = [];
    const startHour = 10;
    const endHour = 22;
    const slotDuration = 45; // in minutes
    const terrains = ["A", "B", "C", "D"];

    // Calcule le nombre de creneau pour les 6 prochains jours
    const startDate = new Date(); 
    const endDate = new Date(); 
    endDate.setDate(startDate.getDate() + (6 - startDate.getDay()));

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
            fieldId: terrains.indexOf(terrain) + 1,
            createdAt: new Date(),
            updatedAt: new Date(),
          });
        }
      }
    }

    await queryInterface.bulkInsert("Slots", slots);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("Slots", {
      date: {
        [Op.between]: [
          new Date().toISOString().slice(0, 10),
          new Date(new Date().setDate(new Date().getDate() + 6)).toISOString().slice(0, 10),
        ],
      },
    });
  },
};

