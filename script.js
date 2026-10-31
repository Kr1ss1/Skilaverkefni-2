const tasks = [
  { id: 1, title: "Klára HTML", done: true },
  { id: 2, title: "Æfa CSS", done: false },
  { id: 3, title: "Byrja á JS", done: false },
];

let nextId = 4;
let currentFilter = "all";

const taskForm = document.querySelector("#task-form");
const taskInput = document.querySelector("#task-input");
const formError = document.querySelector("#form-error");
const taskList = document.querySelector("#task-list");
const emptyMessage = document.querySelector("#empty-message");
const totalCount = document.querySelector("#total-count");
const doneCount = document.querySelector("#done-count");
const openCount = document.querySelector("#open-count");
const filterButtons = document.querySelectorAll(".filter-button");

function getVisibleTasks() {
  if (currentFilter === "done") {
    return tasks.filter((task) => task.done);
  }

  if (currentFilter === "open") {
    return tasks.filter((task) => !task.done);
  }

  return tasks;
}

function createTaskElement(task) {
  const item = document.createElement("li");
  item.classList.add("task-item");

  if (task.done) {
    item.classList.add("done");
  }

  const label = document.createElement("label");
  label.classList.add("task-label");

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = task.done;
  checkbox.addEventListener("change", () => toggleTask(task.id));

  const title = document.createElement("span");
  title.classList.add("task-title");
  title.textContent = task.title;

  const deleteButton = document.createElement("button");
  deleteButton.type = "button";
  deleteButton.classList.add("delete-button");
  deleteButton.textContent = "Eyða";
  deleteButton.addEventListener("click", () => deleteTask(task.id));

  label.append(checkbox, title);
  item.append(label, deleteButton);

  return item;
}

function getEmptyMessage() {
  if (tasks.length === 0) {
    return "Hér er ekkert ennþá. Bættu við fyrsta verkefninu!";
  }

  if (currentFilter === "open") {
    return "Allt klárað. Vel gert!";
  }

  return "Ekkert klárað ennþá, en þetta kemur!";
}

function renderTasks() {
  const visibleTasks = getVisibleTasks();

  taskList.innerHTML = "";

  visibleTasks.forEach((task) => {
    taskList.append(createTaskElement(task));
  });

  emptyMessage.textContent = getEmptyMessage();
  emptyMessage.hidden = visibleTasks.length > 0;
}

function renderStats() {
  const finishedTasks = tasks.filter((task) => task.done).length;

  totalCount.textContent = tasks.length;
  doneCount.textContent = finishedTasks;
  openCount.textContent = tasks.length - finishedTasks;
}

function updatePage() {
  renderTasks();
  renderStats();
}

function addTask(title) {
  tasks.push({ id: nextId, title: title, done: false });
  nextId++;
  updatePage();
}

function toggleTask(id) {
  const task = tasks.find((task) => task.id === id);

  if (task) {
    task.done = !task.done;
    updatePage();
  }
}

function deleteTask(id) {
  const index = tasks.findIndex((task) => task.id === id);

  if (index !== -1) {
    tasks.splice(index, 1);
    updatePage();
  }
}

function setFilter(filter) {
  currentFilter = filter;

  filterButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.filter === filter);
  });

  renderTasks();
}

function handleFormSubmit(event) {
  event.preventDefault();

  const title = taskInput.value.trim();

  if (title === "") {
    formError.textContent = "Æ, það gleymdist að skrifa verkefnið.";
    taskInput.focus();
    return;
  }

  formError.textContent = "";
  addTask(title);
  taskInput.value = "";
  taskInput.focus();
}

taskForm.addEventListener("submit", handleFormSubmit);

filterButtons.forEach((button) => {
  button.addEventListener("click", () => setFilter(button.dataset.filter));
});

updatePage();
