# Toiminnansuunnittelu [backend]

Tosu app backend made with Node.js

[![Build Status](https://travis-ci.org/partio-scout/tosu-backend-node.svg?branch=master)](https://travis-ci.org/partio-scout/tosu-backend-node)

## Getting Started

### Prerequisites

[node.js ](https://nodejs.org/en/)

### Installing

1. Clone the repository  
   `git clone git@github.com:partio-scout/tosu-backend-node.git`
2. Install npm packages  
   `npm install`
3. Add `.env` file to project root

```
NODE_ENV=development
HOST_URL=
SAML_METADATA_URL=

DB_HOST=localhost
DB_USERNAME=postgres
DB_PASSWORD=

DB_NAME_DEV=tosudb
DB_NAME_TEST=tosudb_test
DB_NAME_PROD=tosudb_prod

SECRET_KEY=superSecretKeyABC
```

`SECRET_KEY` is used for cookies.  
`HOST_URL` is used for SAML routes (can be left undefined for local development).  
`SAML_METADATA_URL` is used for fetching the SAML metadata for the IdP.

4. Install postgreSQL ([guide](https://www.digitalocean.com/community/tutorials/how-to-install-and-use-postgresql-on-ubuntu-16-04))
5. Access SQL prompt: `sudo -i -u postgres psql`
6. Create databases:

```sql
CREATE DATABASE tosudb;
CREATE DATABASE tosudb_test;
CREATE DATABASE tosudb_prod;
```

7. Exit SQL prompt: `\q`
8. Configure database settings in `.env` if necessary
9. Migrate models to the development and testing databases:

```sh
# Execute in project root
./node_modules/.bin/sequelize db:migrate --env development
./node_modules/.bin/sequelize db:migrate --env test
./node_modules/.bin/sequelize db:migrate --env production
```

Undoing migrations:

```sh
# Execute in project root
./node_modules/.bin/sequelize db:migrate:undo:all --env development
./node_modules/.bin/sequelize db:migrate:undo:all --env test
./node_modules/.bin/sequelize db:migrate:undo:all --env production
```

10. Start the server (2 options)
    - Normal mode (frontend development):`npm start`
    - Watch mode (backend development): `npm run watch`

### Running tests

- Run all tests `npm test`
- Run single test class `npm test activities`

Code coverage is generated when tests are run.  
A report is printed to the console and an html report generated to /coverage.

## Deployment

- Install node:  
  `curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -`
  `sudo apt -y install nodejs`

- Clone the repo:  
  `git clone git@github.com:partio-scout/tosu-backend-node.git`

- Install PM2, a process manager for Node.js applications:  
  `sudo npm install pm2@latest -g`

- Start node process:  
  `cd ~/tosu-backend-node`  
  `npm install`  
  `pm2 start index.js`

- Install NGINX, Reverse proxy and copy nginx.conf file:  
  `sudo apt -y install nginx`  
  `sudo cp /home/ubuntu/tosu-backend-node/nginx.conf /etc/nginx/sites-available/default`

- Restart nginx:  
  `sudo systemctl restart nginx`

## Resources

### Documentation

> TODO: Add documentation

Some documentation can be found in the `doc` folder.

### Backlogs

[Product backlog (Trello)](https://trello.com/b/87G4Y96t/tosu-app)  
[Fall 2018 product & sprint backlog](https://docs.google.com/spreadsheets/d/1s8WgWyk6s9hXbjHSsdBv8X7MHLPGrLpprMkqOl15yBo/edit?usp=sharing)

## License

This project is licensed under the MIT License - see the LICENSE file for details.
