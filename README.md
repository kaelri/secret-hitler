# Secret Hitler

> _Secret Hitler_ is a hidden identity social deduction party game developed by Goat, Wolf, & Cabbage LLC.

This is a playable web implementation of the _[Secret Hitler](https://www.secrethitler.com/)_ tabletop game.

## Uses

- [Express](https://expressjs.com/)
- [Vue.js](https://vuejs.org/)
- [Axios](https://axios-http.com/)
- [Socket.IO](https://socket.io/)
- [Day.js](https://day.js.org/)

## License

Secret Hitler is licensed under [Creative Commons BY–NC–SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/). That means you have to give credit for [the original](https://www.secrethitler.com/), you’re not allowed to profit from it commercially in any way, and you have to license it under the exact same CC license. You also can’t submit anything to an app store or anything like that.

## Requirements

Your web host should support:

- [Node.js](https://nodejs.org/en/) 14 or greater
- [MySQL](https://www.mysql.com/) 5.6 or greater, or [MariaDB](https://mariadb.org/) 10.1 or greater

If your host serves Node applications with [Phusion Passenger](https://www.phusionpassenger.com/), then [app.js](app.js) will auto-detect Passenger and switch ports & listeners accordingly.

## Setup

1. Create your environment configuration file at `.env` by making a copy of `.env-default`.
2. You will need to provide access to a MySQL/MariaDB database. Update the following properties in `.env`:
    - `DB_HOST`: your database host name.
    - `DB_PORT`: your database port number (usually `3306`).
    - `DB_NAME`: your database name.
    - `DB_USER`: your database username.
    - `DB_PASS`: your database password.
3. Run `npm run install` to install required Node modules and create the database.
4. Run `npm run build` to compile the client CSS and JavaScript.
5. Run `npm run start` to start the server.

By default, the site will be available at [http://localhost:8080](http://localhost:8080).

Run `npm run uninstall` to empty the database.

## Configuration

```ini
NODE_ENV=development           # "development" or "production".

APP_URL=http://localhost       # Your server URL.
APP_PORT=8080                  # Port for unsecured HTTP requests.
APP_SESSION_SECRET=secret      # Any string. Used to encrypt session cookies.
APP_LOG=false                  # Log will attempt to write to any path other than "false".
APP_LOCAL_LIB=false            # Toggles whether third-party libraries (Vue, Google Fonts, etc.) are served locally or from public CDNs.

SSL=false                      # "true" enables SSL-secured HTTPS server. 
SSL_PORT=8443                  # Port for SSL requests.
SSL_CERTIFICATE=ssl/server.crt # Path to SSL certificate file.
SSL_KEY=ssl/server.key         # Path to SSL key file.

WS_PORT=8080                   # Port for WebSocket requests.

DB_HOST=localhost              # Your MySQL/MariaDB host. Defaults to "localhost".
DB_PORT=3306                   # Your MySQL/MariaDB host port. Defaults to "3306".
DB_NAME=secrethitler           # Your MySQL/MariaDB database name.
DB_USER=secrethitler           # Your MySQL/MariaDB username.
DB_PASS=password               # Your MySQL/MariaDB password.
```
