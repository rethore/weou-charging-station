# Build command:
#    docker build -t charging-station .
# Run command:
#    docker run -p 3000:3000 charging-station

FROM node:9
MAINTAINER Pierre-Elouan Rethore <pe@retho.re>

RUN mkdir /app
WORKDIR /app
COPY . ./
RUN npm install -g node-gyp
RUN npm install
RUN node node_modules/typescript/bin/tsc -p tsconfig.json

EXPOSE 3000
CMD npm start