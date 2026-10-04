import React, { useCallback, useEffect, useState } from 'react';
import { Image, ScrollView, StyleSheet, View } from 'react-native';
import { Chip, Text } from 'react-native-paper';

import { Carregando, Erro } from '../componentes/EstadoDaTela';
import { buscarProduto, mensagemDeErro } from '../servicos/api';
import { formatarPercentual, formatarPreco, precoComDesconto } from '../utils/formatar';

export default function TelaDetalheProduto({ route }) {
  const { id } = route.params;
  const [produto, setProduto] = useState(null);
  const [erro, setErro] = useState(null);

  const carregar = useCallback(async () => {
    setErro(null);
    try {
      setProduto(await buscarProduto(id));
    } catch (e) {
      setErro(mensagemDeErro(e, 'Não foi possível carregar o produto.'));
    }
  }, [id]);

  useEffect(() => {
    carregar();
  }, [carregar]);

  if (erro) return <Erro mensagem={erro} aoTentarDeNovo={carregar} />;
  if (!produto) return <Carregando />;

  const comDesconto = precoComDesconto(produto.price, produto.discountPercentage);
  const temDesconto = comDesconto < Number(produto.price);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {produto.thumbnail ? (
        <Image source={{ uri: produto.thumbnail }} style={styles.imagem} accessibilityLabel={produto.title} />
      ) : null}

      <Text variant="headlineSmall" style={styles.titulo}>
        {produto.title}
      </Text>
      {produto.brand ? <Text style={styles.marca}>{produto.brand}</Text> : null}

      <View style={styles.precos}>
        {temDesconto ? <Text style={styles.precoAntigo}>{formatarPreco(produto.price)}</Text> : null}
        <Text variant="headlineMedium" style={styles.preco}>
          {formatarPreco(comDesconto)}
        </Text>
        {temDesconto ? <Chip compact>{formatarPercentual(produto.discountPercentage)}</Chip> : null}
      </View>

      <View style={styles.chips}>
        {produto.rating != null ? <Chip icon="star">{Number(produto.rating).toFixed(1)}</Chip> : null}
        {produto.stock != null ? <Chip icon="package-variant">{produto.stock} em estoque</Chip> : null}
      </View>

      <Text style={styles.descricao}>{produto.description}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  imagem: { width: '100%', height: 260, resizeMode: 'contain', marginBottom: 12 },
  titulo: { fontWeight: 'bold' },
  marca: { color: '#666', marginBottom: 8 },
  precos: { flexDirection: 'row', alignItems: 'center', gap: 10, marginVertical: 8 },
  preco: { color: '#6200ee', fontWeight: 'bold' },
  precoAntigo: { color: '#888', textDecorationLine: 'line-through' },
  chips: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  descricao: { lineHeight: 22 },
});
