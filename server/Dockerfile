# Imagem oficial Node 20 slim. ffmpeg vem do pacote ffmpeg-static (npm),
# não precisa instalar pelo apt. better-sqlite3 precisa de ferramentas
# de build no momento do npm install (depois é binário puro).

FROM node:20-slim AS build

# better-sqlite3 precisa de python+make+g++ pra compilar bindings
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 make g++ ca-certificates \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY package.json ./
RUN npm install --omit=dev

COPY . .

# ----------------------------------------------------------------
FROM node:20-slim

WORKDIR /app

# Bibliotecas runtime que better-sqlite3 e ffmpeg podem precisar
RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

COPY --from=build /app /app

ENV NODE_ENV=production
ENV PORT=3000

# Cria pasta de dados (será montada como volume persistente em produção)
RUN mkdir -p /data && chown -R node:node /data
USER node

EXPOSE 3000
CMD ["node", "src/index.js"]
