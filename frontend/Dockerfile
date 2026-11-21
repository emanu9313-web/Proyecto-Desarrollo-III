<<<<<<< HEAD
FROM node:24-bookworm-slim AS build
WORKDIR /app
COPY package.json package-lock.json ./
COPY services/auth-service/package.json services/auth-service/package.json
COPY services/api-gateway/package.json services/api-gateway/package.json
COPY frontend/package.json frontend/package.json
RUN npm ci --workspace @univalle/frontend
=======
FROM node:20-alpine AS build
WORKDIR /app
COPY package.json ./
COPY services/auth-service/package.json services/auth-service/package.json
COPY services/api-gateway/package.json services/api-gateway/package.json
COPY frontend/package.json frontend/package.json
RUN npm install --workspace @univalle/frontend
>>>>>>> f82e1 (Entrega 2: proyecto Univalle Shop)
COPY frontend frontend
ARG VITE_API_URL=http://localhost:8080/api
ENV VITE_API_URL=$VITE_API_URL
RUN npm run build --workspace @univalle/frontend

<<<<<<< HEAD
FROM nginx:stable-alpine AS runtime
=======
FROM nginx:1.27-alpine AS runtime
>>>>>>> f82e1 (Entrega 2: proyecto Univalle Shop)
COPY frontend/nginx.conf /etc/nginx/nginx.conf
COPY --from=build /app/frontend/dist /usr/share/nginx/html
RUN chown -R nginx:nginx /usr/share/nginx/html /var/cache/nginx && touch /tmp/nginx.pid && chown nginx:nginx /tmp/nginx.pid
USER nginx
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
