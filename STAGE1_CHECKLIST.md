# ✅ Чек-лист Проверки Этапа 1

**Дата:** 12 ноября 2025  
**Цель:** Убедиться что Этап 1 полностью завершен перед Этапом 2

---

## 📋 Базовая Подготовка

- [ ] **Зависимости обновлены**
  ```bash
  npm list @prisma/client prisma
  # Ожидаемо: 6.19.0
  ```

- [ ] **Prisma Client сгенерирован**
  ```bash
  npm run prisma:generate
  # Должен завершиться без ошибок
  ```

- [ ] **GraphQL типы сгенерированы**
  ```bash
  npm run codegen
  # Файл src/graphql/resolvers-types.ts обновлен
  ```

- [ ] **Нет ошибок TypeScript**
  ```bash
  npm run lint
  # 0 ошибок (можно игнорировать warnings)
  ```

---

## 🗄️ База Данных

### Проверка Миграций
- [ ] **Статус миграций OK**
  ```bash
  npm run prisma:migrate:status
  # "Database schema is up to date"
  ```

- [ ] **13 миграций применены**
  - 2024-08-07: init
  - 2024-08-07: fixdevice
  - 2024-08-08: fix_balance (x2)
  - 2024-08-08: fix_address
  - 2024-08-09: fix_address
  - 2024-08-23: add_smid (x2)
  - 2024-09-17: add_device_date
  - 2024-09-17: fix_date_type (x3)
  - 2024-09-19: fix_date_type
  - 2025-11-11: add_services_payment_models ✅ ПОСЛЕДНЯЯ

### Проверка Моделей в БД
```bash
npm run prisma:studio
# http://localhost:5555

# Убедиться что есть таблицы:
✅ User
✅ Address
✅ Service
✅ Device
✅ MeterReading
✅ Tariff
✅ Billing
✅ Payment
```

### Проверка Данных
- [ ] **User:** Минимум 1 запись (для тестирования)
- [ ] **Address:** Минимум 1 запись
- [ ] **Service:** Минимум 3 записи (Вода, Газ, Электрика)
- [ ] **Device:** Наличие serviceId и meterNumber
- [ ] **Tariff:** serviceId обязательно заполнен
- [ ] **Billing:** deviceId, tariffId обязательно заполнены

---

## 🔌 GraphQL Schema & Resolvers

### Проверка schema.graphql
```bash
# Проверить наличие всех типов
grep "^type " src/graphql/schema.graphql | wc -l
# Должно быть минимум: User, Address, Service, Device, MeterReading, Tariff, Billing, Payment

# Проверить Query
grep -A 20 "^type Query" src/graphql/schema.graphql
# Должны быть: users, addresses, services, devices, readings, payments, billings

# Проверить Mutation
grep -A 20 "^type Mutation" src/graphql/schema.graphql
# Должны быть: create*/update*/delete* для всех сущностей
```

**Чек-лист GraphQL типов:**
- [ ] `type Service { id, name, unit, ... }`
- [ ] `type MeterReading { id, deviceId, readingDate, value, consumption, ... }`
- [ ] `type Payment { id, userId, amount, paymentDate, paymentMethod, ... }`
- [ ] Все типы расширены новыми полями

**Чек-лист Query:**
- [ ] `query Users(take, skip): { list, total }`
- [ ] `query Addresses(take, skip): { list, total }`
- [ ] `query Services: [Service]`
- [ ] `query Devices(take, skip): { list, total }`
- [ ] `query Readings(deviceId, take, skip): { list, total }`
- [ ] `query Payments(take, skip): { list, total }`
- [ ] `query Billings(take, skip, status): { list, total }`

**Чек-лист Mutations:**
- [ ] `mutation CreateService(name, unit): Service`
- [ ] `mutation UpdateService(id, name, unit): Service`
- [ ] `mutation DeleteService(id): Boolean`
- [ ] `mutation CreateReading(deviceId, value, readingDate): MeterReading`
- [ ] `mutation DeleteReading(id): Boolean`
- [ ] `mutation CreatePayment(...): Payment`
- [ ] `mutation DeletePayment(id): Boolean`

### Проверка Resolvers
```bash
# Перечислить всех resolvers
ls src/graphql/resolvers/query/
ls src/graphql/resolvers/mutation/

# Должны быть файлы/функции для всех операций
```

