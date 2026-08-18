# شاغم — Next.js + Laravel API + MySQL

الموقع العام ولوحة التحكم = **Next.js**.  
قاعدة البيانات والتحكم = **Laravel API** على MySQL.

لا يوجد مصدر محتوى من ملفات JSON، ولا موقع عام من Blade.

```
المتصفح  →  Next.js (:3000)
                 │
                 └── fetch  →  Laravel API (:8000/api)  →  MySQL
```

## التشغيل المحلي

### 1) Laravel (الخلفية)

```sql
CREATE DATABASE shagam CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

من مجلد `laravel/`:

```bash
composer install
copy .env.example .env
php artisan key:generate
php artisan migrate --seed
php artisan storage:link
php artisan serve
```

API: [http://127.0.0.1:8000](http://127.0.0.1:8000)  
لوحة التحكم القديمة في Blade غير مستخدمة.

حساب المشرف بعد الـ seed:

- البريد: `admin@shagam.sa`
- كلمة المرور: `shagam-admin`

### 2) Next.js (الواجهة)

في جذر المشروع:

```bash
copy .env.example .env.local
npm install
npm run dev
```

الموقع: [http://localhost:3000](http://localhost:3000)  
الإدارة: [http://localhost:3000/admin](http://localhost:3000/admin)

`.env.local` يجب أن يحتوي:

```
LARAVEL_API_URL=http://127.0.0.1:8000/api
```

وفي `laravel/.env`:

```
FRONTEND_URL=http://localhost:3000
DB_CONNECTION=mysql
DB_DATABASE=shagam
```

## ماذا يفعل كل طرف؟

| الطرف | المسؤولية |
|---|---|
| Next.js | الصفحات، الخريطة، النماذج، لوحة التحكم |
| Laravel `/api/*` | المحتوى، الإعدادات، الطلبات، الكتالوج، تسجيل المشرف |
| MySQL | مصدر الحقيقة الوحيد |

## مسارات API

عامة:

- `GET /api/content`
- `GET /api/catalog`
- `POST /api/submissions`

مشرف (Bearer token بعد `POST /api/admin/login`):

- `GET /api/admin/session`
- `GET /api/admin/stats`
- `GET|PUT /api/admin/content`
- `GET|PUT /api/admin/settings`
- `GET|PATCH|DELETE /api/admin/submissions`
- `GET|PUT /api/admin/catalog`
- `GET /api/admin/uploads?file=`
