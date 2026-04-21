FROM node:20

RUN apt-get update && apt-get install -y \
    tesseract-ocr \
    tesseract-ocr-por \
    && rm -rf /var/lib/apt/lists/*
    
WORKDIR /app

# Copia pacotes primeiro para aproveitar o cache das camadas
COPY package*.json ./
RUN npm install

# Copia o restante dos arquivos
COPY . .

# Expõe a porta que você definiu no .env
EXPOSE 3000

# Roda o script 'dev' que já está no seu package.json
CMD ["npm", "run", "dev"]