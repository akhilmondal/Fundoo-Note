import User from '../models/user.model';


//create new user
export const newUser = async (body) => {
  const data = await User.create(body);
  return data;
};

//get user by email id
export const userLogin = async (body) => {
  console.log(body);
  const data = await User.findOne({ emailId: body.emailId });
  console.log(`The data searched by emailId ${data}`);
  if(data) {
    if (data.passWord === body.passWord) {
      return data;
    } else {
      throw new Error("Invalid Password.");
    }
  }else {
    throw new Error("Invalid emailId.");
  }
};
