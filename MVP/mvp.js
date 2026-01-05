/* API + DOM selectors */

const USERS_URL = "https://dummyjson.com/users?limit=100"; //DummyJson with users list

const searchInput = document.querySelector("#searchInput");

const sortSelect = document.querySelector("#sortSelect");

const kpisEl = document.querySelector("#kpis");

const statusEl = document.querySelector("#status");

const tableBody = document.querySelector("#tableBody");

const prevBtn = document.querySelector("#prevBtn");

const nextBtn = document.querySelector("#nextBtn");

const pageInfo = document.querySelector("#pageInfo");

/* APP */

let allUsers = [];

const state = {
    query: "",
    sort: "nameAsc",
    page: 1, 
    pageSize: 10
};


async function loadUsers(params) {
    try{
        statusEl.textContent = "Loading…";

        const res = await fetch(USERS_URL);
        if(!res.ok) throw new Error("Data download Error");

        const data = await res.json();

        allUsers = data.users;
        renderAll();
    }catch(err){
        console.error(err);
        statusEl.textContent = "Data downloading fail";
    }
    
}

function renderKpis(users){
    
    const totalUsers = users.length;
    
    const companies = new Set(users.map(u => u.company?.name).filter(Boolean));
    const totalCompanies = companies.size;

    const avgAge = 
    users.reduce((sum, u) => sum + Number(u.age || 0), 0) / Math.max(1, totalUsers);

    const comEmails = 
    users.filter(u => String(u.email || "").toLowerCase().endsWith(".com")).length;
    const comRate = (comEmails / Math.max(1, totalUsers))* 100;

    kpisEl.innerHTML = `
       <div class="kpi">
      <div class="kpi-title">Users</div>
      <div class="kpi-value">${totalUsers}</div>
    </div>
    <div class="kpi">
      <div class="kpi-title">Companies</div>
      <div class="kpi-value">${totalCompanies}</div>
    </div>
    <div class="kpi">
      <div class="kpi-title">Avg age</div>
      <div class="kpi-value">${avgAge.toFixed(1)}</div>
    </div>
    <div class="kpi">
      <div class="kpi-title">.com emails</div>
      <div class="kpi-value">${comRate.toFixed(0)}%</div>
    </div>
  `;
}