**Обязательные resolver файлы:**
- [ ] `src/graphql/resolvers/query/index.ts` - main query handler
- [ ] `src/graphql/resolvers/mutation/index.ts` - main mutation handler
- [ ] `src/graphql/resolvers/query/service.ts` или в index.ts
- [ ] `src/graphql/resolvers/mutation/service.ts` или в index.ts
- [ ] Для MeterReading, Payment - аналогично

### Проверка resolvers-types.ts
```bash
# Файл должен существовать и быть актуальным
ls -la src/graphql/resolvers-types.ts

# Содержать типы для всех Resolvers
grep "type Resolvers\|type QueryResolvers\|type MutationResolvers" src/graphql/resolvers-types.ts
```

---

## 🖥️ UI Pages (Frontend)

### Структура Страниц
```bash
# Каждая страница должна иметь:
# 1. page.tsx - главный компонент
# 2. query.ts - GraphQL запросы
# 3. action.ts - Server Actions
# 4. {Entity}Table.tsx - таблица
# 5. {Entity}Modal.tsx - модал для CRUD

# Проверить каждую:
ls -la src/app/pages/user/
ls -la src/app/pages/address/
ls -la src/app/pages/device/
ls -la src/app/pages/billing/
ls -la src/app/pages/meter-reading/
ls -la src/app/pages/payment/
ls -la src/app/pages/service/
```

**Требуемые файлы для каждой страницы:**
- [ ] User: ✅ page.tsx, query.ts, action.ts, UserTable.tsx, UserModal.tsx
- [ ] Address: ✅ page.tsx, query.ts, action.ts, AddressTable.tsx, AddressModal.tsx
- [ ] Device: ✅ page.tsx, query.ts, action.ts, DeviceTable.tsx, DeviceModal.tsx
- [ ] Billing: ✅ page.tsx, query.ts, action.ts, BillingTable.tsx, BillingModal.tsx
- [ ] MeterReading: ⚠️ page.tsx, query.ts, action.ts, MeterReadingTable.tsx, MeterReadingModal.tsx
- [ ] Payment: ⚠️ page.tsx, query.ts, action.ts, PaymentTable.tsx, PaymentModal.tsx
- [ ] Service: ⚠️ page.tsx, query.ts, action.ts, ServiceTable.tsx, ServiceModal.tsx

### Проверка Query.ts в каждой странице
```typescript
// Пример query.ts должен содержать:

// 1. GET_ITEMS - получить список
export const GET_ITEMS = gql`
  query GetItems($take: Int, $skip: Int) {
    items(take: $take, skip: $skip) {
      list { ... }
      total
    }
  }
`;

// 2. CREATE_ITEM - создать
export const CREATE_ITEM = gql`
  mutation CreateItem($input: CreateItemInput!) {
    createItem(input: $input) { ... }
  }
`;

// 3. UPDATE_ITEM - обновить
export const UPDATE_ITEM = gql`
  mutation UpdateItem($id: Int!, $input: UpdateItemInput!) {
    updateItem(id: $id, input: $input) { ... }
  }
`;

// 4. DELETE_ITEM - удалить
export const DELETE_ITEM = gql`
  mutation DeleteItem($id: Int!) {
    deleteItem(id: $id)
  }
`;
```

- [ ] Все query.ts файлы содержат GET_*, CREATE_*, UPDATE_*, DELETE_*
- [ ] Переменные используют правильные типы (Int, String, Input типы)

### Проверка Action.ts в каждой странице
```typescript
// Пример action.ts должен содержать:

"use server";

export async function onCreate(data) {
  const client = getClient();
  const result = await client.mutate({
    mutation: CREATE_ITEM,
    variables: { input: data }
  });
  return result.data.createItem;
}

export async function onUpdate(id, data) { ... }
export async function onDelete(id) { ... }
```

- [ ] action.ts содержит `"use server"` директиву
- [ ] Функции используют Apollo client via `getClient()`
- [ ] Обработка ошибок (try-catch или error handling)

### Проверка Modal & Table компонентов
- [ ] `{Entity}Table.tsx` - рендерит таблицу с данными
- [ ] `{Entity}Modal.tsx` - рендерит форму для создания/редактирования
- [ ] Используется `useLocalState` для состояния
- [ ] Вызывают server actions через `onClick` или `onSubmit`

