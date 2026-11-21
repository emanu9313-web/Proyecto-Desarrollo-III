FROM node:24-bookworm-slim AS build
WORKDIR /app
COPY package.json package-lock.json ./
COPY services/users-service/package.json services/users-service/package.json
COPY services/catalog-service/package.json services/catalog-service/package.json
COPY services/orders-service/package.json services/orders-service/package.json
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
