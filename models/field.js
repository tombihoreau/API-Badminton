const { DataTypes } = require('sequelize');
module.exports = (sequelize) => {
  const Field = sequelize.define('Field', {
    id: { 
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: { 
      type: DataTypes.STRING,
      allowNull: false
    },
    available: { 
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    reasonUnavailable: { 
      type: DataTypes.STRING 
    },
  });
  return Field;
};
