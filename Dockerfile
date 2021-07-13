FROM node:lts
WORKDIR /api
COPY ./package.json ./
RUN yarn
COPY . .
RUN yarn build
EXPOSE 3000
CMD ["npm", "run", "start:prod"]
