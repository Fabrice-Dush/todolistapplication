import express from "express";
import {
  createTodos,
  getTodo,
  getTodoForm,
  editTodo,
  deleteTodo,
  markCompleted,
  renderHomepage,
  createTodosPost,
  deleteTodos,
} from "./../controllers/todos";
import { authenticate } from "./../middleware/middleware";

const router = express.Router();

router
  .route("/")
  .get(authenticate, renderHomepage)
  .post(authenticate, createTodosPost);

router.get("/new", createTodos);
router.delete("/deleteAll", authenticate, deleteTodos);
router.get("/:id", authenticate, getTodo);
router.get("/:id/edit", authenticate, getTodoForm);
router.put("/:id", authenticate, editTodo);
router.patch("/:id", authenticate, markCompleted);
router.delete("/:id", authenticate, deleteTodo);

export default router;
