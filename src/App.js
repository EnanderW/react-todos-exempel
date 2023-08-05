import { useEffect, useState } from "react";

function Todo({ title, completed, onCheck, onRemove }) {
  const onChange = (event) => {
    onCheck(event.target.checked);
  };

  return (
    <>
      <span>{title}</span>
      <input type="checkbox" checked={completed} onChange={onChange} />
      <button onClick={onRemove}>Remove</button>
    </>
  );
}

function CreateTodoForm({ onCreate }) {
  const [title, setTitle] = useState("");

  return (
    <>
      <input value={title} onChange={(event) => setTitle(event.target.value)} />
      <button
        onClick={() => {
          onCreate(title);
          setTitle("");
        }}
      >
        Add
      </button>
    </>
  );
}

function App() {
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    fetch("https://dummyjson.com/todos")
      .then((res) => res.json())
      .then((res) => setTodos(res.todos));
  }, []);

  const createTodo = (title) => {
    fetch("https://dummyjson.com/todos/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        todo: title,
        completed: false,
        userId: 1,
      }),
    })
      .then((res) => res.json())
      .then((todo) => {
        setTodos([...todos, todo]);
      });
  };

  const updateTodo = (todo, completed) => {
    fetch("https://dummyjson.com/todos/" + todo.id, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed }),
    }).then(() => {
      setTodos(
        todos.map((all) => (all === todo ? { ...todo, completed } : all))
      );
    });
  };

  const removeTodo = (todo) => {
    fetch("https://dummyjson.com/todos/" + todo.id, { method: "DELETE" }).then(
      () => {
        setTodos(todos.filter((all) => all !== todo));
      }
    );
  };

  const sortedTodos = todos.sort((a, b) => (a.completed ? 1 : -1));

  return (
    <div className="App">
      <ul>
        {sortedTodos.map((todo) => (
          <li key={todo.id}>
            <Todo
              title={todo.todo}
              completed={todo.completed}
              onCheck={(completed) => {
                updateTodo(todo, completed);
              }}
              onRemove={() => removeTodo(todo)}
            />
          </li>
        ))}
      </ul>

      <CreateTodoForm onCreate={createTodo} />
    </div>
  );
}

export default App;
