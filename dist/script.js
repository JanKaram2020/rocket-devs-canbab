const { useState } = React;

const INITIAL_TASKS = [
{
  id: 0,
  boardId: "ToDo",
  title: "Task A" },

{
  id: 1,
  boardId: "ToDo",
  title: "Task B" },

{
  id: 2,
  boardId: "In Progress",
  title: "Task C" }];



function Task({
  title,
  moveUp,
  moveDown,
  moveLeft,
  moveRight,
  disableUp,
  disableDown })
{
  return /*#__PURE__*/(
    React.createElement("div", { className: "task" }, /*#__PURE__*/
    React.createElement("div", null, title), /*#__PURE__*/
    React.createElement("div", { className: "arrows" }, /*#__PURE__*/
    React.createElement("button", { onClick: moveUp, disabled: disableUp }, "\u21E7"), /*#__PURE__*/


    React.createElement("button", { onClick: moveDown, disabled: disableDown }, "\u21E9"), /*#__PURE__*/


    React.createElement("button", { onClick: moveLeft }, "\u21E6"), /*#__PURE__*/
    React.createElement("button", { onClick: moveRight }, "\u21E8"))));



}

function List({ title, tasks, onMoveTask }) {
  return /*#__PURE__*/(
    React.createElement("div", { className: "list" }, /*#__PURE__*/
    React.createElement("h3", null, title),
    tasks.map((task, index) => {
      return /*#__PURE__*/(
        React.createElement(Task, {
          key: task.id,
          title: task.title,
          disableDown: index + 1 === tasks.length,
          disableUp: index === 0,
          moveUp: () => onMoveTask(task.id, "up"),
          moveDown: () => onMoveTask(task.id, "down"),
          moveLeft: () => onMoveTask(task.id, "left"),
          moveRight: () => onMoveTask(task.id, "right") }));


    })));


}

function Board() {
  const lists = ["ToDo", "In Progress", "Done"];
  const [tasks, setTasks] = useState(INITIAL_TASKS);
  const [addingTask, setAddingTask] = useState(false);

  const handleMoveTask = (taskId, direction) => {
    const taskIndex = tasks.findIndex(t => t.id === taskId);

    if (taskIndex === -1) return;
    const task = tasks[taskIndex];
    const newTasks = [...tasks];

    if (["up", "down"].includes(direction)) {
      newTasks.splice(taskIndex, 1);
      const aboveIndex = tasks.findLastIndex(
      (t, i) => t.boardId === task.boardId && i < taskIndex);

      const belowIndex = tasks.findIndex(
      (t, i) => t.boardId === task.boardId && i > taskIndex);

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
          Done: "ToDo" },

        left: {
          ToDo: "Done",
          "In Progress": "ToDo",
          Done: "In Progress" } };



      newTask.boardId = newBoardId[direction][task.boardId];
      newTasks.splice(taskIndex, 1);
      newTasks.splice(taskIndex, 0, newTask);

      setTasks(newTasks);
    }
  };

  const handleAddTask = e => {
    e.preventDefault();
    const title = e.target.task.value;
    setTasks(p => {
      const newTasks = [...p];

      newTasks.push({
        id: p.length,
        boardId: "ToDo",
        title });


      return newTasks;
    });
    setAddingTask(false);
    e.target.reset();
  };

  return /*#__PURE__*/(
    React.createElement("div", { className: "container" }, /*#__PURE__*/
    React.createElement("div", { className: "board" },
    lists.map((list) => /*#__PURE__*/
    React.createElement(List, {
      key: list,
      title: list,
      tasks: tasks.filter(task => task.boardId === list),
      onMoveTask: handleMoveTask }))), /*#__PURE__*/



    React.createElement("div", { className: "add-form" },
    addingTask ? /*#__PURE__*/
    React.createElement("form", { onSubmit: handleAddTask }, /*#__PURE__*/
    React.createElement("label", null, "Task label", /*#__PURE__*/

    React.createElement("input", { name: "task" })), /*#__PURE__*/

    React.createElement("button", { type: "submit" }, "Add")) : /*#__PURE__*/


    React.createElement("button", {
      onClick: () => {
        setAddingTask(true);
      } }, "Add Task"))));







}

function App() {
  return /*#__PURE__*/React.createElement(Board, null);
}

ReactDOM.render( /*#__PURE__*/React.createElement(App, null), document.getElementById("root"));