async function iniciar() {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    render(telaLogin());
    return;
  }

  if (user.role === "PROMOTOR") {
    const tarefas = await buscarTarefas();
    render(telaPromotor(tarefas));
  }

  if (user.role === "SUPERVISOR" || user.role === "MASTER") {
    await carregarDashboard();
  }
}

function render(html) {
  document.getElementById("app").innerHTML = html;
}

iniciar();