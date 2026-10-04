import * as SecureStore from 'expo-secure-store';

import * as api from '../src/servicos/api';
import { criarStore } from '../src/store';
import { entrar, restaurarSessao, sair, selecionarLogado } from '../src/store/sessaoSlice';

jest.mock('../src/servicos/api', () => ({
  ...jest.requireActual('../src/servicos/api'),
  entrar: jest.fn(),
  buscarUsuarioAtual: jest.fn(),
  definirToken: jest.fn(),
}));

const RESPOSTA_LOGIN = { accessToken: 'tok-1', id: 7, firstName: 'Emily', username: 'emilys' };

beforeEach(async () => {
  jest.clearAllMocks();
  await SecureStore.deleteItemAsync('sessao.v1');
});

describe('entrar', () => {
  it('login válido guarda o token no cofre seguro e libera a navegação', async () => {
    api.entrar.mockResolvedValue(RESPOSTA_LOGIN);
    const store = criarStore();

    await store.dispatch(entrar({ usuario: '  emilys ', senha: 'emilyspass' }));

    expect(api.entrar).toHaveBeenCalledWith('emilys', 'emilyspass'); // espaços do usuário removidos
    expect(api.definirToken).toHaveBeenCalledWith('tok-1');
    expect(selecionarLogado(store.getState())).toBe(true);
    expect(store.getState().sessao.usuario).toEqual({ id: 7, nome: 'Emily', login: 'emilys' });
    expect(JSON.parse(await SecureStore.getItemAsync('sessao.v1')).token).toBe('tok-1');
  });

  it('credenciais erradas mostram mensagem amigável e não guardam nada', async () => {
    api.entrar.mockRejectedValue({ response: { status: 400 } });
    const store = criarStore();

    await store.dispatch(entrar({ usuario: 'x', senha: 'y' }));

    const { erro, entrando } = store.getState().sessao;
    expect(erro).toBe('Usuário ou senha inválidos.');
    expect(entrando).toBe(false);
    expect(selecionarLogado(store.getState())).toBe(false);
    expect(await SecureStore.getItemAsync('sessao.v1')).toBeNull();
  });

  it('falha de rede também vira mensagem amigável', async () => {
    api.entrar.mockRejectedValue({ request: {} });
    const store = criarStore();
    await store.dispatch(entrar({ usuario: 'x', senha: 'y' }));
    expect(store.getState().sessao.erro).toBe('Sem conexão com a internet.');
  });
});

describe('restaurarSessao', () => {
  it('sem sessão salva, termina de restaurar e continua deslogado', async () => {
    const store = criarStore();
    expect(store.getState().sessao.restaurando).toBe(true);

    await store.dispatch(restaurarSessao());

    expect(store.getState().sessao.restaurando).toBe(false);
    expect(selecionarLogado(store.getState())).toBe(false);
  });

  it('retoma a sessão se o servidor ainda aceita o token', async () => {
    await SecureStore.setItemAsync('sessao.v1', JSON.stringify({ token: 'tok-9', usuario: { id: 1, nome: 'Ana', login: 'ana' } }));
    api.buscarUsuarioAtual.mockResolvedValue({});
    const store = criarStore();

    await store.dispatch(restaurarSessao());

    expect(selecionarLogado(store.getState())).toBe(true);
    expect(api.definirToken).toHaveBeenCalledWith('tok-9');
  });

  it('descarta a sessão se o token expirou', async () => {
    await SecureStore.setItemAsync('sessao.v1', JSON.stringify({ token: 'velho', usuario: { id: 1 } }));
    api.buscarUsuarioAtual.mockRejectedValue({ response: { status: 401 } });
    const store = criarStore();

    await store.dispatch(restaurarSessao());

    expect(selecionarLogado(store.getState())).toBe(false);
    expect(await SecureStore.getItemAsync('sessao.v1')).toBeNull();
    expect(api.definirToken).toHaveBeenLastCalledWith(null);
  });

  it('conteúdo corrompido no cofre é tratado como sem sessão', async () => {
    await SecureStore.setItemAsync('sessao.v1', '{isto não é json');
    const store = criarStore();
    await store.dispatch(restaurarSessao());
    expect(selecionarLogado(store.getState())).toBe(false);
    expect(store.getState().sessao.restaurando).toBe(false);
  });
});

describe('sair', () => {
  it('apaga o token do cofre e dos cabeçalhos', async () => {
    api.entrar.mockResolvedValue(RESPOSTA_LOGIN);
    const store = criarStore();
    await store.dispatch(entrar({ usuario: 'emilys', senha: 'emilyspass' }));

    await store.dispatch(sair());

    expect(selecionarLogado(store.getState())).toBe(false);
    expect(store.getState().sessao.usuario).toBeNull();
    expect(await SecureStore.getItemAsync('sessao.v1')).toBeNull();
    expect(api.definirToken).toHaveBeenLastCalledWith(null);
  });
});
