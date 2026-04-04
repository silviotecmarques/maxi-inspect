let userTemp = null;

async function login() {
  const pin = document.getElementById('pin').value;

  const res = await fetch(`${API}/auth/login-pin`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ pin })
  });

  const data = await res.json();

  if (data.precisaSenha) {
    userTemp = data.userId;
    document.getElementById("senhaDiv").style.display = "block";
    return;
  }

  finalizarLogin(data);
}

async function enviarSenha() {
  const senha = document.getElementById('senha').value;

  const res = await fetch(`${API}/auth/login-senha`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      userId: userTemp,
      senha
    })
  });

  const data = await res.json();

  finalizarLogin(data);
}

function finalizarLogin(data) {
  localStorage.setItem("token", data.token);
  localStorage.setItem("user", JSON.stringify(data.usuario));

  if (data.usuario.role === "PROMOTOR") {
    window.location.href = "promotor.html";
  } else {
    window.location.href = "dashboard.html";
  }
}