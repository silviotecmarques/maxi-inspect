function trocarAba(aba) {
  if (aba === 'dashboard') carregarDashboard();
  if (aba === 'promotores') carregarPromotores();
  if (aba === 'lojas') carregarLojas();
  if (aba === 'industrias') carregarIndustrias();
  if (aba === 'tarefas') carregarTarefas();
}

// =========================================
// DASHBOARD
// =========================================
async function carregarDashboard() {
  const res = await fetch(`${API}/execucoes`, {
    headers: getHeaders()
  });

  const data = await res.json();

  let html = "<h3>Execuções</h3>";

  data.forEach(e => {
    html += `
      <div class="card">
        <p>Status: ${e.status}</p>
        <img src="http://localhost:3000${e.imagem_url}" width="100">
      </div>
    `;
  });

  document.getElementById("conteudo").innerHTML = html;
}

// =========================================
// PROMOTORES
// =========================================
async function carregarPromotores() {
  const res = await fetch(`${API}/usuarios/promotores`, {
    headers: getHeaders()
  });

  const data = await res.json();

  let html = "<h3>Promotores</h3>";

  data.forEach(p => {
    html += `<div class="card">${p.nome}</div>`;
  });

  document.getElementById("conteudo").innerHTML = html;
}

// =========================================
// LOJAS
// =========================================
async function carregarLojas() {
  const res = await fetch(`${API}/lojas`, {
    headers: getHeaders()
  });

  const data = await res.json();

  let html = "<h3>Lojas</h3>";

  data.forEach(l => {
    html += `<div class="card">${l.tipo} - ${l.nome}</div>`;
  });

  document.getElementById("conteudo").innerHTML = html;
}

// =========================================
// INDUSTRIAS
// =========================================
async function carregarIndustrias() {
  const res = await fetch(`${API}/usuarios/industrias`, {
    headers: getHeaders()
  });

  const data = await res.json();

  let html = "<h3>Indústrias</h3>";

  data.forEach(i => {
    html += `<div class="card">${i.nome}</div>`;
  });

  document.getElementById("conteudo").innerHTML = html;
}

// =========================================
// TAREFAS (TRADES)
// =========================================
function carregarTarefas() {
  let html = `
    <h3>Criar Trade</h3>

    <input id="titulo" placeholder="Título"><br>
    <input id="produto" placeholder="Produto"><br>
    <input id="data" type="date"><br>

    <button onclick="criarTarefa()">Criar</button>
  `;

  document.getElementById("conteudo").innerHTML = html;
}

async function criarTarefa() {
  const titulo = document.getElementById("titulo").value;
  const produto = document.getElementById("produto").value;
  const data_limite = document.getElementById("data").value;

  const res = await fetch(`${API}/tarefas/criar`, {
    method: "POST",
    headers: {
      ...getHeaders(),
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      titulo,
      descricao: titulo,
      produto,
      data_limite
    })
  });

  if (res.ok) {
    alert("Trade criada!");
    carregarTarefas();
  }
}

// inicial
trocarAba('dashboard');