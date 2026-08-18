# كتالوج الشركات المصنّعة

المصدر: `data/drone-manufacturers.xlsx`

الكتالوج يُحفظ في **MySQL** عبر Laravel API. الاستيراد من لوحة التحكم:

`/admin/catalog` → رفع Excel (إضافة أو استبدال كامل).

من سطر الأوامر (يحدّث ملف الـ seeder فقط، مو الواجهة):

```bash
npm run import:drones
```
