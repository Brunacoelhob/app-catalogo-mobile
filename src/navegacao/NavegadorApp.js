import React, { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { useDispatch, useSelector } from 'react-redux';

import TelaDetalheProduto from '../telas/TelaDetalheProduto';
import TelaInicial from '../telas/TelaInicial';
import TelaLogin from '../telas/TelaLogin';
import { restaurarSessao, selecionarLogado } from '../store/sessaoSlice';

const Stack = createStackNavigator();

export default function NavegadorApp() {
  const dispatch = useDispatch();
  const logado = useSelector(selecionarLogado);
  const restaurando = useSelector((state) => state.sessao.restaurando);

  useEffect(() => {
    dispatch(restaurarSessao());
  }, [dispatch]);

  if (restaurando) {
    return (
      <View style={{ flex: 1, justifyContent: 'center' }} accessibilityLabel="Carregando">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {logado ? (
        // Logado: as telas do catálogo ficam acessíveis
        <>
          <Stack.Screen name="Inicio" component={TelaInicial} />
          <Stack.Screen
            name="Detalhes"
            component={TelaDetalheProduto}
            options={{ headerShown: true, title: 'Detalhes do produto' }}
          />
        </>
      ) : (
        // Não logado: só o login existe na navegação (não dá para "voltar" para o catálogo)
        <Stack.Screen name="Login" component={TelaLogin} />
      )}
    </Stack.Navigator>
  );
}
