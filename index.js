import 'react-native-gesture-handler';
import { registerRootComponent } from 'expo';

import App from './App';

// Registra o componente raiz tanto no Expo Go quanto em build nativa.
registerRootComponent(App);
