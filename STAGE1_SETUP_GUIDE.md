# ⚠️ ЭТАП 1: НУЖНА ДОДЕЛКА - Инструкции для Завершения

## 📊 Текущий Статус

✅ **Завершено:**
1. ✅ Обновлена `prisma/schema.prisma` со всеми новыми моделями и связями
2. ✅ Обновлена `src/graphql/schema.graphql` со всеми новыми типами
3. ✅ Обновлены `src/graphql/resolvers/` со всеми Query и Mutation резолверами
4. ✅ Создана миграция SQL: `prisma/migrations/20251111120000_add_services_payment_models/migration.sql`

⏳ **В ПРОЦЕССЕ:**
- Нужно применить миграцию и регенерировать Prisma Client

---

## 🔧 Что Осталось Сделать

### Проблема
При запуске `npm run codegen` возникает ошибка:
```
Cannot find module '.../node_modules/@prisma/client/runtime/query_engine_bg.sqlite.wasm-base64.js'
```

Это означает, что Prisma Client не был правильно сгенерирован или установлен.

### Решение

**Шаг 1:** Очистить npm кэш и переустановить зависимости
```powershell
# Удалить node_modules и package-lock.json
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json

# Переустановить все
npm install
```

**Шаг 2:** Применить миграцию
```powershell
# Вариант A (рекомендуется для разработки):
npm run prisma:migrate:reset

# Или Вариант B (если хотите сохранить старые данные):
npm run prisma:migrate:dev
```

**Шаг 3:** Регенерировать Prisma Client
```powershell
npm run prisma:generate
```

**Шаг 4:** Регенерировать GraphQL типы
```powershell
npm run codegen
```

**Шаг 5:** Проверить отсутствие ошибок
```powershell
npm run lint
```

---

## 📋 Файлы Которые Были Обновлены

### 1. `prisma/schema.prisma`
- ✅ Добавлены новые модели: `Service`, `MeterReading`, `Payment`
- ✅ Расширены: `Device` (добавлены serviceId, meterNumber), `Tariff` (добавлены serviceId, name), `Billing` (расширены все поля), `User` (добавлены relations), `Address` (добавлены city, zipCode)
- ✅ Все новые поля сделаны опциональными (?) для совместимости с существующими данными

### 2. `src/graphql/schema.graphql`
- ✅ Добавлены новые типы:
  - `Service` с `ServicePageResult`
  - `MeterReading` с `MeterReadingPageResult`
  - `Payment` с `PaymentPageResult`
- ✅ Расширены существующие типы и input'ы
- ✅ Добавлены новые Query операции: `services`, `readings`, `payments`
- ✅ Добавлены новые Mutation операции для CRUD всех новых сущностей

### 3. `src/graphql/resolvers/query/index.ts`
- ✅ Добавлены Query резолверы:
  - `services` - пагинированный список услуг
  - `readings` - пагинированный список показаний по счетчику
  - `payments` - пагинированный список платежей

### 4. `src/graphql/resolvers/mutation/index.ts`
- ✅ Добавлены Mutation резолверы:
  - `createBilling`, `updateBilling`, `deleteBilling` (расширенные)
  - `createTariff`, `updateTariff`, `deleteTariff` (обновленные)
  - `createService`, `updateService`, `deleteService` (новые)
  - `createReading` (с автоматическим расчетом consumption), `deleteReading` (новые)
  - `createPayment` (с автоматическим маркированием billing), `deletePayment` (новые)

### 5. `prisma/migrations/20251111120000_add_services_payment_models/migration.sql`
- ✅ Создана SQL миграция которая:
  - Создает таблицы `Service`, `MeterReading`, `Payment`
  - Расширяет таблицы `Device`, `Address`, `Tariff`, `Billing` с новыми полями
  - Добавляет foreign key связи
  - Создает индексы для производительности

---

## 🚀 Последовательность Команд (Скопируйте и Запустите)

```powershell
# 1. Перейти в папку проекта
cd C:\Users\MArtemov\projects\next

# 2. Очистить и переустановить зависимости
Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
Remove-Item package-lock.json -ErrorAction SilentlyContinue
npm install

# 3. Применить миграцию (выберите один из вариантов):
# Вариант A - RESET (удаляет все данные, рекомендуется):
npm run prisma:migrate:reset

# Вариант B - DEV (сохраняет старые данные):
# npm run prisma:migrate:dev

# 4. Регенерировать Prisma Client
npm run prisma:generate

# 5. Регенерировать GraphQL типы
npm run codegen

# 6. Проверить ошибки
npm run lint

# 7. Запустить dev сервер
npm run dev
```

