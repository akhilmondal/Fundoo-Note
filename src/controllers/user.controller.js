import HttpStatus from 'http-status-codes';
import * as UserService from '../services/user.service';
import { error } from '@hapi/joi/lib/base';

/**
 * Controller to create a new user
 * @param  {object} req - request object
 * @param {object} res - response object
 * @param {Function} next
 */
export const newUser = async (req, res, next) => {
  try {
    const data = await UserService.newUser(req.body);
    res.status(HttpStatus.CREATED).json({
      code: HttpStatus.CREATED,
      data: data,
      message: 'User created successfully'
    });
  } catch (error) {
    res.status(HttpStatus.BAD_REQUEST).json({
      code: HttpStatus.BAD_REQUEST,
      message: `${error}`
    });
  }
};

// Controller to login an user
export const userLogin = async (req, res, next) => {
  try {
    const userToken = await UserService.userLogin(req.body);
    res.status(HttpStatus.ACCEPTED).json({
      code: HttpStatus.ACCEPTED,
      userToken: userToken,
      message: 'User logged in successfully'
    });
  } catch (error) {
    res.status(HttpStatus.BAD_REQUEST).json({
      code: HttpStatus.BAD_REQUEST,
      message: `${error}`
    });
  }
};

//controller for User login by using CallBack functions
export const userloginCallback = (req, res) => {
  UserService.userloginCallback(req.body, (err, data) => {
    if (err) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        code: HttpStatus.BAD_REQUEST,
        message: `${err}`
      });
    }
    return res.status(HttpStatus.ACCEPTED).json({
      code: HttpStatus.ACCEPTED,
      userToken: data,
      message: 'User logged in successfully'
    });
  });
};

// Controller for forget password
export const forgetPassWord = async (req, res, next) => {
  try {
    const userToken = await UserService.forgetPassWord(req.body);
    res.status(HttpStatus.OK).json({
      code: HttpStatus.OK,
      userToken: userToken,
      message: 'Mail has sent to the recovery email'
    });
  } catch (error) {
    res.status(HttpStatus.BAD_REQUEST).json({
      code: HttpStatus.BAD_REQUEST,
      message: `${error}`
    });
  }
};

//Controller to reset password of the user
export const resetPassWord = async (req, res, next) => {
  try {
    const data = await UserService.resetPassWord(req.body);
    res.status(HttpStatus.ACCEPTED).json({
      code: HttpStatus.ACCEPTED,
      data: data,
      message: 'Password reset succesfully.'
    });
  } catch (error) {
    res.status(HttpStatus.BAD_REQUEST).json({
      code: HttpStatus.BAD_REQUEST,
      message: `${error}`
    });
  }
};
