FROM php:8.4-cli-bookworm

RUN apt-get update && apt-get install -y --no-install-recommends git unzip libicu-dev \
    && docker-php-ext-install intl opcache \
    && rm -rf /var/lib/apt/lists/*

COPY --from=composer:2 /usr/bin/composer /usr/local/bin/composer
WORKDIR /app
COPY docker/entrypoint.sh /usr/local/bin/brandpack-entrypoint
RUN sed -i 's/\r$//' /usr/local/bin/brandpack-entrypoint && chmod +x /usr/local/bin/brandpack-entrypoint
ENTRYPOINT ["brandpack-entrypoint"]
CMD ["php", "-S", "0.0.0.0:8000", "-t", "public", "public/router.php"]
