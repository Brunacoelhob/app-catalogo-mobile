import axios from 'axios';

const api = axios.create({
  baseURL: 'https://dummyjson.com',
  timeout: 10000, // sem timeout, uma rede ruim deixaria a tela carregando para sempre
});

/** Define (ou remove, com null) o token que acompanha as próximas requisições. */
export function definirToken(token) {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common.Authorization;
  }
}

/** Transforma qualquer erro do axios em uma mensagem amigável em português. */
export function mensagemDeErro(erro, padrao = 'Algo deu errado. Tente novamente.') {
  if (erro?.code === 'ECONNABORTED') return 'A conexão demorou demais. Tente novamente.';
  if (erro?.response) {
    const { status } = erro.response;
    if (status === 400 || status === 401) return 'Usuário ou senha inválidos.';
    if (status === 404) return 'Item não encontrado.';
    if (status >= 500) return 'O servidor está com problemas. Tente mais tarde.';
    return padrao;
  }
  if (erro?.request) return 'Sem conexão com a internet.';
  return padrao;
}

export const entrar = async (usuario, senha) => {
  const { data } = await api.post('/auth/login', { username: usuario, password: senha, expiresInMins: 60 });
  return data; // { accessToken, id, username, firstName, ... }
};

export const buscarUsuarioAtual = async () => (await api.get('/auth/me')).data;

export const buscarProdutosPorCategoria = async (categoria) =>
  (await api.get(`/products/category/${encodeURIComponent(categoria)}`)).data.products;

export const buscarProduto = async (id) => (await api.get(`/products/${encodeURIComponent(id)}`)).data;

export default api;
