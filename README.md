# Clyvo Care — Sprint de Mobile

Protótipo funcional em **React Native + Expo** para a solução Clyvo Pet, com fluxo de autenticação, cadastro e visualização de pets, e navegação entre telas.

## Requisitos atendidos (Mobile Application)
- **Navegação entre telas** com React Navigation e múltiplas rotas.
- **Protótipo visual funcional** com telas principais do fluxo.
- **Formulários com manipulação de estado** (login, registro e cadastro de pet).
- **Persistência local** com AsyncStorage (sessão de login).

## Rotas principais
- `LoginScreen`
- `RegisterScreen`
- `MainScreen`
- `RegisterPet`
- `MyPet`
- `MakeAppointment`
- `MyInformations`

## Tecnologias
- React Native (Expo)
- React Navigation
- AsyncStorage
- NativeWind (Tailwind CSS)

## Como executar
1. Instale as dependências:
   ```bash
   npm install
   ```
2. Inicie o projeto:
   ```bash
   npm start
   ```
3. Abra no emulador ou dispositivo físico pelo Expo Go.

## Estrutura de pastas (resumo)
- `src/Navigation` — navegação e rotas
- `src/Screens` — telas do app
- `src/Context` — contexto de autenticação
- `src/Storage` — helpers de persistência

## Observações
Este repositório representa a entrega da Sprint de Mobile para o desafio Clyvo Vet.