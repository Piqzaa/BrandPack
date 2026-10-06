#!/bin/sh
set -eu
if [ ! -f .env.local ]; then
    php -r 'file_put_contents(".env.local", "APP_SECRET=".bin2hex(random_bytes(32)).PHP_EOL);'
fi
composer install --no-interaction --prefer-dist
exec "$@"
