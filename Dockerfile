FROM node:8
RUN mkdir /docker_server
ADD package.json /docker_server
ADD schema.js /docker_server
ADD connection.js /docker_server
ADD server.js /docker_server
ADD package-lock.json /docker_server
WORKDIR /docker_server
RUN npm i
EXPOSE 3000
CMD ["npm","start"]
