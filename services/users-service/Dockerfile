FROM node:24-bookworm-slim AS build
WORKDIR /app
COPY package.json package-lock.json ./
COPY services/users-service/package.json services/users-service/package.json
COPY services/catalog-service/package.json services/catalog-service/package.json
COPY services/orders-service/package.json services/orders-service/package.json
COPY services/api-gateway/package.json services/api-gateway/package.json
COPY frontend/package.json frontend/package.json
RUN npm ci --workspace @univalle/users-service
COPY services/users-service services/users-service
RUN npm run build --workspace @univalle/users-service

FROM node:24-bookworm-slim AS runtime
ENV NODE_ENV=production
WORKDIR /app
COPY --from=build --chown=node:node /app/node_modules ./node_modules
COPY --from=build --chown=node:node /app/services/users-service/dist ./services/users-service/dist
USER node
EXPOSE 3001
CMD ["node", "services/users-service/dist/main.js"]
