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

```env
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

- `NODE_ENV` defines the type of environment `(production | development | test)` (`development` by default)
- `SECRET_KEY` is used for cookies.
- `HOST_URL` is used for SAML routes (can be left undefined for local development).
- `SAML_METADATA_URL` is used for fetching the SAML metadata for the IdP.

4. Install postgreSQL ([guide](https://www.digitalocean.com/community/tutorials/how-to-install-and-use-postgresql-on-ubuntu-16-04))
5. Access SQL prompt: `sudo -i -u postgres psql` or just `psql`
6. Create databases:

```sql
-- For development
CREATE DATABASE tosudb;

-- For running tests
CREATE DATABASE tosudb_test;

-- For production (not necessary for local dev)
CREATE DATABASE tosudb_prod;
```

7. Exit SQL prompt: `\q` or `exit`
8. Configure database credentials in `.env` if necessary
9. Migrate models to the development and testing databases  
   `npx sequelize db:migrate`

   To undo migrations  
   `npx sequelize db:migrate:undo:all`

10. Start the server (2 options)
    - Static mode: `npm start`
    - Watch mode (development): `npm run watch`

### Running tests

- Run all tests `npm test`
- Run single test class `npm test activities`

Code coverage is generated when tests are run.  
A report is printed to the console and an html report generated to /coverage.

## Deployment

1. Get the unencrypted ssh key `tosu_node.pem`
2. SSH to the server instance:

```sh
$ chmod 600 tosu_node.pem
$ ssh-add tosu_node.pem
$ ssh ubuntu@suunnittelu.beta.partio-ohjelma.fi
```

3. Install node:

```sh
$ curl -sL https://deb.nodesource.com/setup_11.x | sudo -E bash -
$ sudo apt -y install nodejs
```

4. Clone the repo:

```sh
$ git clone git@github.com:partio-scout/tosu-backend-node.git
```

5. Install PM2, a process manager for Node.js applications:

```sh
$ sudo npm install pm2@latest -g
```

6. Start node process:

```sh
$ cd ~/tosu-backend-node
$ npm install
$ pm2 start index.js
```

7. Install NGINX, Reverse proxy and copy nginx.conf file:

```sh
$ sudo apt -y install nginx
$ sudo cp /home/ubuntu/tosu-backend-node/nginx.conf /etc/nginx/sites-available/default
```

8. Restart nginx:

```sh
sudo systemctl restart nginx
```

#### `tosu-backend-node` is now deployed and running!

## Resources

### Documentation

> TODO: Add documentation

Some documentation can be found in the `doc` folder.

### Backlogs

[Product backlog (Trello)](https://trello.com/b/87G4Y96t/tosu-app)  
[Fall 2018 product & sprint backlog](https://docs.google.com/spreadsheets/d/1s8WgWyk6s9hXbjHSsdBv8X7MHLPGrLpprMkqOl15yBo/edit?usp=sharing)

## License

This project is licensed under the MIT License - see the LICENSE file for details.
