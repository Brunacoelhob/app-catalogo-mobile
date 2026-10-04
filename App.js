import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { PaperProvider } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';
import { Provider } from 'react-redux';

import NavegadorApp from './src/navegacao/NavegadorApp';
import { store } from './src/store';

export default function App() {
  return (
    <Provider store={store}>
      <PaperProvider>
        <NavigationContainer>
          <NavegadorApp />
          <StatusBar style="auto" />
        </NavigationContainer>
      </PaperProvider>
    </Provider>
  );
}
