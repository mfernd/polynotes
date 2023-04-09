# Stage 1: Build React app
FROM node:16-alpine AS builder

WORKDIR /app

# install deps
COPY package.json ./
COPY yarn.lock ./
RUN yarn install --frozen-lockfile

# copy rest of the files
COPY . .

RUN yarn build

# Stage 2: Serve React app with Nginx
FROM nginx:1.23.4-alpine

COPY ./nginx.conf /etc/nginx/nginx.conf
RUN rm -rf /usr/share/nginx/html/*

# copy dist files
WORKDIR /usr/share/nginx/html
COPY --from=builder /app/dist ./

RUN chmod a+r . -R

# run in foreground
CMD ["nginx", "-g", "daemon off;"]
