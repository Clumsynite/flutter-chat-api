# flutter-chat-api

## Introduction

This project is built to handle all REST and Socket related operations for [flutter_chat_app](https://github.com/Clumsynite/flutter_chat_app).

## Local Development

### install the dependencies

- Yarn :

  ```console
    yarn install
  ```

- npm:

  ```console
    npm install
  ```

### Setup .env

Setup your .env with values for the following keys.

```js
  PORT=// any number, use the same port in your api uri in flutter_chat_app  
  DB_URL=// get one from mongo db
  JWT_SECRET=// a string to aign and later verify jwt tokens
```

## Running the project locally

### Install

```
  npm i
```

Install all packages

### Start

```
  npm start
```

Starts the express server.

### Start in development mode

```
  npm run dev
```

Similar to [`start`](#start) but, restarts the server on file change