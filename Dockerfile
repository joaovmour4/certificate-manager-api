FROM node:18

# Defina o diretório de trabalho
WORKDIR /app

# Copie o package.json e o package-lock.json
COPY package*.json ./

# Instalar as dependências novamente, forçando a recompilação de módulos nativos
RUN npm install

# Copie o restante do código
COPY . .

# Build do código
RUN npm run build

# Copiando o .env
COPY .env ./build

# Exponha a porta
EXPOSE 3000

# Comando para rodar o app
CMD ["npm", "start"]
