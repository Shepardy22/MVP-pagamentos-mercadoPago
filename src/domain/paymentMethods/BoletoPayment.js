import PaymentMethod from './PaymentMethod';
import api from '../../infra/mercadoPagoApi';

export default class BoletoPayment extends PaymentMethod {
  static getNome() {
    return 'Boleto Bancário';
  }

  async criarPagamento() {
    const dados = {
      transaction_amount: Number(this.dados.valor),
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
      const resposta = await api.post('v1/payments', dados);
      return resposta.data;
    } catch (error) {
      console.error('Erro ao criar pagamento:', error?.response?.data || error.message);
      throw error;
    }
  }

  async consultarStatus(idPagamento) {
    const resposta = await api.get(`v1/payments/${idPagamento}`);
    return resposta.data.status;
  }
}
