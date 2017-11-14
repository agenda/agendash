FROM cusspvz/node:latest
MAINTAINER José Moreira <josemoreiravarzim@gmail.com>

ARG VERSION=latest
RUN npm install -g agendash@${VERSION}

EXPOSE 3000
CMD [ "agendash" ]
