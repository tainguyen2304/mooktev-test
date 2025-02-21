This is a repository for Moovtek test

### Cloning the repository

```shell
git clone https://github.com/tainguyen2304/mooktev-test.git
```

### Install packages

```shell
npm i
```

### Setup .env file

```js
DATABASE_URL=
DIRECT_URL=

AUTH_SECRET=

GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

RESEND_API_KEY=

NEXT_PUBLIC_PORT_SOCKET_SERVERL=
NEXT_PUBLIC_URL_SOCKET_SERVERL=
```

### Setup Prisma

```shell
npx prisma generate
npx prisma db push
```

### Start the app

```shell
npm run dev
npm run dev:socket
```

## Available commands

Running commands with npm `npm run [command]`

| command | description                              |
| :------ | :--------------------------------------- |
| `dev`   | Starts a development instance of the app |
