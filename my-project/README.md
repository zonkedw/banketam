# Банкетам.Нет

Запуск:

```bash
cd backend
npm install
npm run dev
```

```bash
cd frontend
npm install
npm run dev
```

Сайт: http://localhost:5828

БД PostgreSQL, имя `banketam`. Скрипт таблиц: `database/schema.sql`.  
Параметры подключения в `backend/.env`.

Админ: Admin26 / Demo20

Модуль 3: при старте backend применяется `database/migrate_module3.sql` (контакты, новые способы оплаты).  
Способы оплаты: QR, карта МИР, постоплата в офисе. Контакты: API `GET /api/settings`.
