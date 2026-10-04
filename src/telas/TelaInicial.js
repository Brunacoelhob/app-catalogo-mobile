import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Button } from 'react-native-paper';
import { useDispatch } from 'react-redux';

import { sair } from '../store/sessaoSlice';
import TelaListaProdutos from './TelaListaProdutos';

const Tab = createBottomTabNavigator();

export default function TelaInicial() {
  const dispatch = useDispatch();

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#6200ee',
        headerRight: () => (
          <Button onPress={() => dispatch(sair())} textColor="red" accessibilityLabel="Sair da conta">
            Sair
          </Button>
        ),
      }}
    >
      <Tab.Screen
        name="Masculino"
        component={TelaListaProdutos}
        initialParams={{ categoria: 'mens-shirts' }} // categoria da API
        options={{
          tabBarIcon: ({ color }) => <MaterialCommunityIcons name="account" color={color} size={26} />,
        }}
      />
      <Tab.Screen
        name="Feminino"
        component={TelaListaProdutos}
        initialParams={{ categoria: 'womens-dresses' }} // outra categoria da API
        options={{
          tabBarIcon: ({ color }) => <MaterialCommunityIcons name="account-outline" color={color} size={26} />,
        }}
      />
    </Tab.Navigator>
  );
}
