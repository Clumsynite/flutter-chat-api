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

## Endpoints

|        ROUTE        |   METHOD   |      ENDPOINT       |                        PURPOSE                         | TOKEN REQUIRED? |                   RETURNS                   |
| :-----------------: | :--------: | :-----------------: | :----------------------------------------------------: | :-------------: | :-----------------------------------------: |
|                     |            |                     |                                                        |                 |                                             |
|      _`/api`_       |  **POST**  |     _`/signup`_     |                      User Signup                       |     `false`     |            `object of new user `            |
|      _`/api`_       |  **POST**  |     _`/signin`_     |                       User login                       |     `false`     |         `object of user with token`         |
|      _`/api`_       |  **GET**   | _`/is-token-valid`_ |                Veirfy client jwt token                 |     `true`      |                  `boolean`                  |
|                     |            |                     |                                                        |                 |                                             |
|      _`/user`_      |  **PUT**   |    _`/details`_     |                  Update User Details                   |     `true`      |          `object of updated user`           |
|      _`/user`_      |  **PUT**   |    _`/password`_    |                 Change User's password                 |     `true`      |       `object of user with new token`       |
|      _`/user`_      |  **GET**   |      _`/all`_       | Get a list of all users except the authenticated user  |     `true`      |             `array of contacts`             |
|      _`/user`_      |  **GET**   |        _`/`_        |            Get Authenticated User's Profile            |     `true`      |        `user object with old token`         |
|                     |            |                     |                                                        |                 |                                             |
| _`/friend-request`_ |  **GET**   |       _`/to`_       |       get a list of all friend requests received       |     `true`      |             `array of requests`             |
| _`/friend-request`_ |  **GET**   |     _`/count`_      |                get friend request count                |     `true`      |        `integer of requests.length`         |
| _`/friend-request`_ |  **POST**  |     _`/cancel`_     |          cancel friend request by request id           |     `true`      |          `String success message`           |
| _`/friend-request`_ |  **POST**  |        _`/`_        |               create new friend request                |     `true`      |          `String success message`           |
| _`/friend-request`_ | **DELETE** |      _`/:to`_       |         delete friend request by contact's id          |     `true`      |          `String success message`           |
|                     |            |                     |                                                        |                 |                                             |
|     _`/friend`_     |  **GET**   |        _`/`_        |              get a list of user's friends              |     `true`      | `array of user's (Friend model in flutter)` |
|     _`/friend`_     |  **POST**  |        _`/`_        |                 accept friend request                  |     `true`      |          `String success message`           |
|     _`/friend`_     | **DELETE** |      _`/:_id`_      |         remove contact from user's friend list         |     `true`      |          `String success message`           |
|                     |            |                     |                                                        |                 |                                             |
|    _`/message`_     |  **GET**   |  _`/from/:friend`_  |         get a list of all messages form a user         |     `true`      |    `array of messages sent and received`    |
|    _`/message`_     |  **POST**  |        _`/`_        |   send a new message and notify user of the message    |     `true`      |             `object of message`             |
|    _`/message`_     | **DELETE** |  _`/from/:friend`_  | delete all   messages sent to and received from a user |     `true`      |                  `boolean`                  |
|    _`/message`_     | **DELETE** |      _`/:ids`_      |   delete a list of messages by ids([ids].join("&"))    |     `true`      |                  `boolean`                  |
|                     |            |                     |                                                        |                 |                                             |