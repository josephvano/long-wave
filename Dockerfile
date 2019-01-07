FROM node:10

ENV NPM_CONFIG_PREFIX=/home/node/.npm-global
ENV PATH=$PATH:/home/node/.npm-global/bin 
# optionally if you want to run npm global bin without specifying path

WORKDIR /home/node/jobs
COPY package*.json ./

RUN npm install pm2 typescript ts-node -g
RUN npm install
RUN mkdir -p /var/log/longwave
RUN chown -R node:node /var/log/longwave

COPY . .
COPY --chown=node:node . .

USER node
