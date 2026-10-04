import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native';
import { Button, HelperText, Text, TextInput } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';

import { entrar, limparErro } from '../store/sessaoSlice';

export default function TelaLogin() {
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const [erroLocal, setErroLocal] = useState(null);
  const dispatch = useDispatch();
  const { entrando, erro } = useSelector((state) => state.sessao);

  const aoEntrar = () => {
    if (usuario.trim() === '' || senha.trim() === '') {
      setErroLocal('Por favor, preencha todos os campos.');
      return;
    }
    setErroLocal(null);
    dispatch(entrar({ usuario, senha }));
  };

  const mensagem = erroLocal ?? erro;

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Text variant="headlineMedium" style={styles.title}>
        Catálogo Mobile
      </Text>
      <Text style={styles.subtitle}>Faça login para continuar</Text>

      <TextInput
        label="Usuário"
        value={usuario}
        onChangeText={(t) => {
          setUsuario(t);
          if (erro) dispatch(limparErro());
        }}
        mode="outlined"
        style={styles.input}
        autoCapitalize="none"
        autoCorrect={false}
        textContentType="username"
        testID="campo-usuario"
      />

      <TextInput
        label="Senha"
        value={senha}
        onChangeText={setSenha}
        mode="outlined"
        style={styles.input}
        secureTextEntry
        textContentType="password"
        testID="campo-senha"
      />

      <HelperText type="error" visible={Boolean(mensagem)} accessibilityLiveRegion="polite">
        {mensagem}
      </HelperText>

      <Button mode="contained" onPress={aoEntrar} loading={entrando} disabled={entrando} style={styles.button}>
        Entrar
      </Button>

      <View style={styles.dica}>
        <Text style={styles.dicaTexto}>Demonstração (API pública DummyJSON): usuário emilys · senha emilyspass</Text>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center', backgroundColor: '#fff' },
  title: { textAlign: 'center', fontWeight: 'bold', color: '#6200ee' },
  subtitle: { textAlign: 'center', marginBottom: 30, color: '#666' },
  input: { marginBottom: 8 },
  button: { marginTop: 10, paddingVertical: 5 },
  dica: { marginTop: 24 },
  dicaTexto: { textAlign: 'center', color: '#888', fontSize: 12 },
});
