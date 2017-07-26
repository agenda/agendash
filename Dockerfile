FROM node:8.2.0-alpine

# Dependencies
# RUN apk update && apk upgrade && \
#    apk add --no-cache bash gawk sed grep bc coreutils git openssh

RUN mkdir -p /agendash
WORKDIR /agendash

COPY package.json /agendash/
RUN npm install && npm cache clean --force

COPY . /agendash

ENTRYPOINT ["node", "./bin/agendash-standalone.js"]
CMD ["--db=mongodb://mongodb"]
