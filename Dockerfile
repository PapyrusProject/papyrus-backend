FROM node:16

ENV TZ=America/Sao_Paulo

WORKDIR /usr/src/papyrus-backend

COPY . .

RUN yarn install
RUN yarn build

EXPOSE 3000

CMD ["yarn", "start"]
