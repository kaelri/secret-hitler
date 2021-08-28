# Secret Hitler

> _Secret Hitler_ is a hidden identity social deduction party game developed by Goat, Wolf, & Cabbage LLC.

This is a playable web implementation of the _[Secret Hitler](https://www.secrethitler.com/)_ tabletop game. It is built in Node.js, using the [Express](https://expressjs.com/) framework and a [Vue.js](https://vuejs.org/) front-end.

## License

Secret Hitler is licensed under [Creative Commons BY–NC–SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/).

## Setup

In `.env`:

```ini
NODE_ENV=development                   # "development" or "production".

APP_SERVER=npm                         # "npm" or "passenger".
APP_URL=http://www.secrethitler.local  # Your server URI.
APP_PORT=8080                          # For production, use "80" for HTTP or "443" for HTTPS.
APP_SSL=false                          # "true" enables SSL-secured HTTPS server. 
APP_SSL_CERTIFICATE=ssl/server.crt     # Path to SSL certificate.
APP_SSL_KEY=ssl/server.key             # Path to SSL key.
APP_SESSION_SECRET=secret              # Any string. Used to encrypt session cookies.

DB_HOST=localhost                      # Your MySQL/MariaDB host host. Defaults to "localhost".
DB_PORT=3306                           # Your MySQL/MariaDB host port. Defaults to "3306".
DB_NAME=secrethitler                   # Your MySQL/MariaDB database name.
DB_USER=secrethitler                   # Your MySQL/MariaDB username.
DB_PASS=password                       # Your MySQL/MariaDB password.
```

Secret Hitler needs a MySQL/MariaDB database. Run the installation script (`npm run install`) to set up the database using the credentials defined in your environment file.
