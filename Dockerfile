ARG BASE_IMAGE=node:22
FROM ${BASE_IMAGE}

WORKDIR /home/app

RUN npm install -g pnpm@9.5.0

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm build

CMD ["pnpm", "start"]
