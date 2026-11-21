<<<<<<< HEAD
FROM node:24-bookworm-slim AS build
WORKDIR /app
COPY package.json package-lock.json ./
COPY services/auth-service/package.json services/auth-service/package.json
COPY services/api-gateway/package.json services/api-gateway/package.json
COPY frontend/package.json frontend/package.json
RUN npm ci --workspace @univalle/api-gateway
COPY services/api-gateway services/api-gateway
RUN npm run build --workspace @univalle/api-gateway

FROM node:24-bookworm-slim AS runtime
ENV NODE_ENV=production
WORKDIR /app
COPY --from=build --chown=node:node /app/node_modules ./node_modules
COPY --from=build --chown=node:node /app/services/api-gateway/dist ./services/api-gateway/dist
USER node
EXPOSE 8080
CMD ["node", "services/api-gateway/dist/main.js"]
=======
FROM node:20-alpine AS build
WORKDIR /app
COPY package.json ./
COPY services/auth-service/package.json services/auth-service/package.json
COPY services/api-gateway/package.json services/api-gateway/package.json
COPY frontend/package.json frontend/package.json
RUN npm install --workspace @univalle/api-gateway
COPY services/api-gateway services/api-gateway
RUN npm run build --workspace @univalle/api-gateway

FROM node:20-alpine AS runtime
ENV NODE_ENV=production
WORKDIR /app
COPY --from=build --chown=node:node /app/node_modules ./node_modules
COPY --from=build --chown=node:node /app/services/api-gateway/dist ./dist
USER node
EXPOSE 8080
CMD ["node", "dist/main.js"]
>>>>>>> f82e1 (Entrega 2: proyecto Univalle Shop)
