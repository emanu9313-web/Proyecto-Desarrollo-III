<<<<<<< HEAD
FROM node:24-bookworm-slim AS build
WORKDIR /app
COPY package.json package-lock.json ./
COPY services/auth-service/package.json services/auth-service/package.json
COPY services/api-gateway/package.json services/api-gateway/package.json
COPY frontend/package.json frontend/package.json
RUN npm ci --workspace @univalle/auth-service
COPY services/auth-service services/auth-service
RUN npm run build --workspace @univalle/auth-service

FROM node:24-bookworm-slim AS runtime
ENV NODE_ENV=production
WORKDIR /app
COPY --from=build --chown=node:node /app/node_modules ./node_modules
COPY --from=build --chown=node:node /app/services/auth-service/dist ./services/auth-service/dist
USER node
EXPOSE 3001
CMD ["node", "services/auth-service/dist/main.js"]
=======
FROM node:20-alpine AS build
WORKDIR /app
COPY package.json ./
COPY services/auth-service/package.json services/auth-service/package.json
COPY services/api-gateway/package.json services/api-gateway/package.json
COPY frontend/package.json frontend/package.json
RUN npm install --workspace @univalle/auth-service
COPY services/auth-service services/auth-service
RUN npm run build --workspace @univalle/auth-service

FROM node:20-alpine AS runtime
ENV NODE_ENV=production
WORKDIR /app
COPY --from=build --chown=node:node /app/node_modules ./node_modules
COPY --from=build --chown=node:node /app/services/auth-service/dist ./dist
USER node
EXPOSE 3001
CMD ["node", "dist/main.js"]
>>>>>>> f82e1 (Entrega 2: proyecto Univalle Shop)
