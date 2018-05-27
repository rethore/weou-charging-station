FROM node:carbon

WORKDIR /usr/src/app

COPY charging-station ./
RUN npm i
RUN node node_modules/typescript/bin/tsc -p tsconfig.json

# Bundle app source

EXPOSE 3000
CMD [ "npm", "start" ]

# docker run -p 3000:3000 derp
# docker build -t derp .