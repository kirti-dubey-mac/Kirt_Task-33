import { useEffect, useState } from "react";
import api from "./api";

function getErrorMessage(err) {
  return err.response?.data?.message || err.message || "Something went wrong";
}

function App() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");

  // load todos (and search, with a small delay while typing)
  useEffect(() => {
    const timer = setTimeout(async () => {
      try {
        setLoading(true);
        setError("");
        const query = search.trim();
        const res = query
          ? await api.get("/search", { params: { q: query } })
          : await api.get("/");
        setTodos(res.data);
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("Title is required");
      return;
    }
    try {
      setAdding(true);
      setError("");
      const res = await api.post("/", { title });
      setTodos((prev) => [res.data, ...prev]);
      setTitle("");
      setSearch("");
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setAdding(false);
    }
  };

  const handleToggle = async (todo) => {
    try {
      setError("");
      const res = await api.put(`/${todo._id}`, { completed: !todo.completed });
      setTodos((prev) => prev.map((t) => (t._id === todo._id ? res.data : t)));
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const handleDelete = async (id) => {
    try {
      setError("");
      await api.delete(`/${id}`);
      setTodos((prev) => prev.filter((t) => t._id !== id));
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const startEdit = (todo) => {
    setEditingId(todo._id);
    setEditTitle(todo.title);
  };

  const handleSave = async (id) => {
    if (!editTitle.trim()) {
      setError("Title is required");
      return;
    }
    try {
      setError("");
      const res = await api.put(`/${id}`, { title: editTitle });
      setTodos((prev) => prev.map((t) => (t._id === id ? res.data : t)));
      setEditingId(null);
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  return (
    <div className="container">
      <h1>Todo App</h1>

      <form className="row" onSubmit={handleAdd}>
        <input
          type="text"
          placeholder="Add a new task..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <button type="submit" disabled={adding}>
          {adding ? "Adding..." : "Add"}
        </button>
      </form>

      <input
        className="search"
        type="text"
        placeholder="Search tasks..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {error && <p className="error">{error}</p>}
      {loading && <p className="loading">Loading...</p>}

      {!loading && todos.length === 0 && !error && (
        <p className="empty">No tasks found.</p>
      )}

      <ul>
        {todos.map((todo) => (
          <li key={todo._id}>
            {editingId === todo._id ? (
              <>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                />
                <button onClick={() => handleSave(todo._id)}>Save</button>
                <button className="grey" onClick={() => setEditingId(null)}>
                  Cancel
                </button>
              </>
            ) : (
              <>
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => handleToggle(todo)}
                />
                <span className={todo.completed ? "done" : ""}>{todo.title}</span>
                <button onClick={() => startEdit(todo)}>Edit</button>
                <button className="red" onClick={() => handleDelete(todo._id)}>
                  Delete
                </button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;