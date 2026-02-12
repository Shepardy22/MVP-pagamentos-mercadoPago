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
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
  try {
    const params = {
      status: 'pending,in_process,authorized',
      sort: 'date_created',
      order: 'desc',
      limit: 20
    };
    const resposta = await apiMP.get('/v1/payments/search', { params });
    return res.status(200).json(resposta.data.results);
  } catch (err) {
    console.error('Erro ao buscar pendentes:', err);
    return res.status(500).json({ error: err.message });
  }
}
