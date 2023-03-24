# Setup
- Installing dependencies
```bash
composer install && npm install
```

- setup database stuff
```bash
cp -r .env.example .env
```

- setup passport
```
php artisan migrate:fresh && php artisan passport:install --uuids --force
```

- y

# Run
```bash
php artisan ser
```

# Todo
- crud clients
