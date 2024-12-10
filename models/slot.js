const { DataTypes } = require('sequelize');
module.exports = (sequelize) => {
  const Slot = sequelize.define('Slot', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    startTime: { type: DataTypes.TIME, allowNull: false },
    endTime: { type: DataTypes.TIME, allowNull: false },
    date: { type: DataTypes.DATEONLY, allowNull: false },
  });
  return Slot;
};
