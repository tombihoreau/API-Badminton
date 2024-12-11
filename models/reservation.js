const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Reservation = sequelize.define("Reservation", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Users",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    slotId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Slots",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    isCancelled: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  });

  // Associations
  Reservation.associate = (models) => {
    Reservation.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
    Reservation.belongsTo(models.Slot, { foreignKey: 'slotId', as: 'slot' });
  };

  return Reservation;
};
