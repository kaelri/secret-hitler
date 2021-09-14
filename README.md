# Secret Hitler

> _Secret Hitler_ is a hidden identity social deduction party game developed by Goat, Wolf, & Cabbage LLC.

This is a playable web implementation of the _[Secret Hitler](https://www.secrethitler.com/)_ tabletop game.

## Uses

- [Express.js](https://expressjs.com/)
- [Vue.js](https://vuejs.org/)
- [Socket.io](https://socket.io/)
- [Day.js](https://day.js.org/)
- [Portal](https://github.com/kaelri/portal)

## License

Secret Hitler is licensed under [Creative Commons BY–NC–SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/). That means you have to give credit for [the original](https://www.secrethitler.com/), you’re not allowed to profit from it commercially in any way, and you have to license it under the exact same CC license. You also can’t submit anything to an app store or anything like that.

## Setup

In `.env`:

```ini
NODE_ENV=development                   # "development" or "production".

APP_URL=http://www.secrethitler.local  # Your server URL.
APP_PORT=80                            # Port for unsecured HTTP requests.
APP_SESSION_SECRET=secret              # Any string. Used to encrypt session cookies.
APP_LOG=false                          # Log will attempt to write to any path other than "false".

SSL=false                              # "true" enables SSL-secured HTTPS server. 
SSL_PORT=443                           # Port for SSL requests.
SSL_CERTIFICATE=ssl/server.crt         # Path to SSL certificate file.
SSL_KEY=ssl/server.key                 # Path to SSL key file.

WS_PORT=443                            # Port for WebSocket requests.

DB_HOST=localhost                      # Your MySQL/MariaDB host host. Defaults to "localhost".
DB_PORT=3306                           # Your MySQL/MariaDB host port. Defaults to "3306".
DB_NAME=secrethitler                   # Your MySQL/MariaDB database name.
DB_USER=secrethitler                   # Your MySQL/MariaDB username.
DB_PASS=password                       # Your MySQL/MariaDB password.
```

Secret Hitler needs a MySQL/MariaDB database. Run the installation script (`npm run install`) to set up the database using the credentials defined in your environment file.
