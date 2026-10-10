# DentoGrand — сайт стоматологической клиники

ASP.NET Core Web API (.NET 8) + React (Vite) + PostgreSQL.

```
DentoGrand/
├─ backend/DentoGrand.Api/   Web API, EF Core, JWT-авторизация, раздача собранного React из wwwroot
├─ frontend/                 React-приложение (react-router)
└─ docker-compose.yml        PostgreSQL для разработки
```

## Требования
.NET SDK 8+, Node.js 18+, PostgreSQL 14+ (или Docker).

## Запуск

1. **База данных**
   ```bash
   docker compose up -d
   ```
   Либо используйте свой PostgreSQL и поправьте `ConnectionStrings:Default` в
   `backend/DentoGrand.Api/appsettings.json`.

2. **Backend** (http://localhost:5000)
   ```bash
   cd backend/DentoGrand.Api
   dotnet run
   ```
   При первом запуске создаются БД, таблицы `appointments`, `promotions`, `admin_users`,
   учётная запись администратора и три примера акций.

3. **Frontend**
   - Режим разработки (http://localhost:5173, API проксируется на :5000):
     ```bash
     cd frontend
     npm install
     npm run dev
     ```
   - Продакшен-сборка: `npm run build` кладёт сайт в `backend/DentoGrand.Api/wwwroot`,
     и всё работает на одном адресе http://localhost:5000 (в архив уже включена готовая сборка).

## Администрирование
Страница **/admin**. По умолчанию: логин `admin`, пароль `Admin12345!`
(задаётся в `appsettings.json`, секция `Admin`, и применяется только при первом создании БД).
**Перед публикацией смените пароль и `Jwt:Key`** (лучше через переменные окружения
`Admin__Password`, `Jwt__Key`, `ConnectionStrings__Default`).

После входа в меню появляются оранжевые пункты:
- **Записи** (`/records`) — заявки пациентов, отметка «Зарегистрирована», удаление;
- **Акции (ввод)** (`/actions_edit`) — создание, правка, удаление акций и загрузка фото.

## Таблица записей (`appointments`)
| Поле | Тип | Описание |
|---|---|---|
| Id | serial, PK | идентификатор записи |
| Name | varchar(100) | имя (обязательно) |
| Phone | varchar(30) | телефон (обязательно) |
| Comment | varchar(1000) | комментарии (необязательно) |
| CreatedAt | timestamptz | дата и время создания |
| IsRegistered | boolean | признак регистрации записи |

## API
| Метод | URL | Доступ |
|---|---|---|
| POST | /api/auth/login | все |
| POST | /api/appointments | все |
| GET | /api/appointments | админ |
| PATCH | /api/appointments/{id}/registered | админ |
| DELETE | /api/appointments/{id} | админ |
| GET | /api/promotions | все — только актуальные (сегодня между «с» и «по» включительно) |
| GET | /api/promotions/all | админ |
| POST / PUT / DELETE | /api/promotions[/{id}] | админ |
| POST | /api/promotions/image | админ, загрузка фото (до 5 МБ) в `backend/DentoGrand.Api/uploads` |

## Что заменить на реальное
- Тексты, врачи, услуги, адрес, телефон, часы работы и координаты карты Яндекса — `frontend/src/data/content.js`.
- Фото — файлы `frontend/public/img/*.svg` (сейчас заглушки). У врачей `doctorN-1` — основное фото,
  `doctorN-2` — показывается при наведении; фото должны быть одного размера (формат 4:5).
- Логотип — `frontend/public/img/logo.svg`.

## Примечания
- Схема БД создаётся через `EnsureCreated`. Для дальнейших изменений схемы перейдите на миграции EF Core
  (`dotnet ef migrations add Initial`).
- Если нужен другой .NET, поменяйте `TargetFramework` и версии пакетов в `.csproj`.
