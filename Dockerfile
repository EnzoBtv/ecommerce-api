FROM node:lts-alpine

WORKDIR /usr/backend
ENV PATH /usr/backend/node_modules/.bin:$PATH

COPY package.json /usr/backend/package.json
COPY wait-for-it.sh /usr/backend/wait-for-it.sh


RUN apk update && apk add postgresql-client
RUN apk add --no-cache --upgrade bash
RUN npm i

EXPOSE 3333

RUN ["chmod", "+x", "/usr/backend/wait-for-it.sh"]

CMD su -c './wait-for-it.sh'
