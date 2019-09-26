const Sequelize = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'fsjstd-restapi.db',
  // logging: false
});

const db = {
  sequelize,
  Sequelize,
  models: {},
};

db.models.Course = require('./models/Course.js')(sequelize);
db.models.User = require('./models/User.js')(sequelize);



// Associations 

db.models.Course.belongsTo(db.models.User, {
      foreignKey: {
      fieldName: 'userId'
      },
});

db.models.User.hasMany(db.models.Course, {
          foreignKey: {
            fieldName: 'userId'
          },
});
  
      


module.exports = db;
