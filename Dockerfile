# 1. BAĞIMLILIKLAR VE BUILD AŞAMASI
FROM node:20-alpine AS builder

WORKDIR /app

# Sadece paket tanımlarını kopyala
COPY package.json package-lock.json* ./

# Bağımlılıkları kur
RUN npm ci

# Tüm kaynak kodları kopyala
COPY . .

# Next.js uygulamasını derle
RUN npm run build

# 2. ÜRETİM (PRODUCTION) AŞAMASI (Sadece gerekli olanlar kalır)
FROM node:20-alpine AS runner

WORKDIR /app

# Güvenlik ve performans için node ortam değişkenini belirle
ENV NODE_ENV=production

# Standalone (bağımsız) çıktı dosyalarını ve statik varlıkları builder'dan al
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Portu dışarı aç
EXPOSE 3000

# Standalone modunda server.js doğrudan node ile çalıştırılır
CMD ["node", "server.js"]
