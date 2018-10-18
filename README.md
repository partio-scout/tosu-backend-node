# tosu-backend-node

Tosu app backend made with Node.js

[![Build Status](https://travis-ci.org/partio-scout/tosu-backend-node.svg?branch=master)](https://travis-ci.org/partio-scout/tosu-backend-node)

# How to use
### Install dependencies
```sh
npm install
```
### Initialize database

Create a `.env` file in project root with the following variables:
```sh
NODE_ENV=development

DB_HOST=localhost
DB_USERNAME=postgres
DB_PASSWORD=

DB_NAME_DEV=tosudb
DB_NAME_TEST=tosudb_test
DB_NAME_PROD=tosudb_prod

SECRET_KEY=superSecretKeyABC
```

SECRET_KEY is used for cookies.

Next:

1. Install PostgreSQL and create databases for development and testing.
2. Configure settings in `.env`
3. Migrate models to the development and testing databases by running:
```sh
./node_modules/.bin/sequelize db:migrate --env development
./node_modules/.bin/sequelize db:migrate --env test
```

### Run in development mode (nodemon)
```sh
npm run watch
```

### Start server
```sh
npm start
```

### Run tests

Run all tests:
```sh
npm test
```

Run one test class:
```sh
npm test activities
```

Code coverage. Prints a report to console and generates an html report to /coverage.
```sh
npm test --coverage
```

# Documentation

* [Product backlog](https://docs.google.com/spreadsheets/d/1s8WgWyk6s9hXbjHSsdBv8X7MHLPGrLpprMkqOl15yBo/edit?usp=sharing)
* [Trello table](https://trello.com/b/87G4Y96t/tosu-app)
