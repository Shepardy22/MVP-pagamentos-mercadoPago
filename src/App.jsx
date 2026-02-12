import { useState } from 'react';
import './App.css';
import FormularioPagamentoPix from './components/FormularioPagamentoPix';
import StatusPagamentoPix from './components/StatusPagamentoPix';
import QRCodePix from './components/QRCodePix';
import ListaPagamentos from './components/ListaPagamentos';
import { paymentMethods } from './domain/paymentMethods';
import { usePaymentSession } from './hooks/usePaymentSession';
import { useRecentPayments } from './hooks/useRecentPayments';

function App() {
  const [dadosFormulario, setDadosFormulario] = useState({
    email: '',
    nome: '',
    sobrenome: '',
    cpf: '',
    valor: '',
    cep: '',
    rua: '',
    numero: '',
    bairro: '',
    cidade: '',
    uf: '',
  });

  const {
    pagamentosPendentes,
    cancelarPagamento,
    carregarPendencias
  } = useRecentPayments();

  const {
    metodoSelecionado,
    selecionarMetodo,
    respostaPagamento,
    urlPagamento,
    pagamentoAprovado,
    iniciarPagamento
  } = usePaymentSession(dadosFormulario, carregarPendencias);

  function aoAlterarCampo(evento) {
    const { name, value } = evento.target;
    setDadosFormulario((dados) => ({ ...dados, [name]: value }));
  }

  const handleEnviar = async (e) => {
    const sucesso = await iniciarPagamento(e);
    if (sucesso) carregarPendencias();
  };

  return (
    <div className="App">
      <header className="App-header">
        <h2>Checkout Inteligente</h2>
        <p>Preencha os dados e escolha o método de pagamento.</p>

        {!respostaPagamento && (
          <div className="payment-selector" style={{ marginBottom: 24 }}>
            <label>Método de Pagamento</label>
            <select
              style={{ width: '100%' }}
              onChange={(e) => selecionarMetodo(e.target.value)}
              value={metodoSelecionado.getNome()}
            >
              {paymentMethods.map((Metodo, idx) => (
                <option key={idx} value={Metodo.getNome()}>{Metodo.getNome()}</option>
              ))}
            </select>
          </div>
        )}

        {!respostaPagamento && (
          <FormularioPagamentoPix
            dados={dadosFormulario}
            aoAlterar={aoAlterarCampo}
            aoEnviar={handleEnviar}
            metodoSelecionado={metodoSelecionado.getNome()}
          />
        )}

        {respostaPagamento && !pagamentoAprovado && (
          <div className="payment-status-container">
            <StatusPagamentoPix />
          </div>
        )}


        {/* Exibe boleto ou QRCodePix conforme método selecionado */}
        {respostaPagamento && metodoSelecionado.getNome() === 'Boleto Bancário' && !pagamentoAprovado && (
          <div style={{ margin: '32px auto', maxWidth: 480, background: 'rgba(255,255,255,0.02)', borderRadius: 16, padding: 24, textAlign: 'center', border: '1px solid var(--border-color)' }}>
            <h3>Boleto gerado!</h3>
            <p>Imprima ou pague pelo internet banking:</p>
            {urlPagamento && (
              <>
                <a href={urlPagamento} target="_blank" rel="noopener noreferrer" style={{
                  display: 'inline-block',
                  margin: '16px 0',
                  padding: '12px 24px',
                  background: 'var(--primary-color)',
                  color: 'white',
                  borderRadius: 8,
                  fontWeight: 700,
                  textDecoration: 'none',
                  fontSize: 16
                }}>Visualizar/Imprimir Boleto</a>
                <br />
                <button onClick={() => window.open(urlPagamento, '_blank')} style={{
                  marginTop: 8,
                  padding: '8px 20px',
                  fontSize: 15,
                  borderRadius: 8,
                  border: '1px solid var(--primary-color)',
                  background: 'white',
                  color: 'var(--primary-color)',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}>Imprimir Boleto</button>
              </>
            )}
            <div style={{ marginTop: 24 }}>
              <StatusPagamentoPix />
            </div>
          </div>
        )}

        {/* PIX padrão */}
        {urlPagamento && metodoSelecionado.getNome() === 'PIX' && !pagamentoAprovado && (
          <QRCodePix
            url={urlPagamento}
            base64={respostaPagamento?.pix_qr_code_base64}
            code={respostaPagamento?.pix_qr_code}
          />
        )}

        {respostaPagamento && !pagamentoAprovado && !urlPagamento && (
          <p className="status-note">Pagamento criado. Aguardando processamento...</p>
        )}

        {pagamentoAprovado && (
          <div className="success-message">
            <h1 style={{ color: 'var(--primary-color)' }}>Pagamento Aprovado!</h1>
            <p>Obrigado pela sua compra. Seu acesso foi liberado.</p>
          </div>
        )}

        {!respostaPagamento && (
          <ListaPagamentos
            pagamentos={pagamentosPendentes}
            aoCancelar={async (id) => {
              const ok = await cancelarPagamento(id);
              if (ok) carregarPendencias();
            }}
          />
        )}
      </header>
    </div>
  );
}

export default App;
