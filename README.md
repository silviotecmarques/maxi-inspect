# 🧠 Maxi Inspect

Sistema de Trade Marketing inspirado no Fotocheck, desenvolvido para a empresa **Apoio Pharma**.

---

## 🎯 Objetivo

Substituir plataformas pagas (como Fotocheck) e centralizar o controle de:

- Execução de trades
- Validação de exposição de produtos
- Monitoramento das lojas

---

## 🏢 Contexto Real

A Apoio Pharma possui:

- 22 farmácias (expandindo para 26)
- Diversos pontos de venda:
  - Cestões
  - Pontas de gôndola
  - PDVs

O sistema permite controlar se os produtos estão sendo expostos corretamente nesses pontos.

---

## 👥 Tipos de Usuário

- 👑 **MASTER** → controle total do sistema  
- 🧠 **SUPERVISOR** → cria e valida trades  
- 📸 **PROMOTOR** → envia fotos (gerente/ADM da loja)  
- 🏭 **INDÚSTRIA** → valida exposição da marca  

---

## 🔁 Fluxo do Sistema

1. Supervisor cria um trade  
2. Promotor recebe a tarefa  
3. Promotor envia foto  
4. Supervisor aprova ou reprova  
5. Indústria aprova ou reprova  
6. Se reprovado → volta para o promotor  

---

## ⚙️ Tecnologias

- Backend: Node.js + Express
- Banco: PostgreSQL
- Frontend: HTML + CSS + JavaScript (SPA)

---

## 🚀 Funcionalidades atuais

- Login com PIN + senha
- Dashboard básico
- Criação de trades
- Listagem de trades
- Persistência no banco de dados

---

## 🔥 Próximas funcionalidades

- Upload de imagens 📸
- Aprovação de trades (workflow completo)
- Dashboard estilo Fotocheck
- Controle por loja e ponto de venda

---

## 💰 Impacto

Substituição de sistema com custo de:

➡️ R$7.000/mês  
➡️ R$84.000/ano  

---

## 👨‍💻 Autor

Silvio Marques