import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { Button, Text } from 'react-native-paper';

/** Carregando / erro com "tentar de novo" / vazio: os três estados que toda tela com rede precisa tratar. */
export function Carregando() {
  return (
    <View style={styles.centro} accessibilityLabel="Carregando">
      <ActivityIndicator size="large" />
    </View>
  );
}

export function Erro({ mensagem, aoTentarDeNovo }) {
  return (
    <View style={styles.centro}>
      <Text style={styles.mensagem} accessibilityLiveRegion="polite">
        {mensagem}
      </Text>
      <Button mode="contained" onPress={aoTentarDeNovo}>
        Tentar de novo
      </Button>
    </View>
  );
}

export function Vazio({ mensagem }) {
  return (
    <View style={styles.centro}>
      <Text style={styles.mensagem}>{mensagem}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  centro: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  mensagem: { textAlign: 'center', marginBottom: 16, color: '#555' },
});
