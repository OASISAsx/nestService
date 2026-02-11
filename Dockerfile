# ============================
# 1️⃣ Builder Stage
# ============================
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./

# install ทุกอย่างเพื่อ build
RUN npm ci

COPY . .

# generate prisma client
RUN npx prisma generate

# build nestjs
RUN npm run build


# ============================
# 2️⃣ Production Stage
# ============================
FROM node:20-alpine AS runner

WORKDIR /app

# ติดตั้งเฉพาะ production deps
COPY package*.json ./
RUN npm ci --omit=dev

# copy build output + prisma
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/prisma ./prisma

ENV NODE_ENV=production

EXPOSE 3001

CMD ["node", "dist/main.js"]
