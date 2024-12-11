const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Slot = sequelize.define("Slot", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    startTime: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    endTime: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    isAvailable: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    fieldId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Fields", 
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
  });

  Slot.associate = (models) => {
    Slot.belongsTo(models.Field, { foreignKey: "fieldId", as: "field" });
    Slot.hasMany(models.Reservation, {
      foreignKey: "slotId",
      as: "reservations",
    });
  };

  return Slot;
};
