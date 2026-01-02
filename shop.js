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
    renderProducts(allProducts); //calling the render funciton 
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
  clearTimeout(t);
  t = setTimeout(() => {
    const filtered = filterProducts(e.target.value);
    statusEl.textContent = `Result: ${filtered.length} / ${allProducts.length}`;
    renderProducts(filtered);
  }, 200);
});

loadProducts();

