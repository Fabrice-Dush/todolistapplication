"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkUser = exports.authenticate = void 0;
const user_1 = __importDefault(require("./../models/user"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const secret_1 = require("./../secret");
const authenticate = async function (req, res, next) {
    try {
        const token = req.cookies.jwt;
        if (!token)
            return res.redirect('/login');
        const decoded = await jsonwebtoken_1.default.verify(token, secret_1.SECRET);
        const user = await user_1.default.findById(decoded.id);
        if (!user)
            return res.redirect('/login');
        req.body.authenticatedUser = user;
        next();
    }
    catch (err) {
        next(err);
    }
};
exports.authenticate = authenticate;
const checkUser = async function (req, res, next) {
    const { originalUrl: url } = req;
    if (url === '/login')
        res.locals.url = 'login';
    else if (url === '/signup')
        res.locals.url = 'signup';
    else
        res.locals.url = null;
    const token = req.cookies?.jwt;
    if (!token) {
        res.locals.user = null;
        return next();
    }
    const decoded = await jsonwebtoken_1.default.verify(token, secret_1.SECRET);
    const user = await user_1.default.findById(decoded.id);
    if (!user) {
        res.locals.user = null;
        return next();
    }
    user.username = user?.fullname
        .split(' ')
        .map(word => word[0])
        .join('')
        .toUpperCase();
    res.locals.user = user;
    return next();
};
exports.checkUser = checkUser;
//# sourceMappingURL=middleware.js.map