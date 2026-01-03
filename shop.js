const API_URL = "https://fakestoreapi.com/products";

const searchInput = document.querySelector("#searchInput");
const productsContainer = document.querySelector("#products");
const statusEl = document.querySelector("#status");
const suggestionsEl = document.querySelector("#suggestions")
const sortSelect = document.querySelector("#sortSelect")


let allProducts = [];

async function loadProducts() { // async function for API download 
  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error("Data log failure");
    allProducts = await res.json();

    statusEl.textContent = `Loaded ${allProducts.length} products.`; // counting the products 
    renderProducts(allProducts); 
  } catch (err) {
    console.error(err);
    statusEl.textContent = "Cannot load the products:(";
  }
}

function renderProducts(list) { 
  if (!list.length) {
    productsContainer.innerHTML = `<p>No results.</p>`;
    return;
  }

  productsContainer.innerHTML = list.map(productCardHTML).join("");
}

function productCardHTML(p) { //creating input for html with category of product description
  return `
    <article class="product">
      <img src="${p.image}" alt="${escapeHtml(p.title)}" loading="lazy" />
      <div class="product-title">${escapeHtml(p.title)}</div>
      <div class="product-category">${escapeHtml(p.category)}</div>
      <div class="product-price">${Number(p.price).toFixed(2)} $</div>
    </article> 
  `;
} 

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function filterProducts(q) { //filter for product search
  const query = q.trim().toLowerCase();
  if (!query) return allProducts;

  return allProducts.filter((p) => {
    const haystack = `${p.title} ${p.description} ${p.category}`.toLowerCase();
    return haystack.includes(query);
  });
}

// debounce
let t = null;
searchInput.addEventListener("input", (e) => {
  state.query = e.target.value;


  clearTimeout(t);
  t = setTimeout(() => {
    applySearchRender();
    saveUiState();
  }, 150);
});

suggestionsEl.addEventListener("mousedown", (e)=> {
  const item = e.target.closest(".suggestion-item");
  if(!item) return;

  const items = getSuggestions(state.query);
  const idx = Number(item.dataset.index);
  pickSuggestion(items, idx);
  saveUiState();
});

searchInput.addEventListener("keydown", (e) => {
  const items = getSuggestions(state.query);
  if (suggestionsEl.classList.contains("hidden")) return;

  if (e.key === "ArrowDown") {
    e.preventDefault();
    state.activeIndex = Math.min(state.activeIndex + 1, items.length - 1);
    renderSuggestions(items);
  }

  if (e.key === "ArrowUp") {
    e.preventDefault();
    state.activeIndex = Math.max(state.activeIndex - 1, 0);
    renderSuggestions(items);
  }

  if (e.key === "Enter") {
    if (state.activeIndex >= 0) {
      e.preventDefault();
      pickSuggestion(items, state.activeIndex);
      saveUiState();
    }
  }

  if (e.key === "Escape") {
    hideSuggestions();
  }
});

document.addEventListener("click", (e) => {
  const inside = e.target.closest(".search-box");
  if (!inside) hideSuggestions();
});


sortSelect.addEventListener("change", (e) => {
  state.sort = e.target.value;
  applySearchRender();
  saveUiState();
});


const UI_KEY = "shop_ui_v1";

function saveUiState() {
  const payload = {
    query: state.query,
    sort: state.sort,
  };
  localStorage.setItem(UI_KEY, JSON.stringify(payload));
}

function loadUiState() {
  const raw = localStorage.getItem(UI_KEY);
  if (!raw) return;

  try {
    const parsed = JSON.parse(raw);
    if (typeof parsed.query === "string") state.query = parsed.query;
    if (typeof parsed.sort === "string") state.sort = parsed.sort;

    searchInput.value = state.query;
    sortSelect.value = state.sort;
  } catch {
    // jak coś się zepsuło w localStorage, ignorujemy
  }
}



const state = {
query: "",
sort: "relevance",
activeIndex: -1,
};

function showSuggestions(){
  suggestionsEl.classList.remove("hidden");
}

function hideSuggestions(){
  suggestionsEl.classList.add("hidden");
}

function getSuggestions(query){
  const filtered = filterProducts(query);
  return filtered.slice(0,8);
}

function renderSuggestions(items){
  if(!state.query || state.query.length < 2 || items.length === 0){
    hideSuggestions();
    return;
  }

  suggestionsEl.innerHTML = items.map((p, idx) => {
    const title = escapeHtml(p.title);
    const cat = escapeHtml(p.category);
    const price = Number(p.price).toFixed(2);
    const activeClass = idx === state.activeIndex ? "active" : "";

    return `
    <li class = "suggestion-item ${activeClass}" role = "option" data-index= "${idx}">
      <div class = "suggestion-title"> ${title}</div>
      <div class = "suggestion-meta">${cat} • ${price} $</div>
    </li>
    `;
  }).join("");

  showSuggestions();
}

function pickSuggestion(item, index) {
  const chosen = items[index];
  if (!chosen) return;

  searchInput.value = chosen.title;
  state.query = chosen.title;

  hideSuggestions();
  applySearchRender();
}

function sortProducts (list, sortMode){
  const arr = [...list]; 
switch (sortMode) {
  case "priceAsc":
    return arr.sort((a, b) => Number(a.price) - Number(b.price));
  
  case "priceDesc":
    return arr.sort((a, b) => Number(b.price) - Number(a.price));

  case "titleAsc":
    return arr.sort((a, b) => String(a.title).localeCompare(String(b.title)));

  case "titleDesc":
    return arr.sort((a, b) => String(b.title).localeCompare(String(a.title)));

    case "relevance": 
    default:
      return arr;
  }

}

function applySearchRender(){
  const filtered = filterProducts(state.query);
  const sorted = sortProducts(filtered, state.sort);

  statusEl.textContent = `Result: ${sorted.length}/ ${allProducts.length}`;
  renderProducts(sorted);

  const suggestions = getSuggestions(state.query);
  renderSuggestions(suggestions);
}



loadUiState();
loadProducts();

