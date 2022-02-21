FROM node:lts-alpine3.9
RUN mkdir -p app
WORKDIR /app
COPY . /app
RUN npm install
RUN npm rebuild node-sass
