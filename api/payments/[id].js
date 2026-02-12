
import axios from 'axios';

const MP_TOKEN = process.env.MP_TOKEN;
const apiMP = axios.create({
  baseURL: 'https://api.mercadopago.com',
  headers: {
    Authorization: `Bearer ${MP_TOKEN}`,
    'Content-Type': 'application/json'
  }
});

export default async function handler(req, res) {
  const { id } = req.query;
  if (!id) return res.status(400).json({ error: 'ID obrigatório' });

  if (req.method === 'PUT') {
    try {
      const resposta = await apiMP.put(`/v1/payments/${id}`, { status: 'cancelled' });
      return res.status(200).json(resposta.data);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  if (req.method === 'GET') {
    try {
      const resposta = await apiMP.get(`/v1/payments/${id}`);
      return res.status(200).json(resposta.data);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  return res.status(405).json({ error: 'Method Not Allowed' });
}
