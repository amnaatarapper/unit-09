const Sequelize = require('sequelize');

const Course = require('./Course');

module.exports = (sequelize) => {
    class User extends Sequelize.Model {}

    User.init({
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        firstName: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
              notNull: {
                msg: 'Please provide your first name',
              },
              notEmpty: {
                msg: 'Please provide your first name',
              },
            },
          },
          lastName: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
              notNull: {
                msg: 'Please provide your last name',
              },
              notEmpty: {
                msg: 'Please provide your last name',
              },
            },
          },
          emailAddress: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
              notNull: {
                msg: 'Please provide your email address',
              },
              notEmpty: {
                msg: 'Please provide your email address',
              },
            },
          },
          password: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
              notNull: {
                msg: 'Please provide a password',
              },
              notEmpty: {
                msg: 'Please provide a password',
              },
            },
          },
    }, { sequelize });

  // Association

  User.associate = (models) => {
      User.hasMany(models.Course, {
          foreignKey: {
            fieldName: 'userId'
          },
      });
  };

    return User;
};