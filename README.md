# MVP - Sistema de Pagamentos Mercado Pago (Vite)

> Este é um MVP para integração de pagamentos PIX e Boleto usando a API do Mercado Pago. 

---

![APP View](https://via.placeholder.com/800x400/0d0e12/00d1ff?text=Checkout+Inteligente+Premium+Dark+Theme) <!-- Substitua por um screenshot real se disponível -->

## 🚀 Principais Funcionalidades

- **Arquitetura Limpa**: Lógica de negócio totalmente desacoplada da interface usando Hooks Customizados.
- **Máscara de CPF**: Formatação automática (000.000.000-00) durante a digitação para melhor UX.
- **Valor Dinâmico**: Permite definir o valor da cobrança diretamente no checkout.
- **Polling Automático**: Monitoramento de status em tempo real sem interação do usuário.
- **Gerenciamento de Pendências**: Lista de vendas não pagas com opção de cancelamento direto.
- **Zero CORS Issues**: Configurado com Vite Proxy para desenvolvimento fluido.

## 🗂️ Estrutura do Projeto

```
src/
  components/  # UI Components (Form, Listas, QR Code)
  hooks/       # Lógica Centralizada (usePaymentSession, useRecentPayments)
  domain/      # Regras de Negócio e Validações
  infra/       # Comunicação com API Mercado Pago
  App.jsx      # Orquestrador Visual (Clean & Minimal)
```

## 🛠️ Detalhes Técnicos (Hooks)

Para tornar o projeto modular e profissional, utilizamos Hooks Customizados:

- **`usePaymentSession`**: Controla o estado de um pagamento ativo, gerencia o delay de polling e o sucesso da operação.
- **`useRecentPayments`**: Gerencia a busca e o cancelamento de pagamentos pendentes, mantendo a lista sincronizada.

## ⚙️ Instalação e Configuração

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/seu-usuario/MVP-pagamentos-mercadoPago.git
   cd MVP-pagamentos-mercadoPago
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Configure as Variáveis de Ambiente:**
   Crie um arquivo `.env` na raiz:
   ```env
   VITE_TOKEN_MERCADO_PAGO_PUBLIC=SEU_ACCESS_TOKEN_AQUI
   ```
   > [!IMPORTANT]
   > Use o **Access Token** (APP_USR-xxxx...). O projeto usa proxy para evitar problemas de segurança em desenvolvimento.

4. **Inicie o Ambiente de Desenvolvimento:**
   ```bash
   npm run dev
   ```

## 📝 Como Funciona o Fluxo

1. **Geração**: O usuário preenche o CPF, e-mail e o **valor customizado**.
2. **Visualização**: O sistema gera o QR Code PIX (base64) ou o link para o Boleto.
3. **Monitoramento**: Um sistema de *polling* entra em ação, verificando o status no fundo.
4. **Finalização**: Assim que o pagamento é aprovado, a interface muda para o estado de sucesso instantaneamente.
5. **Manutenção**: Caso tenha vendas de teste pendentes, você pode usar a lista abaixo do formulário para cancelá-las.

## 🔒 Segurança e CORS

Para evitar o erro comum de CORS (`Access-Control-Allow-Origin`), este projeto utiliza o arquivo `vite.config.js` para criar um proxy local:
```javascript
// Exemplo do proxy configurado
proxy: {
  '/mp-api': {
    target: 'https://api.mercadopago.com',
    changeOrigin: true,
    rewrite: (path) => path.replace(/^\/mp-api/, ''),
  },
}
```


## 📦 Como Integrar em outro Projeto (Passo a Passo)

Para levar este sistema pronto para sua aplicação, siga estes passos:

### 1. Copie as Pastas Essenciais
Mova as seguintes pastas do `src/` para o seu projeto:
- `domain/`: Regras de negócio e validações.
- `infra/`: Configuração da API.
- `hooks/`: Os hooks que controlam tudo.
- `components/`: Componentes de UI (opcional, você pode criar os seus usando os hooks).

### 2. Instale as Dependências
No seu projeto, execute:
```bash
npm install axios
```

### 3. Configure o Proxy (CORS)
Se estiver usando **Vite**, adicione isso ao seu `vite.config.js` para evitar erros de CORS em desenvolvimento:
```javascript
server: {
  proxy: {
    '/mp-api': {
      target: 'https://api.mercadopago.com',
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/mp-api/, ''),
    },
  },
}
```

### 4. Variáveis de Ambiente
Adicione seu token no `.env`:
```env
VITE_TOKEN_MERCADO_PAGO_PUBLIC=SEU_TOKEN_AQUI
```

## 💻 Exemplo Prático de Uso

```jsx
import { usePaymentSession } from './hooks/usePaymentSession';

function MeuCheckout() {
  const [dados, setDados] = useState({ email: '', nome: '', cpf: '', valor: '50.00' });
  
  const { iniciarPagamento, respostaPagamento, pagamentoAprovado } = usePaymentSession(dados);

  return (
    <div>
      <button onClick={iniciarPagamento}>Pagar agora</button>
      
      {respostaPagamento && <p>ID do Pagamento: {respostaPagamento.id}</p>}
      {pagamentoAprovado && <h2>✅ Sucesso! Pagamento Recebido.</h2>}
    </div>
  );
}
```

## 🚀 O que falta para Produção Real?
Este é um MVP funcional. Para um sistema em produção de larga escala, considere:
1. **Backend Próprio**: Em vez de chamar a API do Mercado Pago diretamente no front (mesmo com proxy), o ideal é ter um backend (Node, Python, Go) para processar os tokens secretamente.
2. **Webhooks**: Configurar Webhooks no Mercado Pago para receber notificações de pagamento mesmo se o usuário fechar a aba.
3. **Persistência**: Salvar o status do pagamento no seu próprio banco de dados.

---
Desenvolvido por Shepardy para a comunidade de desenvolvedores.
