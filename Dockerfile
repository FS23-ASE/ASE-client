
FROM node:19.8.1-alpine

USER nonroot

WORKDIR /ASE-client

ENV PATH /ASE-client/node_modules/.bin$PATH

ADD . /ASE-client

COPY package.json ./
COPY package-lock.json ./

RUN npm install --ignore-scripts

EXPOSE 3000

CMD npm run dev
