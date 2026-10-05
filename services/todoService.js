const Todo = require("../models/Todo");

const getAllTodos = () => Todo.find().sort({ createdAt: -1 });

const createTodo = (title) => Todo.create({ title });

const updateTodo = (id, data) =>
  Todo.findByIdAndUpdate(id, data, { new: true, runValidators: true });

const deleteTodo = (id) => Todo.findByIdAndDelete(id);

module.exports = { getAllTodos, createTodo, updateTodo, deleteTodo };
const searchTodos = (q) => {
  const safe = q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return Todo.find({ title: { $regex: safe, $options: "i" } }).sort({ createdAt: -1 });
};

module.exports = { getAllTodos, createTodo, updateTodo, deleteTodo, searchTodos };