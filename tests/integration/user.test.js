import { expect } from 'chai';
import request from 'supertest';
import mongoose from 'mongoose';
import HttpStatus from 'http-status-codes';
import app from '../../src/index';

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
});
