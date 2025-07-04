# Projeto: server-backend

Servidor json para simulação de movimentações dentro do sistema my-sales-app.

## Ambiente de desenvolvimento
Para rodar o servidor, no diretório principal do server-backend rodar: npm start –open
* Configurações gerais estão no arquivo index.js, onde por padrão vai subir na porta 3000.
* Acesso: `http://localhost:3000/`
* É possível acessar todos os dados que vamos guardar no servidor por aí. Verificar Categorias, Produtos, Fornecedores..

## Ambiente de Produção
Trabalhei com 2 configurações diferentes no index.js:
* Primeira é para ambiente local
* Segunda é para ficar os dados no servidor dentro do VERCEL, toda configuração é feita para servir lá.
* Quando for usar localmente, comenta a parte do VERCEL, e vice-versa.