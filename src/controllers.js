const { Event, Participant } = require('./models');
const { Sequelize } = require('sequelize');

// Check for time conflicts
async function checkTimeConflict(location, date, startTime, endTime) {
  const conflicts = await Event.findOne({
    where: {
      location,
      date,
      [Sequelize.Op.or]: [
        { startTime: { [Sequelize.Op.between]: [startTime, endTime] } },
        { endTime: { [Sequelize.Op.between]: [startTime, endTime] } },
        {
          [Sequelize.Op.and]: [
            { startTime: { [Sequelize.Op.lte]: startTime } },
            { endTime: { [Sequelize.Op.gte]: endTime } }
          ]
        }
      ]
    }
  });
  return conflicts;
}

async function createEvent(req, res) {
  const { name, date, startTime, endTime, location, description } = req.body;

  if (await checkTimeConflict(location, date, startTime, endTime)) {
    return res.status(400).json({ message: "Time conflict at the same location" });
  }

  const event = await Event.create({ name, date, startTime, endTime, location, description });
  res.status(201).json(event);
}

async function listEvents(req, res) {
  const limit = req.query.limit || 10;
  const offset = req.query.offset || 0;
  const events = await Event.findAndCountAll({ limit, offset });
  res.status(200).json(events);
}

async function getEvent(req, res) {
  const event = await Event.findByPk(req.params.id);
  if (!event) return res.status(404).json({ message: "Event not found" });
  res.status(200).json(event);
}

async function updateEvent(req, res) {
  const event = await Event.findByPk(req.params.id);
  if (!event) return res.status(404).json({ message: "Event not found" });

  const { name, date, startTime, endTime, location, description } = req.body;

  if (await checkTimeConflict(location, date, startTime, endTime)) {
    return res.status(400).json({ message: "Time conflict at the same location" });
  }

  await event.update({ name, date, startTime, endTime, location, description });
  res.status(200).json(event);
}

async function deleteEvent(req, res) {
  const event = await Event.findByPk(req.params.id);
  if (!event) return res.status(404).json({ message: "Event not found" });

  await event.destroy();
  res.status(204).end();
}

async function addParticipant(req, res) {
  const event = await Event.findByPk(req.params.id);
  if (!event) return res.status(404).json({ message: "Event not found" });

  const participant = await Participant.create({ email: req.body.email, EventId: event.id });
  res.status(201).json(participant);
}

async function removeParticipant(req, res) {
  const participant = await Participant.findByPk(req.params.participantId);
  if (!participant) return res.status(404).json({ message: "Participant not found" });

  await participant.destroy();
  res.status(204).end();
}

module.exports = { createEvent, listEvents, getEvent, updateEvent, deleteEvent, addParticipant, removeParticipant };
