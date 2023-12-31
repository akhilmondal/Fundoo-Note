import dotenv from 'dotenv';
dotenv.config();
import User from '../models/user.model';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import * as utils from '../utils/sendmail.util';
import { customLogger } from '../config/logger';

//create new user
export const newUser = async (body) => {
  const userPresent = await User.findOne({ emailId: body.emailId });
  if (userPresent) {
    throw new Error('User is already Present. ');
  } else {
    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);
    const hash = bcrypt.hashSync(body.passWord, salt);
    body.passWord = hash;
    const data = await User.create(body);
    return data;
  }
};

//get user by email id
export const userLogin = async (body) => {
  const data = await User.findOne({ emailId: body.emailId });
  if (data) {
    if (bcrypt.compareSync(body.passWord, data.passWord)) {
      var token = jwt.sign(
        { id: data.id, emailId: data.emailId },
        process.env.SECRET_KEY,
        { expiresIn: '10h' }
      );
      customLogger.info(`User registered succesfully.`);
      return token;
    } else {
      throw new Error('Invalid Password.');
    }
  } else {
    throw new Error('Invalid emailId.');
  }
};

//user login by using call backs
export const userloginCallback = (body, callback) => {
  User.findOne({ emailId: body.emailId }, (error, data) => {
    if (error) {
      return callback(error);
    }
    if (data) {
      if (bcrypt.compareSync(body.passWord, data.passWord)) {
        var token = jwt.sign(
          { id: data.id, emailId: data.emailId },
          process.env.SECRET_KEY,
          { expiresIn: '10h' }
        );
        customLogger.info('User registered successfully.');
        return callback(null, token);
      } else {
        return callback(new Error('Invalid Password'));
      }
    } else {
      return callback(new Error('invalid emailId'));
    }
  });
};

// Forget PassWord
export const forgetPassWord = async (body) => {
  const data = await User.findOne({ emailId: body.emailId });
  if (data) {
    const token = jwt.sign(
      {
        emailId: data.emailId,
        _id: data._id
      },
      process.env.PASSWORD_RESET_KEY,
      { expiresIn: '10h' }
    );
    await utils.sendMail(data.emailId, token);
    return token;
  } else {
    throw new Error('Email id not found.');
  }
};

// Service for reset password
export const resetPassWord = async (body) => {
  const saltRounds = 10;
  const salt = bcrypt.genSaltSync(saltRounds);
  const hash = bcrypt.hashSync(body.passWord, salt);
  body.passWord = hash;
  const data = await User.findByIdAndUpdate({ _id: body._id }, body, {
    new: true
  });
  if (!data) {
    throw new Error('Invalid user id. ');
  } else {
    return data;
  }
};
