import api, { definirToken, mensagemDeErro } from '../src/servicos/api';

describe('definirToken', () => {
  it('adiciona e remove o cabeçalho Authorization', () => {
    definirToken('abc123');
    expect(api.defaults.headers.common.Authorization).toBe('Bearer abc123');
    definirToken(null);
    expect(api.defaults.headers.common.Authorization).toBeUndefined();
  });
});

describe('mensagemDeErro', () => {
  it('traduz códigos HTTP e falhas de rede', () => {
    expect(mensagemDeErro({ response: { status: 400 } })).toMatch(/inválidos/);
    expect(mensagemDeErro({ response: { status: 401 } })).toMatch(/inválidos/);
    expect(mensagemDeErro({ response: { status: 404 } })).toMatch(/não encontrado/i);
    expect(mensagemDeErro({ response: { status: 503 } })).toMatch(/servidor/i);
    expect(mensagemDeErro({ request: {} })).toMatch(/Sem conexão/);
    expect(mensagemDeErro({ code: 'ECONNABORTED' })).toMatch(/demorou/);
  });

  it('nunca vaza detalhes técnicos do erro original', () => {
    const msg = mensagemDeErro(new Error('connect ECONNREFUSED 10.0.0.5:443 token=segredo'));
    expect(msg).toBe('Algo deu errado. Tente novamente.');
  });

  it('o cliente tem timeout configurado', () => {
    expect(api.defaults.timeout).toBeGreaterThan(0);
  });
});
