# ============================
# 1️⃣ Builder Stage
# ============================
FROM node:20-alpine AS builder

WORKDIR /app

# 👉 Prisma ต้องใช้ libc + openssl
RUN apk add --no-cache libc6-compat openssl

COPY package*.json ./

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

# 👉 ต้องมีเหมือน builder ไม่งั้น prisma ใช้ไม่ได้
RUN apk add --no-cache libc6-compat openssl

COPY package*.json ./

# install เฉพาะ production deps
RUN npm ci --omit=dev

# copy build output + prisma engine
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=builder /app/prisma ./prisma

ENV NODE_ENV=production

EXPOSE 3001

CMD ["node", "dist/main.js"]
