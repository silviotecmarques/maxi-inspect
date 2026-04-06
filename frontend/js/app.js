let aba = "dashboard";

function getHeaders() {
  return {
    Authorization: "Bearer " + localStorage.getItem("token")
  };
}

function render(html) {
  document.getElementById("app").innerHTML = html;
}

// ================= LAYOUT =================
function telaSupervisor() {
  return `
    <div style="display:flex">

      <div style="width:220px;background:#111;color:#fff;height:100vh;padding:20px">
        <h2>Maxi Inspect</h2>

        <button onclick="setAba('dashboard')">Dashboard</button><br><br>
        <button onclick="setAba('trades')">Trades</button><br><br>
        <button onclick="setAba('criar')">Criar Trade</button><br><br>
        <button onclick="setAba('lojas')">Lojas</button><br><br>
        <button onclick="setAba('pontos')">Pontos</button>
      </div>

      <div style="flex:1;padding:20px">
        <h1>${aba.toUpperCase()}</h1>
        <div id="conteudo"></div>
      </div>

    </div>
  `;
}

function setAba(novaAba) {
  aba = novaAba;
  render(telaSupervisor());
  carregarConteudo();
}

// ================= CONTROLADOR =================
function carregarConteudo() {
  if (aba === "dashboard") carregarDashboard();
  if (aba === "trades") carregarTrades();
  if (aba === "criar") telaCriarTrade();
  if (aba === "lojas") telaLojas();
  if (aba === "pontos") telaPontos();
}

// ================= DASHBOARD =================
async function carregarDashboard() {
  const res = await fetch(`${API}/trades`, { headers: getHeaders() });
  const data = await res.json();

  let pendente = 0, andamento = 0, finalizado = 0;

  data.forEach(t => {
    if (!t.aprovado_supervisor) pendente++;
    else if (!t.aprovado_industria) andamento++;
    else finalizado++;
  });

  document.getElementById("conteudo").innerHTML = `
    🟥 Pendentes: ${pendente}<br>
    🟨 Em andamento: ${andamento}<br>
    🟩 Finalizados: ${finalizado}
  `;
}

// ================= TRADES =================
async function carregarTrades() {
  const res = await fetch(`${API}/trades`, { headers: getHeaders() });
  const data = await res.json();

  document.getElementById("conteudo").innerHTML = data.map(t => {
    let status = "Pendente";
    if (t.aprovado_supervisor && !t.aprovado_industria) status = "Aguardando indústria";
    if (t.aprovado_industria) status = "Finalizado";

    return `
      <div style="border:1px solid #ccc;padding:10px;margin-bottom:10px">
        <strong>${t.titulo}</strong><br>
        Status: ${status}<br><br>

        ${t.imagem ? `<img src="${API}/uploads/${t.imagem}" width="120"><br><br>` : ""}

        ${
          !t.aprovado_supervisor
            ? `<button onclick="aprovar(${t.id})">✅</button>
               <button onclick="reprovar(${t.id})">❌</button>`
            : ""
        }
      </div>
    `;
  }).join("");
}

// ================= CRIAR TRADE =================
function telaCriarTrade() {
  document.getElementById("conteudo").innerHTML = `
    <input id="tituloTrade" placeholder="Nome do trade"><br><br>

    <select id="lojaSelect"></select><br><br>
    <select id="pontoSelect"></select><br><br>

    <input id="imagemTrade" type="file"><br><br>

    <button onclick="criarTrade()">Salvar</button>
  `;

  carregarLojasSelect();
}

async function criarTrade() {
  const titulo = document.getElementById("tituloTrade").value;
  const loja_id = document.getElementById("lojaSelect").value;
  const ponto_id = document.getElementById("pontoSelect").value;
  const file = document.getElementById("imagemTrade").files[0];

  const formData = new FormData();
  formData.append("titulo", titulo);
  formData.append("loja_id", loja_id);
  formData.append("ponto_id", ponto_id);

  if (file) formData.append("imagem", file);

  await fetch(`${API}/trades`, {
    method: "POST",
    headers: getHeaders(),
    body: formData
  });

  alert("Trade criado!");
  setAba("trades");
}

// ================= LOJAS =================
function telaLojas() {
  document.getElementById("conteudo").innerHTML = `
    <h3>Criar Loja</h3>
    <input id="nomeLoja"><br><br>
    <button onclick="criarLoja()">Salvar</button>

    <div id="listaLojas"></div>
  `;

  carregarLojas();
}

async function criarLoja() {
  const nome = document.getElementById("nomeLoja").value;

  await fetch(`${API}/lojas`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getHeaders()
    },
    body: JSON.stringify({ nome })
  });

  carregarLojas();
}

async function carregarLojas() {
  const res = await fetch(`${API}/lojas`);
  const data = await res.json();

  document.getElementById("listaLojas").innerHTML =
    data.map(l => `<div>${l.nome}</div>`).join("");
}

// ================= SELECT LOJAS =================
async function carregarLojasSelect() {
  const res = await fetch(`${API}/lojas`);
  const lojas = await res.json();

  document.getElementById("lojaSelect").innerHTML =
    lojas.map(l => `<option value="${l.id}">${l.nome}</option>`).join("");

  if (lojas.length) carregarPontos(lojas[0].id);

  document.getElementById("lojaSelect").onchange = (e) => {
    carregarPontos(e.target.value);
  };
}

// ================= PONTOS =================
function telaPontos() {
  document.getElementById("conteudo").innerHTML = `
    <h3>Criar Ponto</h3>

    <select id="lojaPonto"></select><br><br>
    <input id="nomePonto"><br><br>

    <select id="tipoPonto">
      <option value="cestao">Cestão</option>
      <option value="gondola">Gôndola</option>
    </select><br><br>

    <button onclick="criarPonto()">Salvar</button>
  `;

  carregarLojasParaPonto();
}

async function carregarLojasParaPonto() {
  const res = await fetch(`${API}/lojas`);
  const lojas = await res.json();

  document.getElementById("lojaPonto").innerHTML =
    lojas.map(l => `<option value="${l.id}">${l.nome}</option>`).join("");
}

async function criarPonto() {
  const nome = document.getElementById("nomePonto").value;
  const tipo = document.getElementById("tipoPonto").value;
  const loja_id = document.getElementById("lojaPonto").value;

  await fetch(`${API}/pontos`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getHeaders()
    },
    body: JSON.stringify({ nome, tipo, loja_id })
  });

  alert("Ponto criado!");
}

// ================= AÇÕES =================
async function aprovar(id) {
  await fetch(`${API}/trades/aprovar-supervisor/${id}`, {
    method: "PUT",
    headers: getHeaders()
  });
  carregarTrades();
}

async function reprovar(id) {
  await fetch(`${API}/trades/reprovar/${id}`, {
    method: "PUT",
    headers: getHeaders()
  });
  carregarTrades();
}

// ================= START =================
function iniciar() {
  render(telaSupervisor());
  carregarConteudo();
}

document.addEventListener("DOMContentLoaded", iniciar);