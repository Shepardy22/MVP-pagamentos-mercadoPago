# MVP Pagamentos Mercado Pago (Vite + Node)

> MVP completo para integração de pagamentos PIX e Boleto via Mercado Pago, pronto para produção na Vercel.

---

<img src="src/assets/view.png" alt="APP View" width="250" />

## 🚀 Funcionalidades
- Checkout PIX e Boleto
- Valor customizado
- Máscara de CPF
- Polling automático de status
- Lista de pendências
- Cancelamento de pagamentos
- Backend seguro (Node.js)
- Pronto para deploy na Vercel

## 🗂️ Estrutura do Projeto
```
MVP-pagamentos-mercadoPago/
  backend/      # Backend Node.js (API)
    api/        # Vercel Functions
    src/        # Código backend
  src/          # Frontend React/Vite
  .gitignore
  README.md
   # vercel.json (não é mais necessário)
```

## ⚙️ Instalação e Deploy

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/seu-usuario/MVP-pagamentos-mercadoPago.git
   cd MVP-pagamentos-mercadoPago
   ```

2. **Configure as variáveis de ambiente:**
   - No painel da Vercel, adicione `MP_TOKEN` com seu Access Token do Mercado Pago.

3. **Deploy na Vercel:**
   - O frontend (src/) será detectado automaticamente.
   - O backend (backend/api/) será usado como API Functions.
   - Não é necessário arquivo `vercel.json`. O roteamento é automático.

## 📝 Como Funciona
- O frontend faz requisições para `/api/payments`.
- O backend recebe, processa e repassa para a API do Mercado Pago.
- O token nunca é exposto no frontend.
- Polling automático monitora o status do pagamento.

## 💻 Endpoints Backend
- `POST /api/payments` — Cria pagamento
- `GET /api/payments/:id` — Consulta pagamento
- `PUT /api/payments/:id` — Cancela pagamento

## 🛠️ Desenvolvimento Local
- Rode o backend: `npm start` na pasta backend/
- Rode o frontend: `npm run dev` na pasta src/

## 🔒 Segurança
- O token do Mercado Pago fica apenas no backend.
- O arquivo `.env` está no `.gitignore`.

---
Desenvolvido por Shepardy para a comunidade de desenvolvedores.
