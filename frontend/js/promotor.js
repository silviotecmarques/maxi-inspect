async function carregarTarefas() {
  const user = JSON.parse(localStorage.getItem("user"));

  const res = await fetch(`${API}/tarefas/loja/${user.loja_id}`, {
    headers: getHeaders()
  });

  const tarefas = await res.json();

  const container = document.getElementById("tarefas");
  container.innerHTML = "";

  tarefas.forEach(t => {
    container.innerHTML += `
      <div class="card">
        <h3>${t.titulo}</h3>
        <p>${t.produto}</p>

        <input type="file" id="img-${t.id}"><br>

        <button onclick="enviar(${t.id})">Enviar</button>
      </div>
    `;
  });
}

async function enviar(tarefa_id) {
  const user = JSON.parse(localStorage.getItem("user"));
  const imagem = document.getElementById(`img-${tarefa_id}`).files[0];

  const formData = new FormData();
  formData.append('tarefa_id', tarefa_id);
  formData.append('loja_id', user.loja_id);
  formData.append('ponto_id', 1);
  formData.append('imagem', imagem);

  const res = await fetch(`${API}/execucoes/enviar`, {
    method: 'POST',
    headers: {
      role: localStorage.getItem("role")
    },
    body: formData
  });

  if (res.ok) {
    alert("Enviado!");
    location.reload();
  }
}

carregarTarefas();