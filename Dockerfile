FROM node:alpine
COPY . /var/www/
WORKDIR /var/www/
RUN npm install
EXPOSE 3030
CMD npm start