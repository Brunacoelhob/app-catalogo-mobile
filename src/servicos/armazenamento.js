import * as SecureStore from 'expo-secure-store';

// O token fica no cofre do sistema (Keychain no iOS, Keystore no Android), nunca em AsyncStorage/texto puro.
const CHAVE = 'sessao.v1';

export async function salvarSessao(sessao) {
  await SecureStore.setItemAsync(CHAVE, JSON.stringify(sessao));
}

export async function lerSessao() {
  try {
    const texto = await SecureStore.getItemAsync(CHAVE);
    return texto ? JSON.parse(texto) : null;
  } catch {
    return null; // conteúdo corrompido: trata como "sem sessão"
  }
}

export async function apagarSessao() {
  await SecureStore.deleteItemAsync(CHAVE);
}
