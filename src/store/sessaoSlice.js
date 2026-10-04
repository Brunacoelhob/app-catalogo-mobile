import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import * as api from '../servicos/api';
import { apagarSessao, lerSessao, salvarSessao } from '../servicos/armazenamento';

/** Login real na API (DummyJSON). O token vai para o cofre seguro e para os cabeçalhos das próximas chamadas. */
export const entrar = createAsyncThunk('sessao/entrar', async ({ usuario, senha }, { rejectWithValue }) => {
  try {
    const dados = await api.entrar(usuario.trim(), senha);
    const sessao = { token: dados.accessToken, usuario: { id: dados.id, nome: dados.firstName, login: dados.username } };
    api.definirToken(sessao.token);
    await salvarSessao(sessao);
    return sessao;
  } catch (erro) {
    return rejectWithValue(api.mensagemDeErro(erro));
  }
});

/** Ao abrir o app: retoma a sessão guardada, mas só se o token ainda for aceito pelo servidor. */
export const restaurarSessao = createAsyncThunk('sessao/restaurar', async () => {
  const sessao = await lerSessao();
  if (!sessao?.token) return null;
  api.definirToken(sessao.token);
  try {
    await api.buscarUsuarioAtual();
    return sessao;
  } catch (erro) {
    // Token expirado/inválido: descarta. Falha de rede: também descarta (o usuário entra de novo, sem risco).
    api.definirToken(null);
    await apagarSessao();
    return null;
  }
});

export const sair = createAsyncThunk('sessao/sair', async () => {
  api.definirToken(null);
  await apagarSessao();
});

const estadoInicial = {
  usuario: null,
  token: null,
  restaurando: true, // true até sabermos se há sessão salva (evita piscar a tela de login)
  entrando: false,
  erro: null,
};

const sessaoSlice = createSlice({
  name: 'sessao',
  initialState: estadoInicial,
  reducers: {
    limparErro: (state) => {
      state.erro = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(entrar.pending, (state) => {
        state.entrando = true;
        state.erro = null;
      })
      .addCase(entrar.fulfilled, (state, action) => {
        state.entrando = false;
        state.token = action.payload.token;
        state.usuario = action.payload.usuario;
      })
      .addCase(entrar.rejected, (state, action) => {
        state.entrando = false;
        state.erro = action.payload ?? 'Não foi possível entrar.';
      })
      .addCase(restaurarSessao.fulfilled, (state, action) => {
        state.restaurando = false;
        if (action.payload) {
          state.token = action.payload.token;
          state.usuario = action.payload.usuario;
        }
      })
      .addCase(restaurarSessao.rejected, (state) => {
        state.restaurando = false;
      })
      .addCase(sair.fulfilled, () => ({ ...estadoInicial, restaurando: false }));
  },
});

export const { limparErro } = sessaoSlice.actions;
export const selecionarLogado = (state) => Boolean(state.sessao.token);
export default sessaoSlice.reducer;
