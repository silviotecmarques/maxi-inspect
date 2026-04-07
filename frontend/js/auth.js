let userTemp = null;

// =========================================
// LOGIN COM PIN
// =========================================
async function login() {
  const pin = document.getElementById("pin").value;

  const res = await fetch(`${API}/auth/login-pin`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ pin })
  });

  const data = await res.json();

  if (!res.ok) {
    alert(data.erro || "Erro no login");
    return;
  }

  // Se precisar senha (Supervisor/Master)
  if (data.precisaSenha) {
    userTemp = data.userId;
    document.getElementById("senhaDiv").style.display = "block";
    return;
  }

  salvarLogin(data);
}

// =========================================
// LOGIN COM SENHA
// =========================================
async function enviarSenha() {
  const senha = document.getElementById("senha").value;

  const res = await fetch(`${API}/auth/login-senha`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId: userTemp, senha })
  });

  const data = await res.json();

  if (!res.ok) {
    alert(data.erro || "Erro na senha");
    return;
  }

  salvarLogin(data);
}

// =========================================
// SALVAR LOGIN (🔥 CORRIGIDO)
// =========================================
function salvarLogin(data) {
  if (!data.token) {
    alert("Erro: token não recebido");
    return;
  }

  localStorage.setItem("token", data.token);
  localStorage.setItem("usuario", JSON.stringify(data.usuario));

  console.log("Token salvo:", data.token);

  location.reload();
}