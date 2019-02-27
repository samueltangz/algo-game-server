FROM circleci/node

# for mysqladmin command
RUN sudo apt-get install mysql-client

USER node

WORKDIR /home/node
COPY --chown=node:node server code/server
COPY --chown=node:node client code/client
 
WORKDIR /home/node/code/server
RUN cp src/config.example.js src/config.js
RUN sed -i "s/localhost/mysql/" src/config.js
RUN yarn install

WORKDIR /home/node/code
