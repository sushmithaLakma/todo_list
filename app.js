(() => {
  "use strict";

  const CATEGORIES = {
    fitness: {
      label: "Fitness",
      icon: `<svg viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="5" r="2" stroke="#17170f" stroke-width="1.6"/>
        <line x1="12" y1="7" x2="10.5" y2="14" stroke="#17170f" stroke-width="1.6" stroke-linecap="round"/>
        <line x1="10.5" y1="14" x2="7.5" y2="20" stroke="#17170f" stroke-width="1.6" stroke-linecap="round"/>
        <line x1="10.5" y1="14" x2="14.5" y2="18.5" stroke="#17170f" stroke-width="1.6" stroke-linecap="round"/>
        <line x1="11.2" y1="9" x2="7.5" y2="11" stroke="#17170f" stroke-width="1.6" stroke-linecap="round"/>
        <line x1="11.2" y1="9" x2="15" y2="7.5" stroke="#17170f" stroke-width="1.6" stroke-linecap="round"/>
      </svg>`,
    },
    food: {
      label: "Food",
      icon: `<svg viewBox="0 0 24 24" fill="none">
        <path d="M5 12a7 5 0 0 0 14 0" stroke="#17170f" stroke-width="1.6" stroke-linecap="round"/>
        <line x1="5" y1="12" x2="19" y2="12" stroke="#17170f" stroke-width="1.6" stroke-linecap="round"/>
        <path d="M10 8q-1-2 0-4" stroke="#17170f" stroke-width="1.4" stroke-linecap="round"/>
        <path d="M14 8q1-2 0-4" stroke="#17170f" stroke-width="1.4" stroke-linecap="round"/>
      </svg>`,
    },
    family: {
      label: "Family",
      icon: `<svg viewBox="0 0 24 24" fill="none">
        <circle cx="8" cy="7" r="2.5" stroke="#17170f" stroke-width="1.6"/>
        <circle cx="16" cy="7" r="2.5" stroke="#17170f" stroke-width="1.6"/>
        <path d="M4 19a4 4 0 0 1 8 0" stroke="#17170f" stroke-width="1.6" stroke-linecap="round"/>
        <path d="M12 19a4 4 0 0 1 8 0" stroke="#17170f" stroke-width="1.6" stroke-linecap="round"/>
      </svg>`,
    },
    task: {
      label: "Task",
      icon: `<svg viewBox="0 0 24 24" fill="none">
        <path d="M4 12L20 5L13 20L11 13L4 12Z" stroke="#17170f" stroke-width="1.6" stroke-linejoin="round" stroke-linecap="round"/>
        <line x1="11" y1="13" x2="20" y2="5" stroke="#17170f" stroke-width="1.4" stroke-linecap="round"/>
      </svg>`,
    },
  };

  const STORAGE_KEY = "yetTodoTasks";

  const seedTasks = () => [
    { id: cryptoId(), title: "Games night with the family", cat: "family", meta: "Tonight · 7:00 PM", done: false },
    { id: cryptoId(), title: "Evening walk, 16 minutes", cat: "fitness", meta: "", done: true },
    { id: cryptoId(), title: "Plan the week's meals", cat: "food", meta: "", done: false },
    { id: cryptoId(), title: "Share a family reflection", cat: "family", meta: "3 responses so far", done: false },
    { id: cryptoId(), title: "Book the weekend trail", cat: "fitness", meta: "Saturday morning", done: false },
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
      <div class="card-top">
        <span class="cat-icon">${cat.icon}</span>
        <button class="check" title="${task.done ? "Mark as not done" : "Mark as done"}">${checkIcon()}</button>
      </div>
      <div class="task-main">
        <div class="task-eyebrow">${cat.label}</div>
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
