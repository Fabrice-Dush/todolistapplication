"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const mongoose_1 = __importStar(require("mongoose"));
const validator_1 = __importDefault(require("validator"));
const todo_1 = __importDefault(require("./todo"));
const { isEmail } = validator_1.default;
const userSchema = new mongoose_1.Schema({
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
    todos: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'Todo' }],
});
//? Paused hashing password
userSchema.pre('save', async function (next) {
    try {
        const salt = bcrypt_1.default.genSaltSync(12);
        this.salt = salt;
        this.password = bcrypt_1.default.hashSync(this.password, salt);
        // next();
    }
    catch (err) {
        next(err);
    }
});
const login = async function (email, password) {
    try {
        const user = await this.findOne({ email });
        if (!user)
            throw new Error('Email not registered');
        const isTrue = bcrypt_1.default.compareSync(password, user.password);
        if (!isTrue)
            throw new Error('Password is incorrect');
        return user;
    }
    catch (err) {
        throw err;
    }
};
exports.login = login;
userSchema.post('findOneAndDelete', async function (user) {
    const msg = await todo_1.default.deleteMany({ _id: { $in: user.todos } });
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
const User = mongoose_1.default.model('User', userSchema);
exports.default = User;
//# sourceMappingURL=user.js.map