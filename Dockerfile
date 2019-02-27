FROM circleci/node

# for mysqladmin command
RUN sudo apt-get install mysql-client

USER node

WORKDIR /home/node
COPY --chown=node:node server code/server
COPY --chown=node:node client code/client
 
WORKDIR /home/node/code/server
RUN yarn install
