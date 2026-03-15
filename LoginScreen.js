import axios from 'axios';

const api = axios.create({
  baseURL: 'https://dummyjson.com',
});

// Função para buscar produtos por categoria
export const getProductsByCategory = (category) => {
  return api.get(`/products/category/${category}`);
};

// Função para buscar detalhes de um produto específico
export const getProductDetails = (id) => {
  return api.get(`/products/${id}`);
};

export default api;