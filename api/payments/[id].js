import * as mpService from '../../../backend/src/services/mercadoPagoService.js';

export default async function handler(req, res) {
  const { id } = req.query;
  if (!id) return res.status(400).json({ error: 'ID obrigatório' });

  if (req.method === 'PUT') {
    try {
      const pagamento = await mpService.cancelarPagamento(id);
      return res.status(200).json(pagamento);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  if (req.method === 'GET') {
    try {
      const pagamento = await mpService.consultarPagamento(id);
      return res.status(200).json(pagamento);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  return res.status(405).json({ error: 'Method Not Allowed' });
}
