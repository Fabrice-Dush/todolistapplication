import { Request, Response, NextFunction } from 'express';
import User, { userInterface } from './../models/user';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { SECRET } from './../secret';

export const authenticate = async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const token = req.cookies.jwt;
    if (!token) return res.redirect('/login');
    const decoded: JwtPayload | string = await jwt.verify(token, SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.redirect('/login');
    req.body.authenticatedUser = user;
    next();
  } catch (err) {
    next(err);
  }
};

export const checkUser = async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { originalUrl: url } = req;
  if (url === '/login') res.locals.url = 'login';
  else if (url === '/signup') res.locals.url = 'signup';
  else res.locals.url = null;

  const token = req.cookies?.jwt;
  if (!token) {
    res.locals.user = null;
    return next();
  }

  const decoded: JwtPayload | string = await jwt.verify(token, SECRET);
  const user: userInterface = await User.findById(decoded.id);

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
