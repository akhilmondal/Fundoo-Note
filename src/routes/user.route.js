import express from 'express';
import * as userController from '../controllers/user.controller';
import { newUserValidator } from '../validators/user.validator';
import { userAuthForPassWordReset } from '../middlewares/auth.middleware';

const router = express.Router();

//route to create a new user
router.post('', newUserValidator, userController.newUser);

//Route to login a user
router.post('/login', userController.userLogin);

//Route to implement callback to handle api request
router.post('/logincall', userController.userloginCallback);

//Route for forget password
router.put('/forgetpass', userController.forgetPassWord);

// Route for reset password
router.put(
  '/resetpassword/:token',
  userAuthForPassWordReset,
  userController.resetPassWord
);

export default router;
