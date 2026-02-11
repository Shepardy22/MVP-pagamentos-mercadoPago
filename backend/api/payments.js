import * as mpService from '../src/services/mercadoPagoService.js';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const pagamento = await mpService.criarPagamento(req.body);
      return res.status(201).json(pagamento);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }
  if (req.method === 'GET') {
    try {
      const pagamento = await mpService.consultarPagamento(req.query.id || req.query.idPagamento || req.url.split('/').pop());
      return res.status(200).json(pagamento);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }
  if (req.method === 'PUT') {
    try {
      const pagamento = await mpService.cancelarPagamento(req.query.id || req.query.idPagamento || req.url.split('/').pop());
      return res.status(200).json(pagamento);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }
  return res.status(405).json({ error: 'Method Not Allowed' });
}
