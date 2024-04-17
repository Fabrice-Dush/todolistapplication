import path from 'path';
import mongoose, { Error, MongooseError } from 'mongoose';
import methodOverride from 'method-override';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import express, { Express, Request, Response, NextFunction } from 'express';
const app: Express = express();
import User from './models/user';
import Todo from './models/todo';
import todoRoutes from './routes/todo';
import userRoutes from './routes/user';
import { checkUser, authenticate } from './middleware/middleware';
import { renderHomepage } from './controllers/todos';

mongoose
  .connect('mongodb://localhost:27017/todolistapplicationDB')
  .then(msg => console.log('Connected to Database'))
  .catch(err => {
    console.log('Ohhhh NOOOO, ERRRORRRR!!!!');
    console.error(err);
  });

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));

app.use(cookieParser());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, '/public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('*', checkUser);
app.get('/', authenticate, renderHomepage);

app.use('/', userRoutes);
app.use('/todos', todoRoutes);

app.use(function (
  err: MongooseError,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const errors = {
    fullname: '',
    email: '',
    password: err.message.startsWith('L') ? err.message.slice(1) : '',
  };
  if (err.code === 11000) {
    errors.email = 'Email already taken';
  }
  if (err.name === 'ValidationError') {
    Object.values(err.errors).forEach(properties => {
      const { path } = properties;

      if (path === 'fullname') errors.fullname = 'Fullname must be longer';
      if (path === 'email') errors.email = 'Enter a valid email';
      if (path === 'password')
        errors.password = 'Password be at least 6 characters long';
    });
  }
  res.status(500).json({ errors });
});

app.listen(3000, () => console.log('App is listening on port 3000'));
