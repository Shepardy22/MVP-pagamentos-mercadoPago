import * as mpService from '../src/services/mercadoPagoService.js';

export default async function handler(req, res) {
  console.log('--- Nova requisição recebida ---');
  console.log('Método:', req.method);
  console.log('URL:', req.url);
  console.log('Body:', req.body);
  console.log('Query:', req.query);

  if (req.method === 'POST') {
    try {
      const pagamento = await mpService.criarPagamento(req.body);
      console.log('Pagamento criado:', pagamento);
      return res.status(201).json(pagamento);
    } catch (err) {
      console.error('Erro ao criar pagamento:', err);
      return res.status(500).json({ error: err.message });
    }
  }
  if (req.method === 'GET') {
    try {
      const id = req.query.id || req.query.idPagamento || req.url.split('/').pop();
      console.log('Consulta pagamento ID:', id);
      const pagamento = await mpService.consultarPagamento(id);
      console.log('Pagamento consultado:', pagamento);
      return res.status(200).json(pagamento);
    } catch (err) {
      console.error('Erro ao consultar pagamento:', err);
      return res.status(500).json({ error: err.message });
    }
  }
  if (req.method === 'PUT') {
    try {
      const id = req.query.id || req.query.idPagamento || req.url.split('/').pop();
      console.log('Cancelamento pagamento ID:', id);
      const pagamento = await mpService.cancelarPagamento(id);
      console.log('Pagamento cancelado:', pagamento);
      return res.status(200).json(pagamento);
    } catch (err) {
      console.error('Erro ao cancelar pagamento:', err);
      return res.status(500).json({ error: err.message });
    }
  }
  console.warn('Método não permitido:', req.method);
  return res.status(405).json({ error: 'Method Not Allowed' });
}
