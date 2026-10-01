const mongoose = require("mongoose");
const todoService = require("../services/todoService");

const getTodos = async (req, res) => {
  try {
    const todos = await todoService.getAllTodos();
    res.status(200).json(todos);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const createTodo = async (req, res) => {
  try {
    const { title } = req.body;
    if (!title || !title.trim()) {
      return res.status(400).json({ message: "Title is required" });
    }
    const todo = await todoService.createTodo(title);
    res.status(201).json(todo);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const updateTodo = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid todo id" });
    }
    const todo = await todoService.updateTodo(id, req.body);
    if (!todo) return res.status(404).json({ message: "Todo not found" });
    res.status(200).json(todo);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const deleteTodo = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid todo id" });
    }
    const todo = await todoService.deleteTodo(id);
    if (!todo) return res.status(404).json({ message: "Todo not found" });
    res.status(200).json({ message: "Todo deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

module.exports = { getTodos, createTodo, updateTodo, deleteTodo };