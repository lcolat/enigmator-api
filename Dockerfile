FROM node:lts
RUN mkdir /usr/src/app
WORKDIR /usr/src/app
COPY . /usr/src/app/
RUN npm install
RUN npm install loopback-component-storage --save
CMD ["npm", "start"]