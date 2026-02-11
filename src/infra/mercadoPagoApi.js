import axios from 'axios';

const isDev = import.meta.env.MODE === 'development';
const api = axios.create({
  baseURL: isDev ? '/mp-api' : '/api/payments',
});

export async function buscarPagamentosPendentes() {
  // O backend não implementa busca de pendentes, então retorna vazio
  return [];
}

export async function cancelarPagamento(id) {
  const resposta = await api.put(`/${id}`);
  return resposta.data;
}

export default api;
