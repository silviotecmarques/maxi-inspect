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
        <button onclick="enviarSenha()">Entrar</button>
      </div>

      <button onclick="login()">Entrar com PIN</button>
    </div>
  `;
}

async function iniciar() {
  console.log("🔥 iniciar rodando");

  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    render(telaLogin());
    return;
  }

  render("<h2>Logado</h2>");
}

/* 🔥 FORÇA EXECUÇÃO */
document.addEventListener("DOMContentLoaded", iniciar);