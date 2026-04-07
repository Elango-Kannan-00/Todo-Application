import React, { useState, useEffect } from "react";
import './App.css';

const API_URL = "https://todo-application-1-vyoo.onrender.com/todos"; // FastAPI backend

const App = () => {
  const [todo, setTodo] = useState("");
  const [todoList, setTodoList] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState("");

  // Load todos from backend
  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setTodoList(data);
    } catch (err) {
      console.error(err);
    }
  };

  const addTask = async () => {
    if (todo.trim() === "") return;
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: todo, description: "" }),
      });
      const data = await res.json();
      setTodoList([...todoList, data]);
      setTodo("");
    } catch (err) {
      console.error(err);
    }
  };

  const invertStatus = async (id) => {
    const task = todoList.find((item) => item.id === id);
    if (!task) return;

    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: task.title,
          description: task.description,
          completed: !task.completed,
        }),
      });
      const data = await res.json();
      setTodoList(todoList.map((t) => (t.id === id ? data : t)));
    } catch (err) {
      console.error(err);
    }
  };

  const deleteItem = async (id) => {
    try {
      await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      setTodoList(todoList.filter((item) => item.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const startEdit = (id) => {
    const task = todoList.find((item) => item.id === id);
    if (task) {
      setEditingId(id);
      setEditingText(task.title);
    }
  };

  const saveTask = async () => {
    if (editingText.trim() === "") return;
    const task = todoList.find((item) => item.id === editingId);
    try {
      const res = await fetch(`${API_URL}/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: editingText,
          description: task.description,
          completed: task.completed,
        }),
      });
      const data = await res.json();
      setTodoList(todoList.map((t) => (t.id === editingId ? data : t)));
      setEditingId(null);
      setEditingText("");
    } catch (err) {
      console.error(err);
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingText("");
  };

  const getTaskStyle = (completed) => ({
    cursor: "pointer",
    textDecoration: completed ? "line-through" : "none",
    color: completed ? "grey" : "black",
  });

  return (
    <div className="app-container">
      <h1 className="main-heading1">Welcome to EK's Daily-Do App</h1>
      <h2 className="main-heading2">Plan it. Do it. Done.</h2>
      <div className="todo-body">
        <h1>Make today's count.</h1>
        <div className="input">
          <input
            type="text"
            value={todo}
            placeholder="Add any task"
            onChange={(e) => setTodo(e.target.value)}
          />
          <button className="add-button" onClick={addTask}>
            Add
          </button>
        </div>

        <ul className="todo-items">
          {todoList.map((task) => {
            const isEditing = editingId === task.id;
            return (
              <li
                key={task.id}
                style={isEditing ? {} : getTaskStyle(task.completed)}
                onClick={isEditing ? undefined : () => invertStatus(task.id)}
              >
                {isEditing ? (
                  <div className="edit-input">
                    <input
                      type="text"
                      value={editingText}
                      onChange={(e) => setEditingText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") saveTask();
                        if (e.key === "Escape") cancelEdit();
                      }}
                      autoFocus
                    />
                    <button
                      className="save-button"
                      onClick={(e) => {
                        e.stopPropagation();
                        saveTask();
                      }}
                    >
                      Save
                    </button>
                    <button
                      className="cancel-button"
                      onClick={(e) => {
                        e.stopPropagation();
                        cancelEdit();
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <>
                    <span>{task.title}</span>
                    <button
                      className="edit-button"
                      onClick={(e) => {
                        e.stopPropagation();
                        startEdit(task.id);
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className="delete-button"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteItem(task.id);
                      }}
                    >
                      Delete
                    </button>
                  </>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default App;