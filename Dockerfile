FROM node:latest

WORKDIR /app/api

COPY . .

RUN yarn install

CMD [ "yarn","run","docker" ]