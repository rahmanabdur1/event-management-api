const express = require('express');
const { createEvent, listEvents, getEvent, updateEvent, deleteEvent, addParticipant, removeParticipant } = require('./controllers');

const router = express.Router();

router.post('/events', createEvent);
router.get('/events', listEvents);
router.get('/events/:id', getEvent);
router.put('/events/:id', updateEvent);
router.delete('/events/:id', deleteEvent);
router.post('/events/:id/participants', addParticipant);
router.delete('/events/:id/participants/:participantId', removeParticipant);

module.exports = router;
