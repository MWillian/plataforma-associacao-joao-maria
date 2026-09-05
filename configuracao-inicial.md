# Ambiente de Desenvolvimento: Plataforma João Maria

Siga os passos abaixo para configurar o banco de dados, a API Node.js e o Front-end na sua máquina. 

## 1. Pré-requisitos
* **Node.js** (v22 ou superior)
* **Podman** ou **Docker** 
* **Git**
* **Dbeaver** para gerenciar o banco de dados

## 2. Clonar o Repositório

```bash
git clone [https://github.com/seu-usuario/plataforma-associacao-joao-maria.git](https://github.com/seu-usuario/plataforma-associacao-joao-maria.git)
```

## 3. Subir o Banco de Dados

O banco PostgreSQL roda isolado em um container.  
Na raiz do projeto, execute:

#### Se utilizar Podman:
```bash 
podman compose up -d
```

#### Se utilizar Docker:
```bash 
docker compose up -d
```

## 4. Configuração do Back-end (API Express)

Abra o terminal, acesse a pasta do servidor e instale as dependências.

```bash
cd server
npm install
```

**Configurar Variáveis de Ambiente:**
Crie um arquivo `.env` na pasta `server/` e adicione a string de conexão do banco e a porta da API:

```env
DATABASE_URL="postgresql://postgres:suasenha@localhost:5432/joao_maria?schema=public"
PORT=3001

```

**Sincronizar o Banco (Prisma 5):**
Este comando cria as tabelas no banco de dados com base no arquivo `schema.prisma` e gera a tipagem local.

```bash
npx prisma migrate dev
```

**Rodar a API:**

```bash
npm run dev
```

*O servidor estará rodando em `http://localhost:3001`.*

## 5. Configuração do Front-end (React + Vite)

Abra **outra aba** no terminal, volte para a raiz do projeto e acesse o diretório do front-end.

```bash
cd client
npm install
```

**Instalar Dependências Adicionais:**
Caso as bibliotecas de requisição, estado e ícones ainda não estejam no `package.json`, instale-as:

```bash
npm install axios @tanstack/react-query lucide-react
```

**Configuração do Tailwind CSS (Vite Plugin):**
O projeto utiliza o Tailwind integrado diretamente ao Vite. Certifique-se de que o arquivo `vite.config.js` possui o plugin ativado:

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
})

```

*Nota: Não é necessário criar o arquivo `tailwind.config.js`. Apenas garanta que o arquivo `src/index.css` contenha a linha `@import "tailwindcss";` no topo.*

**Rodar a Interface:**

```bash
npm run dev
```

*A aplicação estará disponível no navegador em `http://localhost:5173`.*