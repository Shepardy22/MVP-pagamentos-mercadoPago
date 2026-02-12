import { useState } from 'react';
import PagadorValidator from '../domain/validators/PagadorValidator';

function FormularioPagamentoPix({ dados, aoAlterar, aoEnviar, metodoSelecionado }) {
  const valorMinimo = metodoSelecionado === 'Boleto Bancário' ? 3.0 : 1.0;
  const [erros, setErros] = useState({});
  const [erroValorMinimo, setErroValorMinimo] = useState('');

  function aplicarMascaraCPF(valor) {
    const limpo = valor.replace(/\D/g, '');
    return limpo
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
      .substring(0, 14);
  }

  function handleCPFChange(e) {
    const formatado = aplicarMascaraCPF(e.target.value);
    aoAlterar({
      target: {
        name: 'cpf',
        value: formatado
      }
    });
  }

  function handleSubmit(e) {
    e.preventDefault();
    // Limpa o CPF para validação mas mantém o estado com máscara se desejado
    const dadosParaValidar = { ...dados, cpf: dados.cpf.replace(/\D/g, '') };
    const errosValidados = PagadorValidator.validate(dadosParaValidar);
    setErros(errosValidados);
    let valor = parseFloat(dados.valor);
    if (!isNaN(valor)) {
      valor = Number(valor.toFixed(2));
    }
    if (!isNaN(valor) && valor < valorMinimo) {
      setErroValorMinimo(
        metodoSelecionado === 'Boleto Bancário'
          ? 'O valor mínimo para boleto é R$ 3,00.'
          : 'O valor mínimo para PIX é R$ 1,00.'
      );
      return;
    } else {
      setErroValorMinimo('');
    }
    if (!Object.values(errosValidados).some(Boolean)) {
      // Garante que o valor enviado para o backend está correto para ambos métodos
      if (dados.valor !== valor) {
        aoAlterar({ target: { name: 'valor', value: valor } });
        setTimeout(() => aoEnviar(e), 0);
      } else {
        aoEnviar(e);
      }
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '16px',
      width: '100%',
      maxWidth: '450px',
      margin: '0 auto'
    }}>
      <label style={{ gridColumn: 'span 2' }}>
        E-mail:
        <input
          type="email"
          name="email"
          value={dados.email}
          onChange={aoAlterar}
          required
          placeholder="seu@email.com"
        />
        {erros.email && <span className="error-msg">{erros.email}</span>}
      </label>


      <label style={{ gridColumn: 'span 2' }}>
        Nome:
        <input
          type="text"
          name="nome"
          value={dados.nome}
          onChange={aoAlterar}
          required
          placeholder="Primeiro nome"
        />
        {erros.nome && <span className="error-msg">{erros.nome}</span>}
      </label>

      {metodoSelecionado === 'Boleto Bancário' && (
        <>
          <label style={{ gridColumn: 'span 2' }}>
            Sobrenome:
            <input
              type="text"
              name="sobrenome"
              value={dados.sobrenome || ''}
              onChange={aoAlterar}
              required
              placeholder="Sobrenome do pagador"
            />
            {erros.sobrenome && <span className="error-msg">{erros.sobrenome}</span>}
          </label>
          <label style={{ gridColumn: 'span 2' }}>
            CEP:
            <input
              type="text"
              name="cep"
              value={dados.cep || ''}
              onChange={aoAlterar}
              required
              placeholder="00000-000"
              maxLength={9}
            />
          </label>
          <label style={{ gridColumn: 'span 2' }}>
            Rua:
            <input
              type="text"
              name="rua"
              value={dados.rua || ''}
              onChange={aoAlterar}
              required
              placeholder="Nome da rua"
            />
          </label>
          <label>
            Número:
            <input
              type="text"
              name="numero"
              value={dados.numero || ''}
              onChange={aoAlterar}
              required
              placeholder="Número"
            />
          </label>
          <label>
            Bairro:
            <input
              type="text"
              name="bairro"
              value={dados.bairro || ''}
              onChange={aoAlterar}
              required
              placeholder="Bairro"
            />
          </label>
          <label>
            Cidade:
            <input
              type="text"
              name="cidade"
              value={dados.cidade || ''}
              onChange={aoAlterar}
              required
              placeholder="Cidade"
            />
          </label>
          <label>
            UF:
            <input
              type="text"
              name="uf"
              value={dados.uf || ''}
              onChange={aoAlterar}
              required
              placeholder="UF"
              maxLength={2}
            />
          </label>
        </>
      )}

      <label>
        CPF:
        <input
          type="text"
          name="cpf"
          value={dados.cpf}
          onChange={handleCPFChange}
          required
          placeholder="000.000.000-00"
          maxLength={14}
        />
        {erros.cpf && <span className="error-msg">{erros.cpf}</span>}
      </label>


      <label>
        Valor (R$):
        <input
          type="number"
          name="valor"
          step="0.01"
          min={valorMinimo}
          value={dados.valor}
          onChange={aoAlterar}
          required
        />
        {erros.valor && <span className="error-msg">{erros.valor}</span>}
        {erroValorMinimo && <span className="error-msg">{erroValorMinimo}</span>}
        <span style={{ display: 'block', marginTop: 6, color: '#888', fontSize: 13 }}>
          Pague-me um café ☕ ou qualquer valor simbólico!
        </span>
      </label>

      <button type="submit" style={{ gridColumn: 'span 2', marginTop: '8px' }}>
        Finalizar Pagamento
      </button>

      <style>{`
        .error-msg {
          color: #ff4d4d;
          font-size: 11px;
          margin-top: 4px;
          font-weight: 500;
        }
      `}</style>
    </form>
  );
}

export default FormularioPagamentoPix;
