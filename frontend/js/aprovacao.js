async function aprovar(id) {
  await fetch(`${API}/execucoes/aprovar-supervisor/${id}`, {
    method: "POST",
    headers: getHeaders()
  });

  alert("Aprovado!");
  location.reload();
}

async function reprovar(id) {
  await fetch(`${API}/execucoes/reprovar-supervisor/${id}`, {
    method: "POST",
    headers: getHeaders()
  });

  alert("Reprovado!");
  location.reload();
}