const Sequelize = require('sequelize');

const User = require('./User');

module.exports = (sequelize) => {
  class Course extends Sequelize.Model {}

  Course.init({
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Please provide a title',
        },
        notEmpty: {
          msg: 'Please provide a title',
        },
      },
    },
    description: {
      type: Sequelize.TEXT,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Please provide a description',
        },
        notEmpty: {
          msg: 'Please provide a description',
        },
      },
    },
    estimatedTime: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    materialsNeeded: {
      type: Sequelize.STRING,
      allowNull: true,
    },
  }, { sequelize });

  // Association

  Course.associate = (models) => {
    Course.belongsTo(models.User, {
        foreignKey: {
        fieldName: 'userId'
        },
    });
  };

  return Course;
};
