# Frontend — build the Vite app, serve the static bundle with nginx.

# ---- build stage ----
FROM node:20-alpine AS build
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install

COPY . .

# VITE_API_URL is baked into the bundle at build time. Leave it empty so a
# production build calls the API same-origin (/api, proxied by nginx) — no
# hard-coded backend host. Override it only to point at a separate API origin.
ARG VITE_API_URL=
ENV VITE_API_URL=$VITE_API_URL
RUN npm run build

# ---- serve stage ----
FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
