FROM node:20-alpine AS build

WORKDIR /usr/src/app

COPY frontend/package*.json ./

RUN npm ci

COPY frontend/ .
COPY src/ ../src/

RUN npm run build

FROM nginx:alpine

COPY frontend/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /usr/src/app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
