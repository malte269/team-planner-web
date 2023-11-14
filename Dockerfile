
### STAGE 1: Build ###
FROM node:18-alpine as builder

ARG configuration=development

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . ./
RUN npm run build:${configuration}


### STAGE 2: NGINX ###
FROM nginx:stable-alpine

RUN rm -rf /usr/share/nginx/html/*

COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
