FROM node:9
MAINTAINER Pierre-Elouan Rethore <pe@retho.re>

COPY package*.json ./

RUN npm install web3

RUN npm install --only=production

RUN mkdir /app
WORKDIR /app

# copy js and json files - no typescript
COPY *.js ./
COPY *.json ./

EXPOSE 3000
CMD npm start