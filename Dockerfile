FROM node:latest

WORKDIR /app/api

COPY . .

RUN yarn install

RUN cat .env.docker >> .env

# RUN rm -rf ./build

# RUN npx tsc

# RUN cp -R ./resources ./build/resources 

# RUN cat ./serviceAccountKey.json >> ./build/serviceAccountKey.json

# RUN cp /app/api/.env /app/api/build/

# CMD [ "node","./build/index.js" ]

CMD [ "yarn","start" ]