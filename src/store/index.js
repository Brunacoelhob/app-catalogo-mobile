import { configureStore } from '@reduxjs/toolkit';

import sessaoReducer from './sessaoSlice';

export const criarStore = () => configureStore({ reducer: { sessao: sessaoReducer } });

export const store = criarStore();
