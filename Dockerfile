FROM node:lts
RUN mkdir /usr/src/app
WORKDIR /usr/src/app
COPY . /usr/src/app/
RUN npm install loopback-component-storage --save
RUN npm install
CMD ["npm", "start"]