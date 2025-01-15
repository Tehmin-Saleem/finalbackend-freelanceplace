FROM node:18-alpine3.18 as build

# Build arguments and environment variables
ARG REACT_APP_NODE_ENV
ARG REACT_APP_SERVER_BASE_URL
ENV REACT_APP_NODE_ENV=$REACT_APP_NODE_ENV
ENV REACT_APP_SERVER_BASE_URL=$REACT_APP_SERVER_BASE_URL

WORKDIR /app
COPY package.json .
RUN npm install
COPY . .
RUN npm run build

FROM nginx:1.23-alpine
WORKDIR /usr/share/nginx/html
RUN rm -rf ./*
COPY --from=build /app/dist .
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 5173
ENTRYPOINT ["nginx", "-g", "daemon off;"]