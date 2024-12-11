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

    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  });

  Field.associate = (models) => {
    Field.hasMany(models.Slot, { foreignKey: 'fieldId', as: 'slots' });
  };
  
  return Field;
};
