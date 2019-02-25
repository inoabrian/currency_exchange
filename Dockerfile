FROM node:8

WORKDIR /service

COPY . /service
RUN npm install

EXPOSE 3000
CMD ["npm", "start"]