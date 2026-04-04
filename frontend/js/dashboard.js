function getStatusClass(status) {
  if (status === 'PENDENTE') return 'pendente';
  if (status.includes('APROVADO')) return 'aprovado';
  if (status.includes('REPROVADO')) return 'reprovado';
}

async function carregarDashboard() {
  const res = await fetch(`${API}/execucoes`, {
    headers: getHeaders()
  });

  const data = await res.json();

  const container = document.getElementById("lista");
  container.innerHTML = "";

  data.forEach(exec => {
    container.innerHTML += `
      <div class="card">
        <h3>Execução #${exec.id}</h3>

        <span class="status ${getStatusClass(exec.status)}">
          ${exec.status}
        </span>

        <br><br>

        <img src="http://localhost:3000${exec.imagem_url}" width="120"><br>

        <button onclick="aprovar(${exec.id})">Aprovar</button>
        <button onclick="reprovar(${exec.id})">Reprovar</button>
      </div>
    `;
  });
}

carregarDashboard();