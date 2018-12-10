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
HOST_URL=

DB_HOST=localhost
DB_USERNAME=postgres
DB_PASSWORD=

DB_NAME_DEV=tosudb
DB_NAME_TEST=tosudb_test
DB_NAME_PROD=tosudb_prod

SECRET_KEY=superSecretKeyABC
```

SECRET_KEY is used for cookies. HOST_URL is used for SAML routes (can be left undefined for local development).

Next:

1. Install PostgreSQL and create databases for development and testing:
    1. [Install psql](https://www.digitalocean.com/community/tutorials/how-to-install-and-use-postgresql-on-ubuntu-16-04)
    2. Access sql prompt: `sudo -i -u postgres psql`
    3. Create development database: `create database tosudb;`
    4. Create testing database: `create database tosudb_test;`
    5. Exit: `\q`
    6. [Set password](https://stackoverflow.com/questions/7695962/postgresql-password-authentication-failed-for-user-postgres) if necessary.
2. Configure database settings in `.env` if necessary
3. Migrate models to the development and testing databases by running (in project root):
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

Code coverage is generated when tests are run. A report is printed to the console and an html report generated to /coverage.

# Documentation

* [Product backlog](https://docs.google.com/spreadsheets/d/1s8WgWyk6s9hXbjHSsdBv8X7MHLPGrLpprMkqOl15yBo/edit?usp=sharing)
* [Trello table](https://trello.com/b/87G4Y96t/tosu-app)
