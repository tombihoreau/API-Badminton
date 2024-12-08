'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Reservations', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      courtId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Courts',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      startTime: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      endTime: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      isCancelled: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false, // Par défaut, une réservation n'est pas annulée
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Reservations');
  },
};
