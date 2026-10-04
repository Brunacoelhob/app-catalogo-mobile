# Catálogo Mobile (React Native + Expo)

[![CI](https://github.com/Brunacoelhob/app-catalogo-mobile/actions/workflows/ci.yml/badge.svg)](https://github.com/Brunacoelhob/app-catalogo-mobile/actions/workflows/ci.yml)
![Expo](https://img.shields.io/badge/expo-SDK%2057-000020)
![License](https://img.shields.io/badge/license-MIT-blue)

Aplicativo mobile de catálogo de loja online: login com autenticação real, produtos por categoria (abas) e tela de detalhes com preço, desconto, nota e estoque. Consome a API pública [DummyJSON](https://dummyjson.com).

## Funcionalidades

- **Login real** na API (token guardado no cofre seguro do aparelho; a sessão é retomada ao reabrir o app)
- **Abas** de categorias (Masculino e Feminino) com lista, *pull-to-refresh* e estados de carregando, erro (com "tentar de novo") e vazio
- **Detalhes** do produto: preço original e com desconto, nota, estoque e descrição
- Acessibilidade: rótulos nos botões e cartões, mensagens de erro anunciáveis por leitor de tela

## Como executar

Requer Node 20+ e o app **Expo Go** no celular (ou um emulador).

```bash
npm install
npm start          # leia o QR code com o Expo Go
```

Login de demonstração (API pública): usuário `emilys` · senha `emilyspass`.

## Arquitetura

```
App.js                   provedores (Redux, Paper, Navegação)
src/
├── navegacao/           NavegadorApp: logado → catálogo; deslogado → só o login
├── telas/               TelaLogin · TelaInicial (abas) · TelaListaProdutos · TelaDetalheProduto
├── componentes/         CartaoProduto · EstadoDaTela (carregando/erro/vazio)
├── servicos/            api (axios, token, tradução de erros) · armazenamento (SecureStore)
├── store/               Redux Toolkit: sessaoSlice (entrar, restaurarSessao, sair)
└── utils/               formatação de preço e desconto
__tests__/               27 testes
```

## O que foi corrigido em relação à primeira versão

| Antes | Agora |
|---|---|
| **O repositório não rodava**: os arquivos estavam com nomes trocados (o `README.md` era o `App.js`, `package.json` era a tela Home, etc.) e faltavam `package.json`, `app.json` e duas telas | Estrutura reconstruída, projeto Expo completo e funcional |
| "Login" falso: qualquer texto entrava | Autenticação real na API; erros amigáveis |
| Sem persistência de sessão | Token no **SecureStore** (Keychain/Keystore) e restauração ao abrir |
| Sem tratamento de erro de rede, sem timeout | Timeout, mensagens em português, "tentar de novo" |
| `console.log` com e-mail digitado e `alert` simples | Sem logs de dados do usuário; feedback na própria tela |
| Sem testes, sem CI | 27 testes (Jest) e CI que também confere se o app empacota |

## Testes

```bash
npm test
```

O CI roda os testes e um `expo export` (empacotamento Android), que acusa imports quebrados.

## Observações

- `npm audit` lista alertas em dependências **transitivas do toolchain do Expo** (ferramentas de build que não vão para o aplicativo). Eles são resolvidos com atualizações do SDK; o Dependabot abre os PRs semanalmente.
- Os preços da DummyJSON são em dólar (`US$`).

## Licença

[MIT](LICENSE)
