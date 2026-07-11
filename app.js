(() => {
  "use strict";

  const CATEGORIES = {
    activity: { label: "Activity" },
    task: { label: "Task" },
  };

  const STORAGE_KEY = "yetTodoTasks";

  const seedTasks = () => [
    { id: cryptoId(), title: "Games night with the family", cat: "activity", meta: "Tonight · 7:00 PM", done: false },
    { id: cryptoId(), title: "Evening walk, 16 minutes", cat: "activity", meta: "Activity & Fitness", done: true },
    { id: cryptoId(), title: "Plan the week's meals", cat: "task", meta: "Food & Nutrition", done: false },
    { id: cryptoId(), title: "Share a family reflection", cat: "task", meta: "3 responses so far", done: false },
    { id: cryptoId(), title: "Book the weekend trail", cat: "activity", meta: "Saturday morning", done: false },
    { id: cryptoId(), title: "Reply to the school email", cat: "task", meta: "", done: false },
  ];

  function cryptoId() {
    return "t" + Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
  }

  function checkIcon() {
    return `<svg viewBox="0 0 16 16" fill="none"><path d="M3.5 8.5L6.5 11.5L12.5 4.5" stroke="#dcf454" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  }

  function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  let tasks = [];
  const board = document.getElementById("board");

  function load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      tasks = raw ? JSON.parse(raw) : seedTasks();
    } catch {
      tasks = seedTasks();
    }
  }

  function persist() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }

  function render() {
    board.innerHTML = "";
    tasks.forEach((task) => board.appendChild(taskCard(task)));
  }

  function taskCard(task) {
    const cat = CATEGORIES[task.cat] || CATEGORIES.task;
    const card = document.createElement("article");
    card.className = "task-card" + (task.done ? " is-done" : "");
    card.dataset.cat = task.cat;

    card.innerHTML = `
      <button class="check" title="${task.done ? "Mark as not done" : "Mark as done"}">${checkIcon()}</button>
      <div class="task-main">
        <div class="task-eyebrow"><span class="cat-dot"></span>${cat.label}</div>
        <div class="task-title">${escapeHtml(task.title)}</div>
        ${task.meta ? `<div class="task-meta">${escapeHtml(task.meta)}</div>` : ""}
      </div>
    `;

    card.querySelector(".check").addEventListener("click", () => toggleDone(task.id));
    return card;
  }

  function toggleDone(id) {
    tasks = tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t));
    persist();
    render();
  }

  load();
  render();
})();
