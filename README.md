# 🗺️ Mapa Colaborativo UFVJM

> Um sistema inteligente de geolocalização, rotas e gestão de eventos para o campus da UFVJM.

![Status do Projeto](https://img.shields.io/badge/Status-Finalizado-brightgreen)
![License](https://img.shields.io/badge/License-MIT-blue)
![Backend](https://img.shields.io/badge/Backend-Node.js%20%7C%20Express-green)
![Database](https://img.shields.io/badge/Database-PostgreSQL%20%7C%20PostGIS-blue)

## 📄 Sobre o Projeto

O **Mapa Colaborativo UFVJM** é uma aplicação web desenvolvida para facilitar a navegação e a interação da comunidade acadêmica dentro do campus. O sistema permite que alunos, professores e visitantes localizem pontos de interesse (POIs), tracem rotas otimizadas entre prédios e visualizem eventos acadêmicos em tempo real.

O projeto foi construído seguindo os princípios da **Clean Architecture**, garantindo desacoplamento entre as regras de negócio e a infraestrutura, facilitando a manutenção e a escalabilidade.

## ✨ Funcionalidades Principais

### 📍 Navegação e Mapas
* **Visualização Interativa:** Mapa completo do campus renderizado via GeoJSON.
* **Cálculo de Rotas:** Algoritmo de roteamento (Dijkstra via pgRouting) para traçar o caminho mais curto entre dois pontos.
* **Busca de POIs:** Pesquisa por departamentos, laboratórios, auditórios e serviços.
* **Proximidade:** Encontre o que está perto de você com base na sua geolocalização.

### 📅 Gestão de Eventos
* **Agenda Acadêmica:** Visualização de eventos ativos, próximos e históricos.
* **Associação com Local:** Eventos vinculados diretamente aos locais no mapa.
* **Filtros:** Busca de eventos por data ou categoria.

### 👥 Usuários e Autenticação
* **Perfis de Acesso:**
    * *Visitante:* Acesso básico ao mapa e eventos.
    * *Estudante:* Login com email institucional.
    * *Professor:* Validação via matrícula SIAPE.
    * *Administrador:* Gestão total do conteúdo.
* **Favoritos:** Salve seus locais mais frequentados para acesso rápido.
* **Segurança:** Autenticação via JWT (JSON Web Tokens) e senhas criptografadas com Bcrypt.

## 🛠️ Tecnologias Utilizadas

### Backend & API
* **Node.js** & **TypeScript**: Linguagem base e runtime.
* **Express**: Framework web para construção da API RESTful.
* **Clean Architecture**: Divisão em camadas (Domain, Application, Infrastructure).

### Banco de Dados & Geoespacial
* **PostgreSQL**: Banco de dados relacional robusto.
* **PostGIS**: Extensão para suporte a objetos geográficos (Pontos, Linhas, Polígonos).
* **pgRouting**: Extensão para cálculo de rotas e topologia de redes.

### Frontend
* **HTML5 / CSS3**: Estrutura e estilização responsiva.
* **JavaScript (Vanilla)**: Lógica do cliente sem dependência de frameworks pesados.
* **Leaflet.js** (Inferido): Biblioteca para renderização dos mapas.

## 🏗️ Estrutura do Projeto

O código backend está organizado seguindo a **Clean Architecture**:

```text
src/
├── application/       # Casos de uso e serviços da aplicação
│   ├── dtos/          # Objetos de transferência de dados
│   ├── services/      # Implementação das regras de negócio
│   └── use-cases/     # Orquestração das operações
├── domain/            # Entidades e regras centrais (Enterprise Business Rules)
├── infrastructure/    # Implementação técnica (Frameworks, Drivers, DB)
│   ├── database/      # Conexão e scripts SQL
│   ├── geo-parameters/# Constantes geográficas
│   ├── http/          # Servidor Express, Rotas, Controllers e Middlewares
│   ├── repositories/  # Implementação dos repositórios (acesso a dados)
│   └── security/      # Implementação de JWT e Criptografia
├── interfaces/        # Contratos (Interfaces) para repositórios e serviços
└── shared/            # Validadores, Logs e Tratamento de Erros

## 🚀 Como Executar o Projeto

### Pré-requisitos

Antes de começar, certifique-se de ter instalado em sua máquina:
* **Node.js** (v16 ou superior)
* **PostgreSQL** (v13 ou superior)
* **Git**

### 1. Clonar o Repositório

```bash
git clone [https://github.com/seu-usuario/mapa-colaborativo-ufvjm.git](https://github.com/seu-usuario/mapa-colaborativo-ufvjm.git)
cd mapa-colaborativo-ufvjm

## Configurar o Banco de Dados
O projeto utiliza PostgreSQL com as extensões PostGIS e pgRouting.

Crie um banco de dados no PostgreSQL (ex: ufvjm_map).

Habilite as extensões necessárias e importe o esquema inicial localizado em src/infrastructure/database/TB_engS.sql

CREATE DATABASE ufvjm_map;

-- Conecte-se ao banco criado e execute:
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS pgrouting;

-- Em seguida, restaure o dump SQL fornecido no projeto:
-- psql -U seu_usuario -d ufvjm_map -f src/infrastructure/database/TB_engS.sql

## Configurar Variáveis de Ambiente (.env)

# Configurações do Servidor
PORT=3000
NODE_ENV=development

# Configurações do Banco de Dados
DB_HOST=localhost
DB_PORT=5432
DB_NAME=ufvjm_map
DB_USER=seu_usuario_postgres
DB_PASSWORD=sua_senha_postgres

# Segurança (JWT)
JWT_SECRET=troque_isso_por_uma_chave_secreta_segura
JWT_EXPIRES_IN=7d

# CORS (Permitir acesso do frontend)
CORS_ORIGIN=*

# Depêndencias
# Instalar as dependências do projeto
npm install

# Rodar em modo de desenvolvimento (com hot-reload via ts-node-dev ou nodemon)
npm run dev

# Para build de produção e execução
npm run build
npm start
