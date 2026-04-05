# 🧠 Maxi Inspect

Sistema de Trade Marketing com validação por imagem em duas etapas (Supervisor → Indústria).

---

## 🎯 Objetivo

Gerenciar execução de trades e validar exposição de produtos nas lojas.

---

## 👥 Roles

- MASTER → controle total  
- SUPERVISOR → cria e valida trades  
- PROMOTOR → envia fotos  
- INDUSTRIA → valida final  

---

## 🔁 Fluxo

1. Supervisor cria trade  
2. Promotor envia imagem  
3. Supervisor aprova/reprova  
4. Se aprovado → vai para indústria  
5. Indústria aprova/reprova  
6. Se reprovado → retorna ao promotor  

---

## 🔄 Status

- pendente  
- enviado  
- aprovado_supervisor  
- pendente_industria  
- aprovado  
- reprovado  

---

## ⚙️ Stack

- Node.js + Express  
- PostgreSQL  
- Frontend SPA (JS)  

---

## 🚀 Funcionalidades

- Login  
- Dashboard  
- Criação de trades  
- Upload de imagens  
- Persistência no banco  

---

## 💰 Impacto

Substitui sistema de alto custo mensal.

---

## 👨‍💻 Autor

Silvio Marques