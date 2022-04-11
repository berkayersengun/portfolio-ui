# FROM node:13.12.0-alpine
# WORKDIR /app/frontend

# COPY package.json package-lock.json ./
# RUN npm install 
# RUN npm install react-scripts@5.0.0 -g 
# COPY . ./
# EXPOSE 3000

# build environment
# FROM arm64v8/node as build
FROM node:alpine as build
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
COPY package.json package-lock.json ./
RUN npm ci
COPY . ./
RUN npm run build

# production environment
FROM nginx:stable-alpine
# RUN rm -rf ./*
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80 443
CMD ["nginx", "-g", "daemon off;"]