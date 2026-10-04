import React, { useCallback, useEffect, useState } from 'react';
import { FlatList } from 'react-native';

import CartaoProduto from '../componentes/CartaoProduto';
import { Carregando, Erro, Vazio } from '../componentes/EstadoDaTela';
import { buscarProdutosPorCategoria, mensagemDeErro } from '../servicos/api';

export default function TelaListaProdutos({ route, navigation }) {
  const { categoria } = route.params;
  const [produtos, setProdutos] = useState(null); // null = ainda não carregou
  const [erro, setErro] = useState(null);
  const [atualizando, setAtualizando] = useState(false);

  const carregar = useCallback(async () => {
    setErro(null);
    try {
      setProdutos(await buscarProdutosPorCategoria(categoria));
    } catch (e) {
      setErro(mensagemDeErro(e, 'Não foi possível carregar os produtos.'));
    }
  }, [categoria]);

  useEffect(() => {
    carregar();
  }, [carregar]);

  const aoPuxarParaAtualizar = async () => {
    setAtualizando(true);
    await carregar();
    setAtualizando(false);
  };

  if (erro && !produtos) return <Erro mensagem={erro} aoTentarDeNovo={carregar} />;
  if (!produtos) return <Carregando />;
  if (produtos.length === 0) return <Vazio mensagem="Nenhum produto nesta categoria." />;

  return (
    <FlatList
      data={produtos}
      keyExtractor={(item) => String(item.id)}
      renderItem={({ item }) => (
        <CartaoProduto produto={item} aoAbrir={(id) => navigation.navigate('Detalhes', { id })} />
      )}
      refreshing={atualizando}
      onRefresh={aoPuxarParaAtualizar}
      contentContainerStyle={{ paddingVertical: 8 }}
    />
  );
}
