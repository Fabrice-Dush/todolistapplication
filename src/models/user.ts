import bcrypt from 'bcrypt';
import mongoose, { Schema } from 'mongoose';
import validator from 'validator';
import Todo from './todo';
const { isEmail } = validator;

export interface userInterface {
  salt: string;
  fullname: string;
  email: string;
  password: string;
  username: string;
  todos: [{ id: Schema.Types.ObjectId }];
}

const userSchema = new Schema({
  username: String,
  salt: {
    type: String,
  },
  fullname: { type: String, minlength: 5 },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    validate: isEmail,
    // validate: function (val) {
    //   const regex = /([a-z]{3,})([a-z0-9]*)@([a-z]{3,})\.([a-z]{2,8})/g;
    //   return regex.test(val);
    // },
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    trim: true,
    minlength: 6,
    // validate: val => {
    //   const regex = /([A-Z]+)([a-z]+)([0-9]+)([!@#$%&?]+)/g;
    //   return regex.test(val);
    // },
  },
  todos: [{ type: Schema.Types.ObjectId, ref: 'Todo' }],
});

//? Paused hashing password
userSchema.pre('save', async function (next) {
  try {
    const salt = bcrypt.genSaltSync(12);
    this.salt = salt;
    this.password = bcrypt.hashSync(this.password, salt);
    // next();
  } catch (err) {
    next(err);
  }
});

export const login = async function (email: string, password: string) {
  try {
    const user = await this.findOne({ email });
    if (!user) throw new Error('Email not registered');
    const isTrue = bcrypt.compareSync(password, user.password);
    if (!isTrue) throw new Error('Password is incorrect');
    return user;
  } catch (err) {
    throw err;
  }
};

userSchema.post('findOneAndDelete', async function (user) {
  const msg = await Todo.deleteMany({ _id: { $in: user.todos } });
  console.log(msg);
});

// const comparePasswords = function (
//   plainPassword: string,
//   password: string
// ): boolean {
//   return plainPassword === password;
// };

// export const login = async function (email: string, password: string) {
//   try {
//     const user = await User.findOne({ email });
//     if (!user) throw new Error(`L You don't have an account yet!!!`);
//     // const isTrue = this.comparePasswords(password, user.password);
//     const isTrue = comparePasswords(password, user.password);
//     if (!isTrue) throw new Error('L Wrong email or password');
//     return user;
//   } catch (err) {
//     throw err;
//   }
// };

const User = mongoose.model('User', userSchema);
export default User;
