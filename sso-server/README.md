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

- setup pkce authorization
```bash
php artisan passport:client --public
# id = 1 
# name = sso-pkce or whatever
# redirect uri = http://localhost:3000/sso/callback
# then paste client_id to .env in sso-consumer
```

# Run
```bash
php artisan ser
```

# Todo
- crud clients
