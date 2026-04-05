async function buscarTarefas() {
  const user = JSON.parse(localStorage.getItem("user"));

  const res = await fetch(`${API}/tarefas/loja/${user.loja_id}`, {
    headers: getHeaders()
  });

  return await res.json();
}

async function enviarExecucao(tarefa_id) {
  const imagem = document.getElementById(`img-${tarefa_id}`).files[0];

  const formData = new FormData();
  formData.append("tarefa_id", tarefa_id);
  formData.append("ponto_id", 1);
  formData.append("imagem", imagem);

  await fetch(`${API}/execucoes/enviar`, {
    method: "POST",
    headers: {
      Authorization: "Bearer " + localStorage.getItem("token")
    },
    body: formData
  });

  alert("Enviado!");
  iniciar();
}

// =========================================
// DASHBOARD
// =========================================
async function carregarDashboard() {
  const res = await fetch(`${API}/execucoes`, {
    headers: getHeaders()
  });

  const data = await res.json();

  render(telaDashboard(data));
}

// =========================================
// APROVAR
// =========================================
async function aprovar(id) {
  await fetch(`${API}/execucoes/aprovar-supervisor/${id}`, {
    method: "POST",
    headers: getHeaders()
  });

  iniciar();
}

// =========================================
// MENU
// =========================================
function mostrarPromotores() {
  document.getElementById("conteudo").innerHTML = telaCriarUsuario();
}

function mostrarLojas() {
  document.getElementById("conteudo").innerHTML = "<h2>Lojas</h2>";
}

function mostrarIndustrias() {
  document.getElementById("conteudo").innerHTML = "<h2>Indústrias</h2>";
}

function mostrarTrades() {
  document.getElementById("conteudo").innerHTML = "<h2>Trades</h2>";
}

// =========================================
// CRIAR CONVITE
// =========================================
async function criarConvite() {
  const email = document.getElementById("email").value;
  const role = document.getElementById("role").value;

  const user = JSON.parse(localStorage.getItem("user"));

  const res = await fetch(`${API}/convites/convite`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getHeaders()
    },
    body: JSON.stringify({
      email,
      role,
      empresa_id: user.empresa_id
    })
  });

  const data = await res.json();

  alert("Link gerado:\n" + data.link);
}

// =========================================
// LOGOUT
// =========================================
function logout() {
  localStorage.clear();
  iniciar();
}