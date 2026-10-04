import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Card, Text } from 'react-native-paper';

import { formatarPercentual, formatarPreco, precoComDesconto } from '../utils/formatar';

export default function CartaoProduto({ produto, aoAbrir }) {
  const comDesconto = precoComDesconto(produto.price, produto.discountPercentage);
  const temDesconto = comDesconto < Number(produto.price);

  return (
    <Card
      style={styles.cartao}
      onPress={() => aoAbrir(produto.id)}
      accessibilityRole="button"
      accessibilityLabel={`${produto.title}, ${formatarPreco(comDesconto)}`}
    >
      <View style={styles.linha}>
        {produto.thumbnail ? <Card.Cover source={{ uri: produto.thumbnail }} style={styles.imagem} /> : null}
        <Card.Content style={styles.conteudo}>
          <Text variant="titleMedium" numberOfLines={2}>
            {produto.title}
          </Text>
          {temDesconto ? <Text style={styles.precoAntigo}>{formatarPreco(produto.price)}</Text> : null}
          <Text variant="titleLarge" style={styles.preco}>
            {formatarPreco(comDesconto)}
          </Text>
          {temDesconto ? <Text style={styles.desconto}>{formatarPercentual(produto.discountPercentage)}</Text> : null}
        </Card.Content>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  cartao: { marginHorizontal: 12, marginVertical: 6 },
  linha: { flexDirection: 'row', alignItems: 'center' },
  imagem: { width: 96, height: 96, margin: 8 },
  conteudo: { flex: 1, paddingVertical: 8 },
  preco: { color: '#6200ee', fontWeight: 'bold' },
  precoAntigo: { color: '#888', textDecorationLine: 'line-through' },
  desconto: { color: '#2e7d32', fontWeight: 'bold' },
});
