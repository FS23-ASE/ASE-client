
FROM node:19.8.1-alpine

WORKDIR /ASE-client

ENV PATH /ASE-client/node_modules/.bin$PATH

ADD . /ASE-client

COPY package.json ./

RUN npm install

EXPOSE 3000

CMD npm run dev