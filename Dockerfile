FROM node:18-alpine

# Bağımlılıkları kurmak için klasör oluştur
WORKDIR /app

# Sadece paket tanımlarını kopyala ve kurulum yap (Önbellek avantajı)
COPY package.json package-lock.json* ./
RUN npm install

# Projenin geri kalanını kopyala
COPY . .

# Next.js build'ini oluştur
RUN npm run build

# Uygulamanın çalışacağı port
EXPOSE 3000

# Server'ı başlat
CMD ["npm", "start"]
