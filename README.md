# Social Media Real - Instagram Analytics

## 1. Visão geral

Este projeto é um pequeno painel web para exibir estatísticas de um perfil do Instagram usando apenas a API oficial do Instagram com Instagram Login (OAuth 2.0). A aplicação é intencionalmente simples, sem etapa de build, e foi construída com Node.js, Express e EJS.

## 2. Escopo legal e limitações

- Este app usa somente a API oficial do Instagram. Não coletamos senhas.
- Não implementamos nem mostramos dados que a API oficial não fornece, tais como quem deixou de seguir, quem visitou o perfil ou quem visualizou stories.
- É responsabilidade do operador do app cumprir a política da Meta ao solicitar permissões e publicar o produto.

## 3. Funcionalidades

- Login via Instagram (OAuth 2.0) com escopo instagram_business_basic.
- Troca de código por token de curta duração, troca por token de longa duração e atualização do token.
- Exibição de informações básicas do perfil: username, followers_count, media_count e tempo restante do token.
- Lista das 10 mídias mais recentes com contagem de likes e comentários (quando disponível pela API).
- Logout, refresh de token e endpoint /health.

## 4. Como configurar o app na Meta

1. Crie um app no site de desenvolvedores da Meta (developers.facebook.com).
2. Ative Instagram Login e adicione o redirect URI configurado em `REDIRECT_URI`.
3. Em 'Permissions' solicite `instagram_business_basic`.
4. Configure um token de teste com uma conta profissional (conta profissional/creator). A API exige contas profissionais para acessar certas métricas.

## 5. Variáveis de ambiente

Configure um arquivo .env com as seguintes variáveis (veja .env.example):

- IG_APP_ID
- IG_APP_SECRET
- REDIRECT_URI (ex: https://seu-dominio/auth/callback)
- SESSION_SECRET
- PORT (opcional)

Nunca comite chaves ou segredos no repositório.

## 6. Como rodar

Instale dependências e inicie:

npm install
npm start

Abra http://localhost:3000

## 7. Estrutura do projeto

- server.js — entrada da aplicação
- lib/instagram.js — helpers para OAuth e chamadas à API do Instagram
- routes/auth.js — rotas de autenticação (login, callback, logout, refresh)
- routes/dashboard.js — rota do dashboard e homepage
- views/ — templates EJS
- public/styles.css — estilos
- scripts/ — scripts auxiliares para export/limpeza

## 8. Estado atual (onde paramos)

- Fluxo de OAuth implementado com troca de tokens e chamada básica às endpoints do Graph API v23.0.
- UI mínima e responsiva sem frameworks externos.
- Armazenamento em sessão de memória (não recomendado para produção).

## 9. Próximas melhorias

- Persistência segura de tokens (banco de dados criptografado).
- Suporte a múltiplas contas por usuário.
- Logs e monitoramento adequados.
- Testes automatizados.

## 10. Como exportar todos os arquivos do ambiente

Para exportar o projeto rodando no ambiente atual, execute:

bash scripts/export.sh

Após isso, baixe `export.tar.gz` da árvore de arquivos do projeto.

Como alternativa você pode rodar localmente no Shell:

tar -czf export.tar.gz --exclude=node_modules --exclude=.git .

Para listar os arquivos incluídos no export, rode:

find . -type f -not -path './node_modules/*' -not -path './.git/*'

## 11. Notas internas de limpeza (delete before publishing)

Apague arquivos específicos da plataforma antes de publicar:

.replit
replit.nix
.config
.upm
.cache
.local
.npm
export.tar.gz

Também remova quaisquer pastas ocultas específicas do IDE/plataforma.

Recomenda-se executar:

bash scripts/prepare-release.sh

Em seguida, revise e delete esta seção do README antes de tornar o repositório público.

## 12. Notas de estilo e legibilidade (internal; delete before publishing)

Código deve parecer escrito por um desenvolvedor médio: sem referências a IA ou IDEs. Não usar emojis em código ou comentários. Comentários apenas quando necessários e curtos. Use nomes consistentes, indentação de 2 espaços, aspas simples e ponto e vírgula no final das linhas. Remova esta seção antes da publicação.
