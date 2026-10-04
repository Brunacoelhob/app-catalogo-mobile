import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import { PaperProvider } from 'react-native-paper';
import { Provider } from 'react-redux';

import * as api from '../src/servicos/api';
import { criarStore } from '../src/store';
import TelaDetalheProduto from '../src/telas/TelaDetalheProduto';
import TelaListaProdutos from '../src/telas/TelaListaProdutos';
import TelaLogin from '../src/telas/TelaLogin';

jest.mock('../src/servicos/api', () => ({
  ...jest.requireActual('../src/servicos/api'),
  entrar: jest.fn(),
  buscarProdutosPorCategoria: jest.fn(),
  buscarProduto: jest.fn(),
  definirToken: jest.fn(),
}));

const PRODUTOS = [
  { id: 1, title: 'Camisa Azul', price: 100, discountPercentage: 20, thumbnail: 'https://x/1.png' },
  { id: 2, title: 'Camisa Lisa', price: 40, discountPercentage: 0, thumbnail: 'https://x/2.png' },
];

const envolver = (ui, store = criarStore()) =>
  render(
    <Provider store={store}>
      <PaperProvider>{ui}</PaperProvider>
    </Provider>
  );

beforeEach(() => jest.clearAllMocks());

describe('TelaLogin', () => {
  it('campos vazios mostram aviso e não chamam a API', () => {
    envolver(<TelaLogin />);
    fireEvent.press(screen.getByText('Entrar'));
    expect(screen.getByText('Por favor, preencha todos os campos.')).toBeTruthy();
    expect(api.entrar).not.toHaveBeenCalled();
  });

  it('login com erro da API mostra a mensagem retornada', async () => {
    api.entrar.mockRejectedValue({ response: { status: 400 } });
    envolver(<TelaLogin />);
    fireEvent.changeText(screen.getByTestId('campo-usuario'), 'alguem');
    fireEvent.changeText(screen.getByTestId('campo-senha'), 'errada');
    fireEvent.press(screen.getByText('Entrar'));

    expect(await screen.findByText('Usuário ou senha inválidos.')).toBeTruthy();
  });

  it('login válido atualiza o estado para logado', async () => {
    api.entrar.mockResolvedValue({ accessToken: 't', id: 1, firstName: 'Emily', username: 'emilys' });
    const store = criarStore();
    envolver(<TelaLogin />, store);
    fireEvent.changeText(screen.getByTestId('campo-usuario'), 'emilys');
    fireEvent.changeText(screen.getByTestId('campo-senha'), 'emilyspass');
    fireEvent.press(screen.getByText('Entrar'));

    await waitFor(() => expect(store.getState().sessao.token).toBe('t'));
  });
});

describe('TelaListaProdutos', () => {
  const navegacao = { navigate: jest.fn() };
  const rota = { params: { categoria: 'mens-shirts' } };

  it('mostra os produtos com preço já com desconto', async () => {
    api.buscarProdutosPorCategoria.mockResolvedValue(PRODUTOS);
    envolver(<TelaListaProdutos route={rota} navigation={navegacao} />);

    expect(await screen.findByText('Camisa Azul')).toBeTruthy();
    expect(screen.getByText('US$ 80,00')).toBeTruthy(); // 100 com 20% OFF
    expect(screen.getByText('20% OFF')).toBeTruthy();
    expect(screen.getByText('US$ 40,00')).toBeTruthy(); // sem desconto: preço normal
    expect(api.buscarProdutosPorCategoria).toHaveBeenCalledWith('mens-shirts');
  });

  it('tocar em um produto abre os detalhes dele', async () => {
    api.buscarProdutosPorCategoria.mockResolvedValue(PRODUTOS);
    envolver(<TelaListaProdutos route={rota} navigation={navegacao} />);
    fireEvent.press(await screen.findByText('Camisa Lisa'));
    expect(navegacao.navigate).toHaveBeenCalledWith('Detalhes', { id: 2 });
  });

  it('erro de rede mostra mensagem e permite tentar de novo', async () => {
    api.buscarProdutosPorCategoria.mockRejectedValueOnce({ request: {} }).mockResolvedValueOnce(PRODUTOS);
    envolver(<TelaListaProdutos route={rota} navigation={navegacao} />);

    expect(await screen.findByText('Sem conexão com a internet.')).toBeTruthy();
    fireEvent.press(screen.getByText('Tentar de novo'));
    expect(await screen.findByText('Camisa Azul')).toBeTruthy();
  });

  it('categoria sem produtos mostra aviso', async () => {
    api.buscarProdutosPorCategoria.mockResolvedValue([]);
    envolver(<TelaListaProdutos route={rota} navigation={navegacao} />);
    expect(await screen.findByText('Nenhum produto nesta categoria.')).toBeTruthy();
  });
});

describe('TelaDetalheProduto', () => {
  it('mostra preço, desconto, nota e estoque', async () => {
    api.buscarProduto.mockResolvedValue({
      id: 1, title: 'Camisa Azul', brand: 'Marca X', price: 100, discountPercentage: 20,
      rating: 4.56, stock: 12, description: 'Algodão.', thumbnail: 'https://x/1.png',
    });
    envolver(<TelaDetalheProduto route={{ params: { id: 1 } }} />);

    expect(await screen.findByText('Camisa Azul')).toBeTruthy();
    expect(screen.getByText('US$ 80,00')).toBeTruthy();
    expect(screen.getByText('US$ 100,00')).toBeTruthy();
    expect(screen.getByText('4.6')).toBeTruthy();
    expect(screen.getByText('12 em estoque')).toBeTruthy();
    expect(api.buscarProduto).toHaveBeenCalledWith(1);
  });

  it('produto inexistente mostra erro amigável', async () => {
    api.buscarProduto.mockRejectedValue({ response: { status: 404 } });
    envolver(<TelaDetalheProduto route={{ params: { id: 999 } }} />);
    expect(await screen.findByText('Item não encontrado.')).toBeTruthy();
  });
});
