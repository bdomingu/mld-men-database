FROM node:16

WORKDIR /app

COPY . /app

RUN npm install

RUN npm install mysql2

RUN npm run build

EXPOSE 3000

CMD [ "npm", "run", "start" ]