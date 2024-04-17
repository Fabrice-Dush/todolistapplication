import { NextFunction, Request, Response } from 'express';
import Todo from './../models/todo';
import User from './../models/user';

export const createTodos = function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  res.render('todos/new');
};

export const createTodosPost = async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { text } = req.body;
    const todo = new Todo({ text });
    const user = req.body.authenticatedUser;
    todo.user = user;
    user.todos.push(todo);
    await todo.save();
    await user.save();
    res.redirect('/');
  } catch (err) {
    next(err);
  }
};

export const getTodoForm = async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const todo = await Todo.findById(req.params.id);
    if (!todo) throw new Error('No todo found');
    res.render('todos/edit', { todo });
  } catch (err) {
    next(err);
  }
};

export const getTodo = async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const todo = await Todo.findById(req.params.id);
    if (!todo) throw new Error('There is no such todo bruh.');
    res.render('todos/show', { todo });
  } catch (err) {
    next(err);
  }
};

export const editTodo = async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params;
    const { text: todoText } = req.body;

    const todo = await Todo.findByIdAndUpdate(
      id,
      { text: todoText },
      { new: true, runValidators: true }
    );

    res.redirect(`/todos/${todo.id}`);
  } catch (err) {
    next(err);
  }
};

export const deleteTodo = async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params;
    const todo = await Todo.findByIdAndDelete(id).populate('user');
    const user = todo.user;
    const updatedUser = await User.findByIdAndUpdate(
      user.id,
      { $pull: { todos: id } },
      { new: true, runValidators: true }
    );
    res.redirect('/');
  } catch (err) {
    next(err);
  }
};

export const deleteTodos = async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const user = await User.findOne({
      fullname: req.body.authenticatedUser.fullname,
    });

    //? Deleting todos from Todo model
    const msg = await Todo.deleteMany({ _id: { $in: user?.todos } });

    //? Deleting todos ids from User model
    user.todos = [];
    const updatedUser = await user.save();
    res.redirect('/todos');
  } catch (err) {
    next(err);
  }
};

export const markCompleted = async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const url = req.originalUrl;
    const todo = await Todo.findById(req.params.id);
    const updatedTodo = await Todo.findByIdAndUpdate(
      todo.id,
      { completed: !todo.completed },
      { new: true, runValidators: true }
    );
    res.status(200).json({ status: 'success', ok: true, redirectTo: url });
  } catch (err) {
    next(err);
  }
};

export const renderHomepage = async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const user = await User.findById(req.body.authenticatedUser?.id).populate(
      'todos'
    );
    const todos = user.todos;
    res.render('todos/index', { todos });
  } catch (err) {
    next(err);
  }
};
