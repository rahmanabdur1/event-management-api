const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../src/index');
const { Event, Participant } = require('../src/models');
const sequelize = require('../src/db');

chai.use(chaiHttp);
const { expect } = chai;

describe('Event Management API', () => {

  before(async () => {
    await sequelize.sync({ force: true }); // Recreate the database schema before tests
  });

  after(async () => {
    await sequelize.close(); // Close the database connection after tests
  });

  describe('POST /api/events', () => {
    it('should create a new event', (done) => {
      const event = {
        name: 'Test Event',
        date: '2024-09-15',
        startTime: '10:00:00',
        endTime: '12:00:00',
        location: 'Test Location',
        description: 'Test Description'
      };

      chai.request(app)
        .post('/api/events')
        .send(event)
        .end((err, res) => {
          expect(res).to.have.status(201);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('id');
          expect(res.body).to.have.property('name', event.name);
          done();
        });
    });

    it('should not create an event with time conflict', (done) => {
      const event = {
        name: 'Conflicting Event',
        date: '2024-09-15',
        startTime: '11:00:00',
        endTime: '01:00:00',
        location: 'Test Location',
        description: 'This should conflict with the previous event'
      };

      chai.request(app)
        .post('/api/events')
        .send(event)
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body).to.have.property('message', 'Time conflict at the same location');
          done();
        });
    });
  });

  describe('GET /api/events', () => {
    it('should list all events', (done) => {
      chai.request(app)
        .get('/api/events')
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body.rows).to.be.an('array');
          done();
        });
    });

    it('should get a specific event by ID', (done) => {
      chai.request(app)
        .get('/api/events/1')
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('id', 1);
          done();
        });
    });
  });

  describe('PUT /api/events/:id', () => {
    it('should update an event', (done) => {
      const updatedEvent = {
        name: 'Updated Event Name',
        date: '2024-09-16',
        startTime: '09:00:00',
        endTime: '11:00:00',
        location: 'Updated Location',
        description: 'Updated Description'
      };

      chai.request(app)
        .put('/api/events/1')
        .send(updatedEvent)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property('name', updatedEvent.name);
          done();
        });
    });
  });

  describe('DELETE /api/events/:id', () => {
    it('should delete an event by ID', (done) => {
      chai.request(app)
        .delete('/api/events/1')
        .end((err, res) => {
          expect(res).to.have.status(204);
          done();
        });
    });
  });

  describe('POST /api/events/:id/participants', () => {
    it('should add a participant to an event', (done) => {
      const participant = { email: 'test@example.com' };

      chai.request(app)
        .post('/api/events/2/participants')
        .send(participant)
        .end((err, res) => {
          expect(res).to.have.status(201);
          expect(res.body).to.have.property('email', participant.email);
          done();
        });
    });
  });

  describe('DELETE /api/events/:id/participants/:participantId', () => {
    it('should remove a participant from an event', (done) => {
      chai.request(app)
        .delete('/api/events/2/participants/1')
        .end((err, res) => {
          expect(res).to.have.status(204);
          done();
        });
    });
  });

});
