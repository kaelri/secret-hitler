# Secret Hitler

_[Secret Hitler](https://www.secrethitler.com/)_ is a hidden identity social deduction party game developed by Goat, Wolf, & Cabbage LLC.

## License

Secret Hitler is licensed under [Creative Commons BY–NC–SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/).

## Setup

In `.env`:

```ini
NODE_ENV=development                # "development" or "production".

APP_URL=https://www.yourdomain.com  # Your server URI.
APP_PORT=443                        # "80" (http) or "443" (https).
APP_SESSION_SECRET=secret           # Any string.
APP_SERVER=npm                      # "npm" or "passenger".

DB_HOST=localhost                   # Your MySQL/MariaDB host host. Defaults to "localhost".
DB_PORT=3306                        # Your MySQL/MariaDB host port. Defaults to "3306".
DB_NAME=secrethitler                # Your MySQL/MariaDB database name.
DB_USER=secrethitler                # Your MySQL/MariaDB username.
DB_PASS=secrethitler                # Your MySQL/MariaDB password.
```

Secret Hitler needs a MySQL/MariaDB database. Run the installation script (`npm run install`) to set up the database using the credentials defined in your environment file.
