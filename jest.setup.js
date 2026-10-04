// Mocks globais dos testes: o armazenamento seguro é um módulo nativo e não existe no Jest.
jest.mock('expo-secure-store', () => {
  const memoria = new Map();
  return {
    getItemAsync: jest.fn(async (chave) => (memoria.has(chave) ? memoria.get(chave) : null)),
    setItemAsync: jest.fn(async (chave, valor) => {
      memoria.set(chave, valor);
    }),
    deleteItemAsync: jest.fn(async (chave) => {
      memoria.delete(chave);
    }),
  };
});

// O Paper avisa que não achou a biblioteca de ícones no ambiente de teste (no app real ela existe: @expo/vector-icons).
const avisoOriginal = console.warn;
jest.spyOn(console, 'warn').mockImplementation((...args) => {
  if (String(args[0]).includes('none of the required icon libraries are installed')) return;
  avisoOriginal(...args);
});
