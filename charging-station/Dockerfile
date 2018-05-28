FROM node:9
MAINTAINER Pierre-Elouan Rethore <pe@retho.re>

RUN mkdir /app
WORKDIR /app
COPY . ./
RUN npm install
RUN node node_modules/typescript/bin/tsc -p tsconfig.json

EXPOSE 3000
CMD npm start
