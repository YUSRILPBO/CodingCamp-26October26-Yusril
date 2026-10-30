// ===== Constants & State =====
const STORAGE_KEYS = {
  transactions: "ebv_transactions",
  categories: "ebv_categories",
  theme: "ebv_theme",
  sort: "ebv_sort",
};

const DEFAULT_CATEGORIES = ["Food", "Transport", "Fun"];
const CHART_COLORS = [
  "#2ecc71", "#3498db", "#e67e22", "#9b59b6", "#e74c3c",
  "#1abc9c", "#f1c40f", "#34495e", "#fd79a8", "#00b894",
];

let transactions = load(STORAGE_KEYS.transactions, []);
let categories = load(STORAGE_KEYS.categories, [...DEFAULT_CATEGORIES]); // copy to avoid mutating the shared default
let chart = null;

// ===== DOM =====
const form = document.getElementById("transaction-form");
const nameInput = document.getElementById("item-name");
const amountInput = document.getElementById("amount");
const categorySelect = document.getElementById("category");
const formError = document.getElementById("form-error");
const newCategoryInput = document.getElementById("new-category");
const addCategoryBtn = document.getElementById("add-category-btn");
const categoryError = document.getElementById("category-error");
const sortSelect = document.getElementById("sort");
const listEl = document.getElementById("transaction-list");
const listEmpty = document.getElementById("list-empty");
const balanceEl = document.getElementById("total-balance");
const chartEmpty = document.getElementById("chart-empty");
const themeToggle = document.getElementById("theme-toggle");

// ===== Storage helpers =====
function load(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (e) {
    return fallback;
  }
}

function save(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    /* storage unavailable: app still works for this session */
  }
}

// ===== Formatting =====
function formatMoney(value) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

// ===== Categories =====
function renderCategories() {
  const current = categorySelect.value;
  categorySelect.innerHTML = "";
  categories.forEach((cat) => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    categorySelect.appendChild(option);
  });
  if (categories.includes(current)) categorySelect.value = current;
}

function addCategory() {
  const value = newCategoryInput.value.trim();
  categoryError.textContent = "";

  if (!value) {
    categoryError.textContent = "Please enter a category name.";
    return;
  }
  if (categories.some((c) => c.toLowerCase() === value.toLowerCase())) {
    categoryError.textContent = "That category already exists.";
    return;
  }

  categories.push(value);
  save(STORAGE_KEYS.categories, categories);
  newCategoryInput.value = "";
  renderCategories();
  categorySelect.value = value;
}

// ===== Transactions =====
function addTransaction(event) {
  event.preventDefault();

  const name = nameInput.value.trim();
  const amount = parseFloat(amountInput.value);
  const category = categorySelect.value;

  // Validation: all fields must be filled
  if (!name || amountInput.value === "" || !category) {
    formError.textContent = "Please fill in all fields.";
    return;
  }
  if (isNaN(amount) || amount <= 0) {
    formError.textContent = "Amount must be greater than 0.";
    return;
  }

  formError.textContent = "";
  transactions.push({ id: Date.now(), name, amount, category });
  save(STORAGE_KEYS.transactions, transactions);

  form.reset();
  categorySelect.value = category;
  render();
}

function deleteTransaction(id) {
  transactions = transactions.filter((t) => t.id !== id);
  save(STORAGE_KEYS.transactions, transactions);
  render();
}

function getSortedTransactions() {
  const list = [...transactions];
  switch (sortSelect.value) {
    case "amount-desc":
      return list.sort((a, b) => b.amount - a.amount);
    case "amount-asc":
      return list.sort((a, b) => a.amount - b.amount);
    case "category":
      return list.sort((a, b) => a.category.localeCompare(b.category));
    default:
      return list.sort((a, b) => b.id - a.id); // newest first
  }
}

// ===== Rendering =====
function renderList() {
  listEl.innerHTML = "";
  const sorted = getSortedTransactions();
  listEmpty.style.display = sorted.length ? "none" : "block";

  sorted.forEach((t) => {
    const li = document.createElement("li");
    li.className = "transaction-item";

    const info = document.createElement("div");

    const nameEl = document.createElement("div");
    nameEl.className = "t-name";
    nameEl.textContent = t.name; // textContent prevents HTML injection

    const amountEl = document.createElement("div");
    amountEl.className = "t-amount";
    amountEl.textContent = formatMoney(t.amount);

    const catEl = document.createElement("span");
    catEl.className = "t-category";
    catEl.textContent = t.category;

    info.append(nameEl, amountEl, catEl);

    const delBtn = document.createElement("button");
    delBtn.className = "btn btn-danger";
    delBtn.textContent = "Delete";
    delBtn.addEventListener("click", () => deleteTransaction(t.id));

    li.append(info, delBtn);
    listEl.appendChild(li);
  });
}

function renderBalance() {
  const total = transactions.reduce((sum, t) => sum + t.amount, 0);
  balanceEl.textContent = formatMoney(total);
}

function renderChart() {
  const totals = {};
  transactions.forEach((t) => {
    totals[t.category] = (totals[t.category] || 0) + t.amount;
  });

  const labels = Object.keys(totals);
  const data = Object.values(totals);
  const colors = labels.map(
    (label) => CHART_COLORS[categories.indexOf(label) % CHART_COLORS.length]
  );

  const hasData = data.length > 0;

  // If Chart.js failed to load from the CDN, hide the canvas and show the
  // empty-state message regardless of whether transactions exist, so the
  // form, Transaction list, and Total_Balance keep working without an
  // empty canvas being displayed.
  if (typeof Chart === "undefined") {
    document.getElementById("spending-chart").style.display = "none";
    chartEmpty.style.display = "block";
    return;
  }

  chartEmpty.style.display = hasData ? "none" : "block";
  document.getElementById("spending-chart").style.display = hasData ? "block" : "none";

  const legendColor = getComputedStyle(document.documentElement)
    .getPropertyValue("--text").trim();

  if (chart) chart.destroy();
  if (!hasData) return;

  chart = new Chart(document.getElementById("spending-chart"), {
    type: "pie",
    data: {
      labels,
      datasets: [{ data, backgroundColor: colors, borderWidth: 2, borderColor: "#fff" }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: "bottom", labels: { color: legendColor } },
        tooltip: {
          callbacks: {
            label: (ctx) => ` ${ctx.label}: ${formatMoney(ctx.parsed)}`,
          },
        },
      },
    },
  });
}

function render() {
  renderBalance();
  renderList();
  renderChart();
}

// ===== Theme (dark / light) =====
function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  themeToggle.textContent = theme === "dark" ? "☀️" : "🌙";
}

function toggleTheme() {
  const next = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
  applyTheme(next);
  save(STORAGE_KEYS.theme, next);
  renderChart(); // refresh legend text color
}

// ===== Init =====
form.addEventListener("submit", addTransaction);
addCategoryBtn.addEventListener("click", addCategory);
newCategoryInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    addCategory();
  }
});
sortSelect.addEventListener("change", () => {
  save(STORAGE_KEYS.sort, sortSelect.value);
  renderList();
});
themeToggle.addEventListener("click", toggleTheme);

applyTheme(load(STORAGE_KEYS.theme, "light"));
sortSelect.value = load(STORAGE_KEYS.sort, "newest");
renderCategories();
render();
