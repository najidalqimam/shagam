# Shagam Laravel API

This folder is the **API + MySQL** backend. The public website and admin UI live in the Next.js app at the repo root.

```bash
composer install
copy .env.example .env
php artisan key:generate
php artisan migrate --seed
php artisan storage:link
php artisan serve
```

Then run Next.js with `LARAVEL_API_URL=http://127.0.0.1:8000/api`.
