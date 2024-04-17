import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User, { login } from './../models/user';
import { SECRET } from './../secret';

const maxAge = 3 * 24 * 60 * 60;
const generateToken = function (id: Number): String {
  const token = jwt.sign({ id }, SECRET, {
    expiresIn: maxAge,
  });

  return token;
};

export const loginGET = async function (req: Request, res: Response) {
  res.render('users/login');
};

export const loginPOST = async function (
  req: Request<{}, {}, { email: string; password: string }>,
  res: Response,
  next: NextFunction
) {
  try {
    const { email, password } = req.body;
    const user = await login(email, password);
    console.log(user);
    const token = generateToken(user.id);
    res.cookie('jwt', token, { maxAge: maxAge * 1000, httpOnly: true });
    res.status(200).json({ user });
  } catch (err) {
    next(err);
  }
};

export const signupGET = async function (req: Request, res: Response) {
  res.render('users/signup');
};

export const signupPOST = async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const user = new User(req.body);
    await user.save();
    const token = generateToken(user.id);
    res.cookie('jwt', token, { maxAge: maxAge * 1000, httpOnly: true });
    res.status(200).json({ user });
  } catch (err) {
    next(err);
  }
};

export const logout = function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.log('Logged you out bruh');
  res.cookie('jwt', '', { maxAge: 1 });
  res.redirect('/');
};

export const settings = async function (req: Request, res: Response) {
  try {
    res.render('users/settings');
  } catch (err) {}
};

export const deleteAccount = async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const user = req.body.authenticatedUser;
    const msg = await User.findByIdAndDelete(user.id);
    res.redirect('/todos');
  } catch (err) {
    next(err);
  }
};
