FROM node:20.9.0-alpine

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build
RUN npx prisma generate

EXPOSE 8080

CMD ["node", "dist/app.js"]
