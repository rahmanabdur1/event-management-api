const { DataTypes } = require('sequelize');
const sequelize = require('./db');

const Event = sequelize.define('Event', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  startTime: {
    type: DataTypes.TIME,
    allowNull: false
  },
  endTime: {
    type: DataTypes.TIME,
    allowNull: false
  },
  location: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {});

const Participant = sequelize.define('Participant', {
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  }
}, {});

Event.hasMany(Participant);
Participant.belongsTo(Event);

module.exports = { Event, Participant };
