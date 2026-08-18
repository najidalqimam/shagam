# شاغم — Laravel + MySQL

منصة خدمات الطائرات المسيّرة. التطبيق الحالي في مجلد `laravel/` ويعمل على **PHP Laravel** مع **MySQL**.

## المتطلبات

- PHP 8.3+ مع امتدادات: `pdo_mysql`, `mbstring`, `openssl`, `fileinfo`, `gd`, `curl`
- Composer
- MySQL 8
- Node.js (لبناء CSS عبر Vite)

## التشغيل المحلي

1. أنشئ قاعدة البيانات:

```sql
CREATE DATABASE shagam CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

2. من مجلد `laravel/`:

```bash
composer install
copy .env.example .env
php artisan key:generate
php artisan migrate --seed
php artisan storage:link
npm install
npm run build
php artisan serve
```

افتح [http://localhost:8000](http://localhost:8000)

## لوحة التحكم

- الرابط: [http://localhost:8000/admin/login](http://localhost:8000/admin/login)
- البريد: `admin@shagam.sa`
- كلمة المرور: `shagam-admin`

## إعدادات قاعدة البيانات

في `.env`:

```
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=shagam
DB_USERNAME=root
DB_PASSWORD=
```
