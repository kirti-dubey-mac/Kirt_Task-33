const mongoose = require("mongoose");
const todoService = require("../services/todoService");

// ---------- helpers ----------

const handleError = (res, err) =>
  res.status(500).json({ message: "Server error", error: err.message });

const invalidId = (id) => !mongoose.isValidObjectId(id);

// ---------- controllers ----------

// GET /api/todos
const getTodos = async (req, res) => {
  try {
    const todos = await todoService.getAllTodos();
    res.status(200).json(todos);
  } catch (err) {
    handleError(res, err);
  }
};

// GET /api/todos/search?q=keyword
// empty q returns all todos, so clearing the search box in the UI just works
const searchTodos = async (req, res) => {
  try {
    const q = (req.query.q || "").trim();
    const todos = q
      ? await todoService.searchTodos(q)
      : await todoService.getAllTodos();
    res.status(200).json(todos);
  } catch (err) {
    handleError(res, err);
  }
};

// POST /api/todos
const createTodo = async (req, res) => {
  try {
    const title = (req.body.title || "").trim();
    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }
    const todo = await todoService.createTodo(title);
    res.status(201).json(todo);
  } catch (err) {
    handleError(res, err);
  }
};

// PUT /api/todos/:id
const updateTodo = async (req, res) => {
  try {
    const { id } = req.params;
    if (invalidId(id)) {
      return res.status(400).json({ message: "Invalid todo id" });
    }
    const todo = await todoService.updateTodo(id, req.body);
    if (!todo) {
      return res.status(404).json({ message: "Todo not found" });
    }
    res.status(200).json(todo);
  } catch (err) {
    handleError(res, err);
  }
};

// DELETE /api/todos/:id
const deleteTodo = async (req, res) => {
  try {
    const { id } = req.params;
    if (invalidId(id)) {
      return res.status(400).json({ message: "Invalid todo id" });
    }
    const todo = await todoService.deleteTodo(id);
    if (!todo) {
      return res.status(404).json({ message: "Todo not found" });
    }
    res.status(200).json({ message: "Todo deleted" });
  } catch (err) {
    handleError(res, err);
  }
};

// keep this at the very bottom
module.exports = { getTodos, searchTodos, createTodo, updateTodo, deleteTodo };