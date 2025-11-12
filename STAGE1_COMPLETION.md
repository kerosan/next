# ✅ ЭТАП 1: Завершение - Пошаговые Инструкции

## 📊 Что было сделано

### 1. ✅ Обновлена `prisma/schema.prisma`
Добавлены новые модели и связи:
- **Service** - типы услуг (вода, газ, электрика)
- **MeterReading** - история показаний счетчиков
- **Payment** - учет платежей
- Расширены: **Device**, **Tariff**, **Billing**, **User**, **Address**

### 2. ✅ Обновлена `src/graphql/schema.graphql`
Добавлены новые GraphQL типы и операции:
- Types: `Service`, `MeterReading`, `Payment`
- Queries: `services`, `readings`, `payments`
- Mutations: `createService`, `updateService`, `deleteService`, `createReading`, `deleteReading`, `createPayment`, `deletePayment`

### 3. ✅ Обновлены `src/graphql/resolvers/`
Добавлены Query и Mutation резолверы для новых сущностей:
- Service CRUD
- MeterReading CRUD (с автоматическим расчетом потребления)
- Payment CRUD (с автоматическим маркированием рахунков)

---

## 🚀 Что нужно сделать теперь

### Шаг 1: Запустить Prisma миграцию

```powershell
# Windows PowerShell
npm run prisma:migrate:dev

# Или запустить подготовленный скрипт
.\setup-stage1.ps1
```

**Что происходит:**
- Создается новая миграция на основе изменений `schema.prisma`
- Обновляется SQLite база данных
- Генерируется Prisma Client

### Шаг 2: Запустить GraphQL кодогенерацию

```powershell
npm run codegen
```

**Что происходит:**
- Регенерируется `src/graphql/resolvers-types.ts`
- Типы автоматически синхронизируются с GraphQL схемой
- Исчезнут ошибки TypeScript в resolvers

### Шаг 3: Проверить отсутствие ошибок

После завершения обоих команд проверьте:
```powershell
npm run lint
```

Должны исчезнуть ошибки типов в resolvers.

### Шаг 4: (Опционально) Просмотр базы данных

```powershell
npm run prisma:studio
```

Откроется веб-интерфейс Prisma Studio на http://localhost:5555 где вы сможете просмотреть и редактировать данные.

---

## 📝 Заметки о Изменениях Схемы

### Device (был переименован/расширен)
**Старые поля:**
- `name` - Удалено
- `deviceId` - Удалено из User

**Новые поля:**
- `serviceId` - Ссылка на Service (обязательно)
- `meterNumber` - Номер счетчика (уникальный)
- `userId` - Связь с абонентом (опционально)
- `readings` - Массив показаний

### Billing (значительно расширен)
**Старые поля:**
- `payment` - Удалено (переименовано в Payment сущность)
- `date` - Удалено

**Новые поля:**
- `deviceId` - Ссылка на счетчик (обязательно)
- `tariffId` - Ссылка на тариф (обязательно)
- `billingPeriod` - Период (YYYY-MM)
- `previousReading` / `currentReading` - Показания
- `consumption` - Рассчитанное потребление
- `amount` - Сумма к оплате
- `dueDate` - Срок оплаты
- `isPaid` - Статус оплаты

### Tariff (расширен)
**Новые поля:**
- `serviceId` - Ссылка на услугу (обязательно)
- `name` - Название тарифа

### User (улучшен)
- `deviceId` удалено (теперь один абонент может иметь много счетчиков через Device.userId)
- Добавлены отношения `devices`, `billings`, `payments`

### Address (расширен)
**Новые поля:**
- `city` - Город
- `zipCode` - Почтовый индекс

---

## 🔍 Структура Новых Связей

```
User (Абонент)
├── Address (Адреса) 1:1
├── Device[] (Счетчики) 1:M
│   ├── Service (Услуга: вода, газ, тощо) M:1
│   └── MeterReading[] (Показання) 1:M
├── Billing[] (Рахунки) 1:M
│   ├── Device (Счетчик) M:1
│   ├── Tariff (Тариф) M:1
│   └── Payment[] (Платежи) 1:M
└── Payment[] (Прямие платежі) 1:M

Service (Услуга)
├── Device[] (Счетчики)
└── Tariff[] (Тарифы)

Tariff (Тариф)
└── Billing[] (Рахунки)
```

---

## 💡 Примеры GraphQL Запросов (для тестирования)

### Создание Услуги
```graphql
mutation {
  createService(service: { name: "Вода", unit: "м³" }) {
    id
    name
    unit
  }
}
```

### Создание Счетчика
```graphql
mutation {
  createDevice(device: {
    serviceId: 1,
    meterNumber: "WM-12345",
    initialValue: 0,
    startDate: "2024-11-01",
    userId: 1
  }) {
    id
    meterNumber
    service { name }
  }
}
```

### Добавление Показания
```graphql
mutation {
  createReading(reading: {
    deviceId: 1,
    readingDate: "2024-11-11",
    value: 125.5,
    notes: "Квартира 5"
  }) {
    id
    value
    consumption
  }
}
```

### Создание Рахунка
```graphql
mutation {
  createBilling(billing: {
    userId: 1,
    deviceId: 1,
    tariffId: 1,
    billingPeriod: "2024-11",
    previousReading: 100.0,
    currentReading: 125.5,
    dueDate: "2024-12-10"
  }) {
    id
    consumption
    amount
  }
}
```

### Создание Платежа
```graphql
mutation {
  createPayment(payment: {
    userId: 1,
    billingId: 1,
    amount: 125.50,
    paymentMethod: "готівка",
    paymentDate: "2024-11-11",
    reference: "CHECK-001"
  }) {
    id
    amount
    paymentDate
  }
}
```

---

## ⚠️ Если Возникли Проблемы

### Ошибка миграции
Если миграция не проходит, попробуйте сбросить базу:
```powershell
npm run prisma:migrate:reset
```

⚠️ **ВНИМАНИЕ:** Это удалит все данные в базе! Используйте только на разработке.

### Ошибки TypeScript после codegen
Убедитесь, что:
1. Запустили `npm run prisma:migrate:dev` (завершилось успешно)
2. Запустили `npm run codegen`
3. Перезагрузили VS Code или очистили .next кэш

```powershell
rm -r .next
npm run dev
```

### Ошибки в resolvers
Если видите ошибки типов в mutation resolvers - это нормально до запуска `npm run codegen`. После генерации типов они исчезнут.

---

## ✅ Проверка Завершения

После выполнения всех шагов проверьте:

- [ ] `npm run lint` - нет ошибок
- [ ] `npm run build` - успешная сборка
- [ ] `npm run dev` - сервер запускается без ошибок
- [ ] GraphQL Playground доступен на http://localhost:3000/graphql
- [ ] Можно создать Service через GraphQL
- [ ] Prisma Studio работает (http://localhost:5555)

---

## 📋 Что дальше?

После завершения Этапа 1:

**ЭТАП 2** (следующий): Управление Абонентами
- Обновление UI для User Management
- Обновление страницы Address Management
- Создание новой страницы Service Management

Готовы переходить на Этап 2? 🚀

