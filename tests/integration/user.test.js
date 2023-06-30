import { expect } from 'chai';
import request from 'supertest';
import mongoose from 'mongoose';
import HttpStatus from 'http-status-codes';
import app from '../../src/index';

// Declaring variables
let userLoginToken;
let userId;

describe('User APIs Test', () => {
  before((done) => {
    const clearCollections = () => {
      for (const collection in mongoose.connection.collections) {
        // This will give one by one collection to delete it.
        mongoose.connection.collections[collection].deleteOne(() => {}); // To delete collections so that the testing can be ferform with newer collections
      }
    };

    const mongooseConnect = async () => {
      await mongoose.connect(process.env.DATABASE_TEST);
      clearCollections();
    };

    if (mongoose.connection.readyState === 0) {
      mongooseConnect();
    } else {
      clearCollections();
    }

    done();
  });

  // Testing for User Registration
  describe('POST /registration', () => {
    it('given new user when added should return status 201', (done) => {
      const userdetails = {
        firstName: 'Akhil',
        lastName: 'Mondal',
        emailId: 'akhilmondal@gmail.com',
        passWord: 'iamthetester'
      };
      request(app)
        .post('/api/v1/users')
        .send(userdetails)
        .end((err, res) => {
          expect(res.statusCode).to.be.equal(HttpStatus.CREATED);
          done();
        });
    });

    it('given new user when added should return status 400', (done) => {
      const userdetails = {
        firstName: 1234,
        lastName: 'Mondal',
        emailId: 'akhilmondal@gmail.com',
        passWord: 'iamthetester'
      };
      request(app)
        .post('/api/v1/users')
        .send(userdetails)
        .end((err, res) => {
          expect(res.statusCode).to.be.equal(HttpStatus.BAD_REQUEST);
          done();
        });
    });
  });

  // Testing for User Login
  describe('POST /User Login', () => {
    it('Given user details to login should return status 202', (done) => {
      const userdetails = {
        emailId: 'akhilmondal@gmail.com',
        passWord: 'iamthetester'
      };
      request(app)
        .post('/api/v1/users/login')
        .send(userdetails)
        .end((err, res) => {
          userLoginToken = res.body.userToken; // Assigning the token to the variable from user Controller
          userId = res.body.userToken._id;
          expect(res.statusCode).to.be.equal(HttpStatus.ACCEPTED);
          done();
        });
    });

    it('Given user details to login should return status 400', (done) => {
      const userdetails = {
        emailId: 'akhilmandal@gmail.com',
        passWord: 'iamthetester'
      };
      request(app)
        .post('/api/v1/users/login')
        .send(userdetails)
        .end((err, res) => {
          expect(res.statusCode).to.be.equal(HttpStatus.BAD_REQUEST);
          done();
        });
    });
  });

  // Testing for Notes
  // Create new note
  var noteId;
  describe('POST /create new note', () => {
    it('given new note when added should return status 201', (done) => {
      const noteDetails = {
        title: 'My First Note',
        description: 'hello everyone'
      };
      request(app)
        .post('/api/v1/notes')
        .set('Authorization', `Bearer ${userLoginToken}`) // Setting the bearer token for the authorization
        .send(noteDetails)
        .end((err, res) => {
          noteId = res.body.data._id;
          expect(res.statusCode).to.be.equal(HttpStatus.CREATED);
          done();
        });
    });

    it('given new note when added should return status 400', (done) => {
      const noteDetails = {
        title: 'hi',
        description: 'hello everyone'
      };
      request(app)
        .post('/api/v1/notes')
        .set('Authorization', `Bearer ${userLoginToken}`) // Setting the bearer token for the authorization
        .send(noteDetails)
        .end((err, res) => {
          expect(res.statusCode).to.be.equal(HttpStatus.BAD_REQUEST);
          done();
        });
    });
  });

  // Get All Notes
  describe('GET / get all notes', () => {
    it('given get all notes should return status 200', (done) => {
      request(app)
        .get('/api/v1/notes')
        .set('Authorization', `Bearer ${userLoginToken}`) // Setting the bearer token for the authorization
        .end((err, res) => {
          expect(res.statusCode).to.be.equal(HttpStatus.OK);
          done();
        });
    });

    it('getall note should return status 400', (done) => {
      const noteDetails = {
        createdBy: '649d904c883340455da018b6'
      };
      request(app)
        .post('/api/v1/notes')
        .set('Authorization', `Bearer ${userLoginToken}`) // Setting the bearer token for the authorization
        .send(noteDetails)
        .end((err, res) => {
          expect(res.statusCode).to.be.equal(HttpStatus.BAD_REQUEST);
          done();
        });
    });
  });

  // Get note by id
  describe('GET/notes/:_id', () => {
    it('get single note using id should return 200', (done) => {
      request(app)
        .get(`/api/v1/notes/${noteId}`)
        .set('Authorization', `Bearer ${userLoginToken}`)
        .end((err, res) => {
          expect(res.statusCode).to.be.equal(HttpStatus.OK);
          done();
        });
    });
  });

  // Update note by id
  describe('PUT/notes/:_id', () => {
    it('given new updated note when added should return status 202', (done) => {
      const noteDetails = {
        title: 'My First Note',
        description: 'Bye everyone'
      };
      request(app)
        .put(`/api/v1/notes/${noteId}`)
        .set('Authorization', `Bearer ${userLoginToken}`) // Setting the bearer token for the authorization
        .send(noteDetails)
        .end((err, res) => {
          expect(res.statusCode).to.be.equal(HttpStatus.ACCEPTED);
          done();
        });
    });
  });

  // Add to Archive
  describe('PUT /note/archive/:_id', () => {
    it('Adding note to archive should return 200', (done) => {
      request(app)
        .put(`/api/v1/notes/archive/${noteId}`)
        .set('Authorization', `Bearer ${userLoginToken}`)
        .end((err, res) => {
          expect(res.statusCode).to.be.equal(HttpStatus.OK);
          done();
        });
    });
  });

  // Add to Trash
  describe('PUT /note/trash/:_id', () => {
    it('Adding note to archive should return 200', (done) => {
      request(app)
        .put(`/api/v1/notes/trash/${noteId}`)
        .set('Authorization', `Bearer ${userLoginToken}`)
        .end((err, res) => {
          expect(res.statusCode).to.be.equal(HttpStatus.OK);
          done();
        });
    });
  });

  //Delete note from the collection
  describe(`DELETE /note/:_id`, () => {
    it('Delete note from the collection should return 200', (done) => {
      request(app)
        .delete(`/api/v1/notes/${noteId}`)
        .set('Authorization', `Bearer ${userLoginToken}`)
        .end((err, res) => {
          expect(res.statusCode).to.be.equal(HttpStatus.OK);
          done();
        });
    });
  });
});
