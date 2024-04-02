const { useState } = React;

const INITIAL_TASKS = [
  {
    id: 0,
    boardId: "ToDo",
    title: "Task A"
  },
  {
    id: 1,
    boardId: "ToDo",
    title: "Task B"
  },
  {
    id: 2,
    boardId: "In Progress",
    title: "Task C"
  }
];

function Task({
  title,
  moveUp,
  moveDown,
  moveLeft,
  moveRight,
  disableUp,
  disableDown
}) {
  return (
    <div className="task">
      <div>{title}</div>
      <div className="arrows">
        <button onClick={moveUp} disabled={disableUp}>
          ⇧
        </button>
        <button onClick={moveDown} disabled={disableDown}>
          ⇩
        </button>
        <button onClick={moveLeft}>⇦</button>
        <button onClick={moveRight}>⇨</button>
      </div>
    </div>
  );
}

function List({ title, tasks, onMoveTask }) {
  return (
    <div className="list">
      <h3>{title}</h3>
      {tasks.map((task, index) => {
        return (
          <Task
            key={task.id}
            title={task.title}
            disableDown={index + 1 === tasks.length}
            disableUp={index === 0}
            moveUp={() => onMoveTask(task.id, "up")}
            moveDown={() => onMoveTask(task.id, "down")}
            moveLeft={() => onMoveTask(task.id, "left")}
            moveRight={() => onMoveTask(task.id, "right")}
          />
        );
      })}
    </div>
  );
}

function Board() {
  const lists = ["ToDo", "In Progress", "Done"];
  const [tasks, setTasks] = useState(INITIAL_TASKS);
  const [addingTask, setAddingTask] = useState(false);

  const handleMoveTask = (taskId, direction) => {
    const taskIndex = tasks.findIndex((t) => t.id === taskId);

    if (taskIndex === -1) return;
    const task = tasks[taskIndex];
    const newTasks = [...tasks];

    if (["up", "down"].includes(direction)) {
      newTasks.splice(taskIndex, 1);
      const aboveIndex = tasks.findLastIndex(
        (t, i) => t.boardId === task.boardId && i < taskIndex
      );
      const belowIndex = tasks.findIndex(
        (t, i) => t.boardId === task.boardId && i > taskIndex
      );
      const newIndex = direction === "up" ? aboveIndex : belowIndex;
      newTasks.splice(newIndex, 0, task);

      setTasks(newTasks);

      return;
    }

    if (["right", "left"].includes(direction)) {
      const newTask = { ...task };
      const newBoardId = {
        right: {
          ToDo: "In Progress",
          "In Progress": "Done",
          Done: "ToDo"
        },
        left: {
          ToDo: "Done",
          "In Progress": "ToDo",
          Done: "In Progress"
        }
      };

      newTask.boardId = newBoardId[direction][task.boardId];
      newTasks.splice(taskIndex, 1);
      newTasks.splice(taskIndex, 0, newTask);

      setTasks(newTasks);
    }
  };

  const handleAddTask = (e) => {
    e.preventDefault();
    const title = e.target.task.value;
    setTasks((p) => {
      const newTasks = [...p];

      newTasks.push({
        id: p.length,
        boardId: "ToDo",
        title
      });

      return newTasks;
    });
    setAddingTask(false);
    e.target.reset();
  };

  return (
    <div className="container">
      <div className="board">
        {lists.map((list) => (
          <List
            key={list}
            title={list}
            tasks={tasks.filter((task) => task.boardId === list)}
            onMoveTask={handleMoveTask}
          />
        ))}
      </div>
      <div className="add-form">
        {addingTask ? (
          <form onSubmit={handleAddTask}>
            <label>
              Task label
              <input name="task" />
            </label>
            <button type="submit">Add</button>
          </form>
        ) : (
          <button
            onClick={() => {
              setAddingTask(true);
            }}
          >
            Add Task
          </button>
        )}
      </div>
    </div>
  );
}

function App() {
  return <Board />;
}

ReactDOM.render(<App />, document.getElementById("root"));
