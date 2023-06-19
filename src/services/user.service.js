import User from '../models/user.model';
import bcrypt from 'bcrypt';

//create new user
export const newUser = async (body) => {
  console.log('before hash----', body);
  const userPresent = await User.findOne({ emailId: body.emailId });
  if (userPresent) {
    throw new Error('User is already Present. ');
  } else {
    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);
    const hash = bcrypt.hashSync(body.passWord, salt);
    body.passWord = hash;
    console.log('hashed result-----', hash);
    console.log('after hash----', body);
    const data = await User.create(body);
    return data;
  }
};

//get user by email id
export const userLogin = async (body) => {
  console.log(body);
  const data = await User.findOne({ emailId: body.emailId });
  const hashPassword = bcrypt.compareSync(body.passWord, data.passWord);
  console.log(`The data searched by emailId ${data}`);
  if (data) {
    if (hashPassword) {
      return data;
    } else {
      throw new Error('Invalid Password.');
    }
  } else {
    throw new Error('Invalid emailId.');
  }
};
