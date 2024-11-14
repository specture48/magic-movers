FROM node:18-buster-slim

WORKDIR /app

COPY package.json .

RUN yarn install


CMD ["dist/index.js"]

