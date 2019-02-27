FROM circleci/node

RUN sudo apt-get install mysql-server

USER node

WORKDIR /home/node
COPY --chown=node:node server code/server
COPY --chown=node:node client code/client
 
WORKDIR /home/node/code/server
COPY --chown=node:node server/src/config.example.js src/config.js
RUN git clone https://github.com/vishnubob/wait-for-it.git
RUN yarn install
