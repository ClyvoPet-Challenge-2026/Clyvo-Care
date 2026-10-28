# Clyvo Care — Mobile Application

> **Challenge 2026 — Sprint 4 (Mobile Application)**  
> Aplicativo mobile desenvolvido em **React Native + Expo** integrado à API Spring Boot para o ecossistema **Clyvo Vet**, focado na gestão completa da saúde, planos e acompanhamento preventivo de pets.



## Sumário
- [Vídeo de Demonstração](#-vídeo-de-demonstração)
- [Repositório do Backend (API Java Spring Boot)](#-repositório-do-backend-api-java-spring-boot)
- [Repositório do Backend (API .NET — Clínicas e Agendamentos)](#-repositório-do-backend-api-net--clínicas-e-agendamentos)
- [Inicialização Tradicional (Wi-Fi Local ou Emulador)](#-inicialização-tradicional-wi-fi-local-ou-emulador)
- [Inicialização Extrema (End-to-End: Java + Cloudflare Tunnel + Expo)](#-inicialização-extrema-end-to-end-java--cloudflare-tunnel--expo)
- [Solução do Projeto e Funcionalidades](#-solução-do-projeto-e-funcionalidades)
- [Tecnologias Utilizadas](#-tecnologias-utilizadas)
- [Arquitetura e Estrutura de Pastas](#-arquitetura-e-estrutura-de-pastas)
- [Diagnóstico e Comandos Úteis](#-diagnóstico-e-comandos-úteis)
- [Integrantes da Equipe](#-integrantes-da-equipe)


## Vídeo de Demonstração

> **Link do Vídeo no YouTube:** [Link do video no Youtube](https://youtu.be/vcfJ3j9KZHc) (Video é da Sprint 3 ainda...)

> *Demonstração completa da aplicação em execução contínua no celular físico, autenticação JWT, navegação protegida, operações de CRUD sincronizadas em tempo real com a API Java e tratamento de estados de carregamento.*


## Repositório do Backend (API Java Spring Boot)

O **Clyvo Care** consome a API RESTful desenvolvida no repositório parceiro do ecossistema Clyvo Pet:

**Repositório da API:** [ClyvoPet-Challenge-2026/Java-Sprint-1](https://github.com/ClyvoPet-Challenge-2026/Java-Sprint-1)

### Sobre a API Java:
- **Tecnologias:** Java 23, Spring Boot 4.0.6, Spring Data JPA / Hibernate, Spring Security, Flyway e Banco Oracle.
- **Domínio Administrativo & Contratação:** Responsável pelo gerenciamento de tutores (`TB_CAD_OWNER`), pets (`TB_CAD_PET`), planos (`TB_CAD_PLAN`), contratações/assinaturas (`TB_CAD_SUBSCRIPTION`), taxonomia de espécies e raças (`TB_CAD_SPECIES`, `TB_CAD_BREED`).
- **Segurança:** Autenticação stateless via tokens JWT assinados com par de chaves RSA (RS256) e criptografia de senhas com `BCryptPasswordEncoder`.
- **Porta Padrão:** Executada localmente na porta `8080` (`http://localhost:8080`).

## Repositório do Backend (API .NET — Clínicas e Agendamentos)

O **Clyvo Care** consome conjuntamente a API RESTful em ASP.NET Core desenvolvida para o contexto de rede veterinária credenciada e agendamentos clínicos:

**Repositório da API .NET:** [ClyvoPet-Challenge-2026/.Net-Sprint-1](https://github.com/ClyvoPet-Challenge-2026/.Net-Sprint-1)

### Sobre a API .NET:
- **Tecnologias:** .NET 9 (C#), ASP.NET Core, Entity Framework Core, Banco Oracle (schema compartilhado) e MongoDB (auditoria).
- **Domínio Clínico & Agendamentos:** Responsável pelo gerenciamento e busca de clínicas veterinárias credenciadas (`TB_CAD_CLINIC`), leitura de localidades compartilhadas (`TB_CAD_CITY`, `TB_CAD_STATE`) e criação/consulta de eventos clínicos e agendamentos (`TB_HEA_CLINICAL_EVENT`).
- **Segurança e Interoperabilidade:** Validação de tokens JWT emitidos pela API Java através da chave pública RSA compartilhada (`Jwt__PublicKeyPath`), garantindo autorização stateless e integridade do tutor autenticado (`ownerId`, `sub`, `role`).
- **Porta Padrão:** Executada localmente na porta `5067` sob HTTP (`http://localhost:5067`) ou `7197` sob HTTPS (`https://localhost:7197`).

## Inicialização Tradicional (Wi-Fi Local ou Emulador)

Caso prefira conectar diretamente sem utilizar o Cloudflare Tunnel:

### 1. Via Emulador Android Studio (mesma máquina)
Configure no `.env`:
```env
EXPO_PUBLIC_API_URL=http://10.0.2.2:8080
```

### 2. Via Dispositivo Físico na Mesma Rede Wi-Fi Convencional
1. Certifique-se de que computador e smartphone estão no mesmo roteador Wi-Fi residencial (sem isolamento).
2. Descubra o IP local do computador:
   ```bash
   # Linux / macOS:
   ip route get 1.1.1.1 | awk '{print $7}'
   # Windows:
   ipconfig
   ```
3. Configure no `.env`:
   ```env
   EXPO_PUBLIC_API_URL=http://<SEU_IP_LOCAL>:8080
   ```
4. Inicie o Expo:
   ```bash
   npx expo start -c
   ```

### 3. Configuração e Execução da API .NET (Modo Tradicional)
Para que os módulos de clínicas veterinárias e agendamento de consultas funcionem corretamente na inicialização tradicional:

1. **Pré-requisitos e Execução do Backend .NET:**
   No diretório do projeto .NET (`.Net-Sprint-1/ClyvoCare`):
   ```bash
   cd ../.Net-Sprint-1/ClyvoCare
   
   # Configurar a string de conexão Oracle e o caminho absoluto da chave pública do JWT Java
   export ConnectionStrings__ClyvoCareOracle='Data Source=oracle.fiap.com.br:1521/ORCL;User Id=SEU_RM;Password=SUA_SENHA;'
   export Jwt__PublicKeyPath='/caminho/absoluto/para/public_key.pem'
   
   # Restaurar dependências e executar a API
   dotnet restore
   dotnet run --project ClyvoCare.API --launch-profile http
   ```
   *(A API .NET subirá por padrão na porta `5067` sob HTTP)*.

2. **Configuração da variável no `.env` do Clyvo-Care:**
   Adicione a URL base de origem da API .NET (**sempre sem `/api` no final**):
   - **Via Emulador Android Studio (mesma máquina):**
     ```env
     EXPO_PUBLIC_DOTNET_API_URL=http://10.0.2.2:5067
     ```
   - **Via Dispositivo Físico (mesma rede Wi-Fi local):**
     ```env
     EXPO_PUBLIC_DOTNET_API_URL=http://<SEU_IP_LOCAL>:5067
     ```
   - **Via Web / iOS Simulator:**
     ```env
     EXPO_PUBLIC_DOTNET_API_URL=http://localhost:5067
     ```


## Inicialização Extrema (End-to-End: Java + Cloudflare Tunnel + Expo)

> [!TIP]
> **Por que usar a Inicialização Extrema?**  
> Ao rodar o app no celular físico (via Expo Go), o uso de redes móveis (Hotspot 4G/5G) ou roteadores com **isolamento de cliente (Client Isolation)** bloqueia requisições enviadas ao IP local da sua máquina (`192.168.x.x` ou `172.20.x.x`), causando *Network Timeout*.  
> O **Cloudflare Tunnel (`cloudflared`)** cria uma ponte segura HTTPS direta da internet para a porta `8080` do seu computador, garantindo que o aplicativo funcione de ponta a ponta em qualquer celular, sem configurações complexas de rede.

Siga os 4 passos abaixo para subir todo o ecossistema em um único fluxo:

```mermaid
flowchart LR
    A["API Java Spring Boot<br/>(localhost:8080)"] -->|Expõe Porta| B["Cloudflare Tunnel<br/>(https://*.trycloudflare.com)"]
    B -->|Configurado no .env| C["App Mobile Clyvo-Care<br/>(Expo Go / Celular)"]
```

### Passo 1: Iniciar a API Java
No diretório do projeto backend (`Java-Sprint-1`):
```bash
cd ../Java-Sprint-1
./mvnw spring-boot:run
```
*(Aguarde até a mensagem indicando que o Spring Boot iniciou na porta 8080)*.

---

### Passo 2: Iniciar o Túnel Cloudflare
Em uma nova janela de terminal, inicie o túnel temporário:
```bash
# Caso o executável esteja no seu diretório de usuário:
~/cloudflared tunnel --url http://localhost:8080

# Ou caso instalado globalmente no sistema:
cloudflared tunnel --url http://localhost:8080
```
O Cloudflare exibirá no terminal a URL pública gerada:
```text
+--------------------------------------------------------------------------------------------+
|  Your quick Tunnel has been created! Visit it at:                                          |
|  https://exemplo-aleatorio-gerado.trycloudflare.com                                       |
+--------------------------------------------------------------------------------------------+
```
*(Copie essa URL HTTPS gerada)*.

---

### Passo 2.1: Iniciar a API .NET (.Net-Sprint-1)
Em uma nova janela de terminal, navegue até a pasta da API .NET e execute o projeto:
```bash
cd ../.Net-Sprint-1/ClyvoCare

# Exportar variáveis de conexão Oracle e caminho da chave pública RSA do JWT
export ConnectionStrings__ClyvoCareOracle='Data Source=oracle.fiap.com.br:1521/ORCL;User Id=SEU_RM;Password=SUA_SENHA;'
export Jwt__PublicKeyPath='/caminho/absoluto/para/public_key.pem'

# Iniciar no perfil HTTP (porta 5067)
dotnet run --project ClyvoCare.API --launch-profile http
```
*(Aguarde até a mensagem indicando que a API .NET está pronta e escutando na porta 5067: `http://localhost:5067`)*.

---

### Passo 2.2: Iniciar o Segundo Túnel Cloudflare para a API .NET (porta 5067)
Em outra janela de terminal, inicie o túnel para expor a porta da API .NET:
```bash
# Caso o executável esteja no seu diretório de usuário:
~/cloudflared tunnel --url http://localhost:5067

# Ou caso instalado globalmente no sistema:
cloudflared tunnel --url http://localhost:5067
```
*(Copie a URL HTTPS pública gerada para a API .NET, por exemplo: `https://exemplo-aleatorio-dotnet.trycloudflare.com`)*.

---

### Passo 3: Configurar o `.env` do Clyvo-Care
No diretório deste projeto (`Clyvo-Care`), crie o arquivo `.env` (se ainda não o tiver) e cole a URL:
```bash
cp .env.example .env
```
Edite o arquivo `.env`:
```env
EXPO_PUBLIC_API_URL=https://exemplo-aleatorio-gerado.trycloudflare.com
EXPO_PUBLIC_DOTNET_API_URL=https://exemplo-aleatorio-dotnet.trycloudflare.com
```

> [!IMPORTANT]
> **Regras Obrigatórias de Execução com a API .NET:**
> - **Formato da URL base:** A variável `EXPO_PUBLIC_DOTNET_API_URL` deve conter exclusivamente a origem (ex: `https://exemplo.trycloudflare.com`), **nunca termine com `/api`**, pois as rotas dos serviços de agendamentos (`/api/agendamentos`) e clínicas (`/api/clinicas`) são inseridas automaticamente nas chamadas Axios do aplicativo.
> - **Validação de Token JWT:** A API .NET valida o token JWT emitido pela API Java. Por essa razão, a variável `Jwt__PublicKeyPath` deve apontar para o arquivo PEM da chave pública compatível com a chave privada usada pelo Spring Boot.
> - **Cache do Expo:** Sempre que modificar as variáveis no arquivo `.env`, reinicie o bundler do Expo com cache limpo (`npx expo start -c`) para que o bundle absorva as novas configurações.



### Passo 4: Iniciar o Aplicativo Expo
No diretório do `Clyvo-Care`, instale as dependências e inicie o Expo com cache limpo:
```bash
# Instalar dependências (caso seja a primeira execução)
npm install

# Iniciar o Expo no modo túnel com cache limpo
npx expo start

ou

npx expo start --tunnel
```
Abra o app **Expo Go** no seu smartphone (Android ou iOS) e escaneie o QR Code exibido no terminal.

---

### Credenciais de Acesso (Login & Demonstração)

> [!IMPORTANT]
> **Usuário e Senha de Teste:**
> 
> **E-Mail usado:** rural@gmail.com
> 
> **Senha Usada:** senha123
>
> As credenciais de acesso oficiais utilizadas para homologação e avaliação **estão demonstradas detalhadamente no vídeo de apresentação da Sprint**.  
>  
> Caso deseje criar um novo usuário na hora, utilize o fluxo nativo de **"Cadastre-se"** diretamente no aplicativo:
> - O backend valida regras estritas de formato e dígitos verificadores de CPF (`@CPF`).
> - A senha é automaticamente persistida com hash seguro BCrypt no banco Oracle.

## Solução do Projeto e Funcionalidades

O **Clyvo Care** é o portal do tutor dentro da plataforma Clyvo Vet. Suas principais atribuições são:
1. **Autenticação Segura:** Login stateless com token JWT, persistência com `AsyncStorage` e interceptor de requisições.
2. **CRUD Completo de Pets:** Cadastro de pets com seleção de espécies e raças vindas da API, listagem dinâmica filtrada por tutor, edição de dados e remoção com invalidação automática de cache.
3. **CRUD Completo de Tutor (Perfil):** Visualização dos dados do responsável, edição de contato/endereço e exclusão definitiva de conta (`DELETE /responsaveis/{id}`).
4. **Contratação de Planos de Saúde Pet:** Visualização e contratação de planos veterinários categorizados por cobertura.
5. **Agendamento de Consultas:** O Mobile consulta clínicas na API .NET e cria agendamentos autenticados em `POST /api/agendamentos`, usando pets da Java. A confirmação exibe ID e data retornados após `201`; falhas preservam o formulário. Datas são reais, convertidas do fuso do dispositivo para UTC. Os horários sugeridos não representam disponibilidade da clínica. O fluxo integrado foi confirmado no Expo Go/iOS; a versão final do APK deve ser validada sem Metro.

Configure `EXPO_PUBLIC_DOTNET_API_URL` com a origem da API .NET (sem `/api`), por exemplo `http://<SEU_IP_LOCAL>:5067`, e reinicie o Expo. A Java continua usando `EXPO_PUBLIC_API_URL`. O backend .NET precisa estar acessível pela rede e usar a chave pública correspondente ao JWT Java, com a migration de agendamentos aplicada após revisão.
6. **Preferências e Temas:** Alternância dinâmica entre modo Claro (*Light*) e Escuro (*Dark*).



### Detalhamento das Telas e Endpoints

```text
Fluxo Não Autenticado:
├── LoginScreen       -> POST /auth/login (Autenticação com JWT)
└── RegisterScreen    -> POST /responsaveis (Cadastro de novo tutor com validação de CPF)

Fluxo Autenticado (Protegido por AuthGuard):
├── MainScreen        -> GET /planos | GET /pets (Dashboard com carrossel de planos e pets ativos)
├── RegisterPet       -> GET /especies | GET /especies/{id}/racas | POST /pets | PUT /pets/{id}
├── MyPet             -> GET /pets (por tutor) | DELETE /pets/{id} (CRUD Completo de Pets)
├── MakeAppointment   -> Integração com dados do tutor e pet para agendamento clínico
└── MyInformations    -> GET /responsaveis/{id} | PUT /responsaveis/{id} | DELETE /responsaveis/{id} (CRUD Completo de Tutor)
```

## Tecnologias Utilizadas

- **Framework Core:** [React Native](https://reactnative.dev/) & [Expo SDK 58](https://expo.dev/)
- **Linguagem:** [TypeScript](https://www.typescriptlang.org/)
- **Gerenciamento de Estado & Cache:** [TanStack Query v5 (`@tanstack/react-query`)](https://tanstack.com/query)
- **Cliente HTTP:** [Axios](https://axios-http.com/)
- **Navegação:** [React Navigation v7](https://reactnavigation.org/) (`@react-navigation/native-stack`)
- **Persistência Local:** [AsyncStorage](https://react-native-async-storage.github.io/async-storage/)
- **Estilização:** [NativeWind v4](https://www.nativewind.dev/) (Tailwind CSS para React Native)
- **Ícones:** [Lucide React Native](https://lucide.dev/)
- **Túnel de Conexão:** [Cloudflare Tunnel (`cloudflared`)](https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/)


## Arquitetura e Estrutura de Pastas

O código segue padrões limpos de arquitetura em camadas para React Native:

```text
Clyvo-Care/
├── App.tsx                     # Ponto de entrada com Providers (QueryClient, Auth, Theme, Navigation)
├── src/
│   ├── Components/             # Componentes visuais reutilizáveis (Header, Modais, Cards)
│   ├── Context/                # Contextos globais (AuthContext para sessão JWT, ThemeContext)
│   ├── Data/                   # Dados auxiliares (estados, cidades, mocks estruturais)
│   ├── Hooks/                  # Custom Hooks desacoplando TanStack Query da UI (usePets, usePlans)
│   ├── Lib/                    # Instância do QueryClient e definições de QueryKeys
│   ├── Navigation/             # Definição e proteção das rotas (RootNavigator, AuthStack, RootStack)
│   ├── Screens/                # Telas funcionais do aplicativo
│   ├── Services/               # Camada de comunicação com a API RESTful (Axios)
│   └── Types/                  # Interfaces e tipagens TypeScript compartilhadas
├── .env.example                # Template das variáveis de ambiente
└── package.json                # Dependências e scripts de execução
```



## Diagnóstico e Comandos Úteis

| Ação | Comando |
| :--- | :--- |
| **Iniciar Túnel Cloudflare (porta 8080)** | `cloudflared tunnel --url http://localhost:8080` |
| **Testar se o Java está respondendo** | `curl -i http://localhost:8080/especies` |
| **Testar login via terminal** | `curl -i -X POST http://localhost:8080/auth/login -H "Content-Type: application/json" -d '{"email":"seu_email","password":"sua_senha"}'` |
| **Iniciar Expo com cache limpo** | `npx expo start -c --tunnel` |
| **Verificar processos ativos** | `ps aux \| grep -E "cloudflared\|expo\|java"` |
| **Iniciar API .NET (perfil HTTP / porta 5067)** | `dotnet run --project ClyvoCare.API --launch-profile http` |
| **Iniciar Túnel Cloudflare (.NET - porta 5067)** | `cloudflared tunnel --url http://localhost:5067` |
| **Testar se a API .NET está respondendo (Health check)** | `curl -i http://localhost:5067/health` |
| **Testar listagem de clínicas (.NET)** | `curl -i http://localhost:5067/api/clinicas` |
| **Verificar processos ativos (.NET, Java, Túneis, Expo)** | `ps aux \| grep -E "cloudflared\|expo\|java\|dotnet"` |



## Integrantes da Equipe

| Nome do Aluno | RM | 
| :--- | :---: |
| *André Emygdio Ferreira*      | *RM565592* |
| *Gabriel Lourenço Martins*    | *RM562194* |
| *Giovane Amato dos Santos*    | *RM561336* |
| *Matheus Roque Arantes*       | *RM561959* |
| *Orlando Gonçalves de Arruda* | *RM561584* |
