# tosu-backend-node

Tosu app backend made with Node.js

# How to use
### Install dependencies
```sh
npm install
```
### Initialize database

1. Install PostgreSQL and create database "tosudb" with user "postgres".
2. Configure settings in config/config.json (TODO: Use env variables)
3. Migrate models to the database by running `./node_modules/.bin/sequelize db:migrate`

### Run in development mode (nodemon)
```sh
npm run watch
```

### Start server
```sh
npm start
```

### Run tests

```sh
npm test
```

# Documentation

* [Product backlog](https://docs.google.com/spreadsheets/d/1s8WgWyk6s9hXbjHSsdBv8X7MHLPGrLpprMkqOl15yBo/edit?usp=sharing)
* [Trello table](https://trello.com/b/87G4Y96t/tosu-app)
