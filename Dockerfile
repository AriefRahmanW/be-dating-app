FROM node:19-alpine

RUN npm i -g pnpm

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN pnpm install

# COPY .env ./.env
COPY prisma ./prisma

# COPY tsconfig.json file
COPY tsconfig.json ./

RUN pnpm prisma generate
# RUN pnpm prisma migrate deploy
# RUN pnpm prisma db seed

COPY . ./

RUN pnpm build

RUN ["chmod", "+x", "./entrypoint.sh"]
ENTRYPOINT ["/app/entrypoint.sh"]

CMD [ "node", "dist/main" ]