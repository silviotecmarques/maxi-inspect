let userTemp = null;

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

  if (data.precisaSenha) {
    userTemp = data.userId;
    document.getElementById("senhaDiv").style.display = "block";
    return;
  }

  salvarLogin(data);
}

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

function salvarLogin(data) {
  localStorage.setItem("token", data.token);
  localStorage.setItem("user", JSON.stringify(data.user));
  location.reload();
}