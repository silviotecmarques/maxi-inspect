function telaLogin() {
  return `
  <div class="content">
    <h2>Login</h2>

    <input id="pin" placeholder="PIN">

    <div id="senhaDiv" style="display:none;">
      <input id="senha" placeholder="Senha">
      <button onclick="enviarSenha()">Entrar com senha</button>
    </div>

    <button onclick="login()">Entrar</button>
  </div>
  `;
}

// =========================================
// LAYOUT BASE
// =========================================
function layoutSistema(conteudo) {
  return `
    <div class="header">
      <span class="logo">◆</span> Maxi Inspect
    </div>

    <div class="layout">

      <div class="sidebar">

        <button onclick="carregarDashboard()">📊 Dashboard</button>
        <button onclick="mostrarPromotores()">👤 Promotores</button>
        <button onclick="mostrarLojas()">🏪 Lojas</button>
        <button onclick="mostrarIndustrias()">🏢 Indústrias</button>
        <button onclick="mostrarTrades()">📦 Trades</button>

        <hr>

        <button onclick="logout()">🚪 Sair</button>

      </div>

      <div class="content" id="conteudo">
        ${conteudo}
      </div>

    </div>
  `;
}

// =========================================
// PROMOTOR
// =========================================
function telaPromotor(tarefas) {
  let html = "<h2>Minhas Tarefas</h2>";

  tarefas.forEach(t => {
    html += `
      <div class="card">
        <h3>${t.titulo}</h3>
        <input type="file" id="img-${t.id}">
        <button onclick="enviarExecucao(${t.id})">Enviar</button>
      </div>
    `;
  });

  return layoutSistema(html);
}

// =========================================
// STATUS
// =========================================
function getStatusClass(status) {
  if (status === "PENDENTE") return "pendente";
  if (status.includes("APROVADO")) return "aprovado";
  if (status.includes("REPROVADO")) return "reprovado";
}

// =========================================
// DASHBOARD
// =========================================
function telaDashboard(execucoes) {
  let html = "<h2>Execuções</h2>";

  execucoes.forEach(e => {
    html += `
      <div class="card">
        <span class="status ${getStatusClass(e.status)}">
          ${e.status}
        </span>

        <br><br>

        <img src="http://localhost:3000${e.imagem_url}" width="140">

        <br>

        <button onclick="aprovar(${e.id})">Aprovar</button>
      </div>
    `;
  });

  return layoutSistema(html);
}

// =========================================
// CRIAR USUÁRIO
// =========================================
function telaCriarUsuario() {
  return `
    <div class="card">
      <h3>Criar Usuário</h3>

      <input id="email" placeholder="Email">

      <select id="role">
        <option value="PROMOTOR">Promotor</option>
        <option value="INDUSTRIA">Indústria</option>
      </select>

      <button onclick="criarConvite()">Gerar Convite</button>
    </div>
  `;
}