---

## 🧩 Компоненты

### Проверка useLocalState Hook
```bash
# Должен существовать и работать
grep -r "useLocalState" src/utils/

# Используется во всех модалах и таблицах
grep -r "useLocalState" src/app/pages/
```

- [ ] `src/utils/useLocalState.ts` существует
- [ ] Используется в Table компонентах (для открытия/закрытия модалов)
- [ ] Поддерживает partial state updates

### Проверка Apollo Client
```bash
# Должен быть сконфигурирован
grep -A 10 "export.*getClient" src/lib/apolloClient.tsx

# Используется в action.ts файлах
grep -r "getClient()" src/app/pages/
```

- [ ] `src/lib/apolloClient.tsx` экспортирует `getClient()`
- [ ] Apollo Wrapper обернут в layout.tsx
- [ ] Используется в server actions

---

## 🧪 Тестирование

### Запуск Dev Сервера
```bash
npm run dev
# Должен запуститься на http://localhost:3000
# Без ошибок в терминале
```

- [ ] Сервер запускается без ошибок
- [ ] http://localhost:3000 доступен
- [ ] Все страницы доступны в Navigation

### Проверка GraphQL Endpoint
```bash
# Откройте http://localhost:3000/graphql
# Должна открыться GraphQL Playground или Apollo Studio
```

- [ ] GraphQL UI открывается
- [ ] Можно выполнить простой query:
  ```graphql
  query {
    users(take: 10, skip: 0) {
      list { id name }
      total
    }
  }
  ```

### Проверка Каждой Страницы
- [ ] User page - загружает список абонентов
- [ ] Address page - загружает адреса
- [ ] Device page - загружает приборы
- [ ] Service page - загружает услуги
- [ ] Billing page - загружает счета
- [ ] MeterReading page - загружает показания
- [ ] Payment page - загружает платежи

### Проверка CRUD операций
- [ ] **Create** - можно создать новую запись (любая сущность)
- [ ] **Read** - таблица показывает данные
- [ ] **Update** - можно отредактировать запись
- [ ] **Delete** - можно удалить запись

---

## 🔐 Безопасность & Производительность

- [ ] **Input Validation** - есть ли валидация в resolvers?
  ```bash
  grep -r "validate\|Yup\|zod" src/graphql/resolvers/
  ```

- [ ] **CSRF Protection** - Next.js автоматически, но проверить
- [ ] **Rate Limiting** - не реализовано (для production нужно)
- [ ] **Authentication** - не реализовано (для production нужно)

---

## 📊 Статус по Результатам

### Если ✅ > 90% чек-листа пройдено:
→ **Этап 1 Завершен** ✅  
→ Можно начинать Этап 2 (User Management)

### Если ⚠️ 70-90% чек-листа пройдено:
→ **Этап 1 Почти Завершен** ⚠️  
→ Нужны доработки перед Этапом 2  
→ Список проблем в следующем разделе

### Если ❌ < 70% чек-листа пройдено:
→ **Этап 1 Не Завершен** ❌  
→ Нужна серьезная переработка  
→ Требуется встреча для обсуждения

---

## 🐛 Решение Проблем

### Проблема: "Resolvers типы не совпадают"
```bash
# Решение:
npm run codegen
npm run lint --fix
```

### Проблема: "Cannot find module 'X' in resolvers"
```bash
# Решение:
npm run prisma:generate
npm install
```

### Проблема: "GraphQL query не работает"
```bash
# Решение:
1. Проверить schema.graphql содержит query
2. Проверить resolver функция существует
3. Проверить что resolver экспортирован из index.ts
4. Запустить npm run codegen
```

### Проблема: "Database schema is out of date"
```bash
# Решение:
npm run prisma:migrate:status
npm run prisma:migrate:dev

# Если страшно (может быть потеря данных):
# npm run prisma:migrate:deploy  # Production mode
```

---

## 📞 Контакты для Помощи

Если возникают проблемы при проверке:
1. Запустить `npm run lint` чтобы увидеть все ошибки
2. Запустить `npm run dev` чтобы увидеть runtime ошибки
3. Проверить `node_modules/` существует (если нет, запустить `npm install`)
4. Очистить cache: `rm -r .next node_modules` и `npm install`

---

**Успешное завершение чек-листа = готовность к Этапу 2! 🚀**
