# 📱 Catálogo Interativo Mobile - Loja Online

Este projeto é um aplicativo mobile responsivo desenvolvido em **React Native** com **Expo**. Ele simula um catálogo de e-commerce funcional, consumindo dados de uma API real e gerenciando o estado global do usuário.

## 🚀 Funcionalidades
- **Autenticação:** Tela de login com validação de campos.
- **Navegação por Abas (Tabs):** Separação de produtos por categorias (Masculino e Feminino).
- **Consumo de API:** Integração com a `DummyJSON` via Axios para listagem dinâmica.
- **Detalhes do Produto:** Tela específica para exibir informações detalhadas, preço e descontos.
- **Gerenciamento de Estado:** Uso do Redux Toolkit para controlar o login e logout do usuário.

## 🛠️ Tecnologias Utilizadas
- [React Native](https://reactnative.dev/) + [Expo](https://expo.dev/)
- [React Navigation](https://reactnavigation.org/) (Stack & Tabs)
- [Redux Toolkit](https://redux-toolkit.js.org/) (Estado Global)
- [Axios](https://axios-http.com/) (Consumo de API)
- [React Native Paper](https://callstack.github.io/react-native-paper/) (Componentes Visuais)

## 📁 Estrutura do Projeto
```text
src/
 ├── components/    # Componentes reutilizáveis
 ├── navigation/    # Configuração de rotas (AppNavigator)
 ├── screens/       # Telas do App (Login, Home, Detalhes)
 ├── services/      # Configuração do Axios (API)
 └── store/         # Configuração do Redux (Slices)
 ```