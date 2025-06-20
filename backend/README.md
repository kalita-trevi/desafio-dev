# Backend - API de E-commerce

Esta é a API de backend para a aplicação de e-commerce, desenvolvida com NestJS.

## Funcionalidades

- **Produtos**: Lista produtos agregados de múltiplos fornecedores externos (brasileiros e europeus).
- **Pedidos**: Permite a criação de pedidos. O backend busca os detalhes e preços dos produtos no momento da compra, garantindo que os valores estejam sempre corretos.

## Tecnologias

- [NestJS](https://nestjs.com/)
- [Prisma](https://www.prisma.io/)
- [TypeScript](https://www.typescriptlang.org/)

## Como Executar

1. **Navegue até a pasta do backend:**
   ```sh
   cd backend
   ```

2. **Instale as dependências:**
   ```sh
   npm install
   ```

3. **Aplique as migrações do banco de dados:**
   O Prisma usará o arquivo `prisma/dev.db` (SQLite) para o banco de dados.
   ```sh
   npx prisma migrate dev
   ```

4. **Inicie o servidor de desenvolvimento:**
   ```sh
   npm run start:dev
   ```

A API estará disponível em `http://localhost:3000`.

## Banco de Dados

Para visualizar e interagir com o banco de dados (SQLite) de forma gráfica, você pode usar o Prisma Studio:
```sh
npx prisma studio
```

## Testando a API

Você pode usar o arquivo `backend.http` com a extensão [REST Client](https://marketplace.visualstudio.com/items?itemName=humao.rest-client) do VS Code para testar os endpoints disponíveis.