---

## 💾 Выбор Between Вариантов Миграции

### Вариант A: `npm run prisma:migrate:reset` ⭐ РЕКОМЕНДУЕТСЯ
**Использовать если:** вы на разработке и хотите чистую БД
- Удаляет ВСЕ существующие данные
- Создает новую БД с новой схемой
- Быстро и безопасно
- ✅ Рекомендуется для этапа 1

### Вариант B: `npm run prisma:migrate:dev`
**Использовать если:** хотите сохранить существующие данные
- Пытается применить миграцию сохраняя данные
- Требует интерактивного подтверждения
- Может потребоваться ручной SQL для сохранения данных

---

## ✅ Как Узнать Что Все Работает

После успешного выполнения всех команд:

1. **Нет ошибок при `npm run lint`**
2. **Нет красных линий в VS Code в файлах resolvers**
3. **Сервер запускается без ошибок:**
   ```powershell
   npm run dev
   ```
4. **GraphQL Playground доступен:**
   - http://localhost:3000/graphql
5. **Prisma Studio работает:**
   ```powershell
   npm run prisma:studio
   # Откроется на http://localhost:5555
   ```

---

## 🧪 Тестирование После Завершения

### Тест 1: Проверить БД структуру
```powershell
npm run prisma:studio
# Проверить что все таблицы есть: User, Address, Service, Device, MeterReading, Tariff, Billing, Payment
```

### Тест 2: Создать Тестовую Услугу через GraphQL
Откройте http://localhost:3000/graphql и запустите:

```graphql
mutation {
  createService(service: { name: "Вода", unit: "м³" }) {
    id
    name
    unit
  }
}
```

Ожидаемый результат:
```json
{
  "data": {
    "createService": {
      "id": 1,
      "name": "Вода",
      "unit": "м³"
    }
  }
}
```

### Тест 3: Получить Список Услуг
```graphql
query {
  services(take: 10, skip: 0) {
    list {
      id
      name
      unit
    }
    total
  }
}
```

---

## ⚠️ Если Что-то Пошло Не Так

### Ошибка: "Cannot find module '@prisma/client'"
**Решение:**
```powershell
npm install
npm run prisma:generate
```

### Ошибка: "PRAGMA foreign_keys=ON failed"
**Решение:** Используйте `npm run prisma:migrate:reset`

### Ошибка: "Type mismatch" в resolvers
**Решение:** Убедитесь что запустили `npm run codegen`

### Ошибка: "Column does not exist"
**Решение:** Убедитесь что миграция была применена (`npm run prisma:migrate:reset` или `npm run prisma:migrate:dev`)

---

## 📚 Дополнительная Информация

### Структура Нових Моделей

```
Service (Услуга)
├── id: Int
├── name: String (уникальное)
└── unit: String (м³, кВт•ч)

MeterReading (Показание)
├── id: Int
├── deviceId: Int (FK → Device)
├── readingDate: String
├── value: Float
├── consumption: Float (вычисляется)
└── createdAt: DateTime

Payment (Платёж)
├── id: Int
├── userId: Int (FK → User)
├── billingId: Int? (FK → Billing)
├── amount: Float
├── paymentMethod: String
├── paymentDate: String
└── createdAt: DateTime

Device (расширен)
├── serviceId: Int? (FK → Service)
├── meterNumber: String? (уникальное)

Tariff (расширен)
├── serviceId: Int? (FK → Service)
├── name: String?

Billing (расширен)
├── deviceId: Int? (FK → Device)
├── tariffId: Int? (FK → Tariff)
├── billingPeriod: String?
├── previousReading: Float?
├── currentReading: Float?
├── consumption: Float?
├── amount: Float?
├── dueDate: String?
└── isPaid: Boolean
```

---

## 🎯 Что Дальше

После успешного завершения Этапа 1:

**ЭТАП 2** - Управление Абонентами:
- Обновить UI для User Management
- Обновить Address Management
- Создать Service Management страницу

---

## 📞 Troubleshooting Чек-лист

- [ ] Запустил `npm install`
- [ ] Запустил `npm run prisma:migrate:reset` (или `prisma:migrate:dev`)
- [ ] Запустил `npm run prisma:generate`
- [ ] Запустил `npm run codegen`
- [ ] Запустил `npm run lint` - нет ошибок
- [ ] Запустил `npm run dev` - сервер работает
- [ ] Открыл http://localhost:3000/graphql - работает
- [ ] Создал тестовую Service - работает

Если все ✅ - **Этап 1 завершен успешно!** 🎉

