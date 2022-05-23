FROM node:10.12-slim

#Create app directory
WORKDIR /user/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install
# If you are building your code for production
# RUN npm install --only=production

# Bundle app source
COPY . .

RUN npm install pm2 -g

ENV NODE_ENV prod
ENV BACKEND_URL http://backend.fidelizapp.es:85
ENV MONGO_URI mongodb://mongo:27017/fidelizApp
ENV DB_USERNAME fidelizApp1
ENV DB_PWD fidelizApp2022
ENV DB_NAME fidelizApp
ENV SEED fidelizApp-encrypt-seed

EXPOSE 3000 8080

# CMD [ "npm", "start" ]
CMD [ "pm2-runtime", "-i", "max", "server/server.js" ]
