(() => {
  "use strict";

  const CATEGORIES = [
    { id: "goal", label: "Goal", meta: "Long-term win" },
    { id: "activity", label: "Activity", meta: "Do it today" },
    { id: "task", label: "Task", meta: "Quick one" },
  ];

  const STORAGE_KEY = "yetTodoTasks";

  const store = {
    get() {
      return new Promise((resolve) => {
        if (typeof chrome !== "undefined" && chrome.storage && chrome.storage.local) {
          chrome.storage.local.get([STORAGE_KEY], (result) => {
            resolve(result[STORAGE_KEY] || null);
          });
        } else {
          try {
            const raw = localStorage.getItem(STORAGE_KEY);
            resolve(raw ? JSON.parse(raw) : null);
          } catch {
            resolve(null);
          }
        }
      });
    },
    set(tasks) {
      if (typeof chrome !== "undefined" && chrome.storage && chrome.storage.local) {
        chrome.storage.local.set({ [STORAGE_KEY]: tasks });
      } else {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
      }
    },
  };

  const seedTasks = () => [
    { id: cryptoId(), title: "Games night with the family", cat: "activity", meta: "Tonight · 7:00 PM", done: false },
    { id: cryptoId(), title: "Plan the week's meals", cat: "task", meta: "Food & Nutrition", done: false },
    { id: cryptoId(), title: "Evening walk, 16 minutes", cat: "goal", meta: "Activity & Fitness", done: true },
    { id: cryptoId(), title: "Share a family reflection", cat: "task", meta: "3 responses so far", done: false },
  ];

  function cryptoId() {
    return "t" + Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
  }

  let tasks = [];
  let activeFilter = "all";
  let pickerIndex = 0;

  const $ = (sel) => document.querySelector(sel);
  const listScroll = $("#listScroll");
  const tabsEl = $("#tabs");
  const composerForm = $("#composerForm");
  const taskInput = $("#taskInput");
  const catPicker = $("#catPicker");
  const catPickerDot = $("#catPickerDot");
  const progressChip = $("#progressChip");
  const progressFill = $("#progressFill");
  const clearDoneBtn = $("#clearDoneBtn");

  const CAT_COLOR_VAR = {
    goal: "--cat-goal-bg",
    activity: "--cat-activity-bg",
    task: "--cat-task-bg",
  };

  function catColor(catId) {
    return getComputedStyle(document.documentElement).getPropertyValue(CAT_COLOR_VAR[catId]).trim();
  }

  function checkIcon() {
    return `<svg viewBox="0 0 16 16" fill="none"><path d="M3.5 8.5L6.5 11.5L12.5 4.5" stroke="#dcf454" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  }

  function setToday() {
    const now = new Date();
    const weekday = now.toLocaleDateString(undefined, { weekday: "long" });
    const dateStr = now.toLocaleDateString(undefined, { month: "long", day: "numeric" });
    $("#todayLabel").textContent = weekday;
    $("#dateLine").textContent = `${weekday}, ${dateStr}`;
  }

  function render() {
    const filtered = activeFilter === "all" ? tasks : tasks.filter((t) => t.cat === activeFilter);
    const pending = filtered.filter((t) => !t.done);
    const done = filtered.filter((t) => t.done);

    listScroll.innerHTML = "";

    if (filtered.length === 0) {
      listScroll.innerHTML = `
        <div class="empty-state">
          <div class="glyph">✨</div>
          <h2>Nothing to-do<br/>(yet)</h2>
          <p>Add something fun below and watch this space fill up.</p>
        </div>`;
    } else {
      pending.forEach((t) => listScroll.appendChild(taskCard(t)));
      if (done.length) {
        const label = document.createElement("div");
        label.className = "section-label";
        label.textContent = `Done today · ${done.length}`;
        listScroll.appendChild(label);
        done.forEach((t) => listScroll.appendChild(taskCard(t)));
      }
    }

    CATEGORIES.forEach((c) => {
      const el = document.getElementById(`count-${c.id}`);
      const n = tasks.filter((t) => t.cat === c.id && !t.done).length;
      el.textContent = n ? ` ${n}` : "";
    });
    const allN = tasks.filter((t) => !t.done).length;
    document.getElementById("count-all").textContent = allN ? ` ${allN}` : "";

    const total = tasks.length;
    const doneTotal = tasks.filter((t) => t.done).length;
    progressChip.textContent = `${doneTotal} of ${total} done`;
    progressFill.style.width = total ? `${Math.round((doneTotal / total) * 100)}%` : "0%";
  }

  function taskCard(task) {
    const cat = CATEGORIES.find((c) => c.id === task.cat) || CATEGORIES[2];
    const card = document.createElement("article");
    card.className = "task-card" + (task.done ? " is-done" : "");
    card.dataset.cat = task.cat;
    card.dataset.id = task.id;

    card.innerHTML = `
      <button class="check" title="${task.done ? "Mark as not done" : "Mark as done"}">${checkIcon()}</button>
      <div class="task-main">
        <div class="task-eyebrow"><span class="cat-dot"></span>${cat.label}</div>
        <div class="task-title">${escapeHtml(task.title)}</div>
        ${task.meta ? `<div class="task-meta">${escapeHtml(task.meta)}</div>` : ""}
      </div>
      <div class="task-actions">
        <button class="delete-btn" title="Delete">&times;</button>
      </div>
    `;

    card.querySelector(".check").addEventListener("click", () => toggleDone(task.id));
    card.querySelector(".delete-btn").addEventListener("click", () => deleteTask(task.id));
    return card;
  }

  function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  function toggleDone(id) {
    tasks = tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t));
    persist();
    render();
  }

  function deleteTask(id) {
    tasks = tasks.filter((t) => t.id !== id);
    persist();
    render();
  }

  function persist() {
    store.set(tasks);
  }

  function addTask(title) {
    const cat = CATEGORIES[pickerIndex].id;
    tasks.unshift({ id: cryptoId(), title, cat, meta: "", done: false });
    persist();
    render();
  }

  tabsEl.addEventListener("click", (e) => {
    const btn = e.target.closest(".tab");
    if (!btn) return;
    tabsEl.querySelectorAll(".tab").forEach((b) => b.classList.remove("is-active"));
    btn.classList.add("is-active");
    activeFilter = btn.dataset.filter;
    render();
  });

  catPicker.addEventListener("click", () => {
    pickerIndex = (pickerIndex + 1) % CATEGORIES.length;
    const cat = CATEGORIES[pickerIndex];
    catPickerDot.style.background = catColor(cat.id);
    catPicker.title = `Category: ${cat.label} (click to change)`;
    taskInput.placeholder = `Add a ${cat.label.toLowerCase()}…`;
  });

  clearDoneBtn.addEventListener("click", () => {
    tasks = tasks.filter((t) => !t.done);
    persist();
    render();
  });

  composerForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const title = taskInput.value.trim();
    if (!title) return;
    addTask(title);
    taskInput.value = "";
    taskInput.focus();
  });

  async function init() {
    setToday();
    catPickerDot.style.background = catColor(CATEGORIES[pickerIndex].id);
    const stored = await store.get();
    tasks = stored && stored.length ? stored : seedTasks();
    if (!stored) persist();
    render();
  }

  init();
})();
