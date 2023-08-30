import { Schema, model } from 'mongoose';

const userSchema = new Schema(
  {
    firstName: {
      type: String
    },
    lastName: {
      type: String
    },
    emailId: {
      type: String
    },
    passWord: {
      type: String
    }
  },
  {
    timestamps: true
  }
);

export default model('User', userSchema);
// MongoDB collection associated with the model.
//It craetes Collections according to this model.
