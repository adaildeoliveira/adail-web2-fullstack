import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  timeout: 10000,
});

export function mensagemErro(erro: unknown): string {
  if (axios.isAxiosError(erro)) {
    if (!erro.response) return 'Não foi possível conectar ao servidor. Confira se o back-end está ligado e tente novamente.';
    if (typeof erro.response.data?.mensagem === 'string') return erro.response.data.mensagem;
    if (erro.response.status === 404) return 'Registro não encontrado. Atualize a lista e tente novamente.';
  }
  return 'Não foi possível concluir a operação. Tente novamente.';
}

export default api;
