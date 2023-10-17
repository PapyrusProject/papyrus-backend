FROM node:16

ENV TZ=America/Sao_Paulo

WORKDIR /usr/src/papyrus-backend

COPY . .

RUN yarn install
RUN yarn build

RUN yarn prisma generate

EXPOSE 5000

CMD ["yarn", "start"]