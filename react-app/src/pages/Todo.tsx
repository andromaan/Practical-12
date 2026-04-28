import { useState } from "react";
import "../styles/pages.css";

interface TodoItem {
  id: number;
  text: string;
  completed: boolean;
}

export default function Todo() {
  const [todos, setTodos] = useState<TodoItem[]>([
    { id: 1, text: "Learn React", completed: false },
  ]);
  const [input, setInput] = useState("");

  const addTodo = () => {
    if (input.trim()) {
      setTodos([
        ...todos,
        {
          id: Date.now(),
          text: input,
          completed: false,
        },
      ]);
      setInput("");
    }
  };

  const toggleTodo = (id: number) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo,
      ),
    );
  };

  const deleteTodo = (id: number) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  return (
    <div className="page-container">
      <h1>Todo List</h1>

      <div className="form-group">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && addTodo()}
          placeholder="Add a new todo..."
          className="input-full"
          aria-label="New todo item"
        />
        <button onClick={addTodo} className="btn-primary">
          Add
        </button>
      </div>

      <ul className="todo-list">
        {todos.map((todo) => (
          <li key={todo.id} className="todo-item">
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleTodo(todo.id)}
              aria-label={`Toggle completion for: ${todo.text}`}
            />
            <span
              className={todo.completed ? "todo-text completed" : "todo-text"}
            >
              {todo.text}
            </span>
            <button
              onClick={() => deleteTodo(todo.id)}
              className="btn-danger btn-small btn-delete"
              aria-label={`Delete: ${todo.text}`}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>

      {todos.length === 0 && (
        <p className="empty-state">No todos yet. Add one to get started!</p>
      )}
    </div>
  );
}
