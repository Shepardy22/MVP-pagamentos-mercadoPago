import PaymentMethod from './PaymentMethod';
import api from '../../infra/mercadoPagoApi';

export default class BoletoPayment extends PaymentMethod {
  static getNome() {
    return 'Boleto Bancário';
  }

  async criarPagamento() {
    let valor = Number(this.dados.valor);
    if (!isNaN(valor)) {
      valor = Number(valor.toFixed(2));
    }
    const dados = {
      transaction_amount: valor,
      description: 'Produto teste de desenvolvimento',
      payment_method_id: 'bolbradesco',
      payer: {
        email: this.dados.email,
        first_name: this.dados.nome,
        last_name: this.dados.sobrenome,
        identification: {
          type: 'CPF',
          number: this.dados.cpf,
        },
        address: {
          zip_code: this.dados.cep,
          street_name: this.dados.rua,
          street_number: this.dados.numero,
          neighborhood: this.dados.bairro,
          city: this.dados.cidade,
          federal_unit: this.dados.uf,
        },
      },
    };
    try {
      console.log('Payload enviado para /v1/payments:', dados);
      const resposta = await api.post('/', dados);
      return resposta.data;
    } catch (error) {
      console.error('Erro ao criar pagamento:', error?.response?.data || error.message);
      throw error;
    }
  }

  async consultarStatus(idPagamento) {
    const resposta = await api.get(`/${idPagamento}`);
    return resposta.data.status;
  }
}
