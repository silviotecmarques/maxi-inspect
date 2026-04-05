function render(html) {
  document.getElementById("app").innerHTML = html;
}

function telaLogin() {
  return `
    <div style="padding:40px">
      <h2>Login</h2>

      <input id="pin" placeholder="PIN">

      <div id="senhaDiv" style="display:none">
        <input id="senha" placeholder="Senha">
        <button id="btnSenha">Entrar</button>
      </div>

      <button id="btnLogin">Entrar com PIN</button>
    </div>
  `;
}

function telaDashboard() {
  return `
    <div style="display:flex">

      <div style="width:200px; background:#111; color:#fff; height:100vh; padding:20px">
        <h3>Maxi Inspect</h3>
        <button id="logoutBtn">Sair</button>
      </div>

      <div style="flex:1; padding:20px">
        <h2>Dashboard</h2>

        <button id="btnNovoTrade">+ Criar Trade</button>

        <!-- FORM -->
        <div id="formTrade" style="display:none; margin-top:20px;">
          <input id="tituloTrade" placeholder="Nome do trade"><br><br>
          <input id="dataTrade" type="date"><br><br>
          <button id="salvarTrade">Salvar</button>
        </div>

        <div id="listaTrades" style="margin-top:20px">Carregando...</div>
      </div>

    </div>
  `;
}

async function carregarTrades() {
  try {
    const res = await fetch(`${API}/trades`, {
      headers: getHeaders()
    });

    const data = await res.json();

    if (!data || data.length === 0) {
      document.getElementById("listaTrades").innerHTML =
        "Nenhum trade encontrado";
      return;
    }

    document.getElementById("listaTrades").innerHTML = data.map(trade => `
      <div style="border:1px solid #ccc; padding:10px; margin-bottom:10px">
        <strong>${trade.titulo}</strong><br>
        Status: ${trade.status}<br>
        Data: ${trade.data_limite}
      </div>
    `).join("");

  } catch (err) {
    console.error(err);
    document.getElementById("listaTrades").innerHTML =
      "Erro ao carregar trades";
  }
}

function iniciar() {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    render(telaLogin());

    setTimeout(() => {
      document.getElementById("btnLogin").addEventListener("click", login);
      document.getElementById("btnSenha").addEventListener("click", enviarSenha);
    }, 0);

    return;
  }

  render(telaDashboard());

  setTimeout(() => {
    document.getElementById("logoutBtn").addEventListener("click", logout);

    document.getElementById("btnNovoTrade").addEventListener("click", () => {
      document.getElementById("formTrade").style.display = "block";
    });

    document.getElementById("salvarTrade").addEventListener("click", criarTrade);

  }, 0);

  carregarTrades();
}

function logout() {
  localStorage.clear();
  location.reload();
}

async function criarTrade() {
  const titulo = document.getElementById("tituloTrade").value;
  const data = document.getElementById("dataTrade").value;

  if (!titulo) {
    alert("Digite o nome do trade");
    return;
  }

  try {
    const res = await fetch(`${API}/trades`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({
        titulo,
        loja_id: 1,
        status: "pendente",
        data_limite: data || "2026-04-10"
      })
    });

    if (!res.ok) {
      alert("Erro ao criar trade");
      return;
    }

    alert("Trade criado!");

    document.getElementById("formTrade").style.display = "none";
    document.getElementById("tituloTrade").value = "";

    carregarTrades();

  } catch (err) {
    console.error(err);
    alert("Erro de conexão");
  }
}

document.addEventListener("DOMContentLoaded", iniciar);