# План реалізації системи контролю та обліку абонентів комунальних послуг

## 📋 Огляд Системи

Система для управління абонентами комунальних послуг (вода, газ, електрика) з можливістю:
- Реєстрації нових абонентів та їх адрес
- Ведення обліку лічильників з поточними показаннями
- Розрахунку платежів на основі тарифів та споживання
- Формування квитанцій для оплати (біліинг)
- Отримання платежів та ведення розрахунків

---

## 🏗️ Архітектура Системи

### Існуючі Компоненти Проекту
- **Frontend**: Next.js 14 (App Router) з React Server Components
- **API**: GraphQL (graphql-yoga) + Apollo Client
- **Database**: SQLite з Prisma ORM
- **UI**: Ant Design + Tailwind CSS
- **Bot**: Telegram (grammy) для інтеграції

### Модульна Структура
```
Абонент (User)
  ├── Адреса (Address) 
  ├── Лічильники (Device) з категоріями послуг
  │   ├── Показання лічильника (MeterReading)
  │   ├── Тариф (Tariff)
  │   └── Розрахунки (Bill)
  └── Платежі (Payment)
```

---

## 📊 Модель Даних

### 1. **User (Абонент)**
```prisma
model User {
  id            Int      @id @default(autoincrement())
  name          String   // Ім'я абонента
  phone         String?
  email         String?  @unique
  addressId     Int?
  address       Address?
  devices       Device[]
  billings      Billing[]
  payments      Payment[]
  smId          String?  // Telegram ID для інтеграції
}
```

### 2. **Address (Адреса)**
```prisma
model Address {
  id        Int      @id @default(autoincrement())
  address   String   // Вулиця, будинок, квартира
  city      String?  // Місто
  zipCode   String?  // Поштовий індекс
  users     User[]
}
```

### 3. **Service (Служба/Послуга)** - НОВЕ
```prisma
model Service {
  id          Int      @id @default(autoincrement())
  name        String   // "Вода", "Газ", "Електрика"
  unit        String   // м³, куб.м, кВт•ч
  tariffs     Tariff[]
  meters      Device[]  // Лічильники цієї послуги
}
```

### 4. **Device (Лічильник)**
Переіменувати/розширити існуючий `Device`:
```prisma
model Device {
  id              Int      @id @default(autoincrement())
  userId          Int?
  user            User?
  serviceId       Int      // Звʼязок з послугою (вода, газ, тощо)
  service         Service
  meterNumber     String   // Номер лічильника (унікальний)
  initialValue    Float    // Початкові показання
  startDate       String   // Дата встановлення
  endDate         String?  // Дата зняття (якщо применшено)
  readings        MeterReading[]
  billings        Billing[]
}
```

### 5. **MeterReading (Показання лічильника)** - НОВЕ
```prisma
model MeterReading {
  id              Int      @id @default(autoincrement())
  deviceId        Int
  device          Device
  readingDate     String   // Дата зняття показань
  value           Float    // Поточні показання
  consumption     Float?   // Розраховане споживання (value - попереднє)
  notes           String?  // Примітки
  createdAt       String   @default(now())
}
```

### 6. **Tariff (Тариф)** - Розширити
```prisma
model Tariff {
  id              Int      @id @default(autoincrement())
  serviceId       Int
  service         Service
  name            String   // "Тариф для ФОП", "Побутовий тариф"
  price           Float    // Ціна за одиницю (за м³, за кВт•ч)
  startDate       String   // Дата дійсності тарифу
  endDate         String?
  billings        Billing[]
}
```

### 7. **Billing (Рахунок/Квитанція)** - Розширити
```prisma
model Billing {
  id              Int      @id @default(autoincrement())
  userId          Int
  user            User
  deviceId        Int
  device          Device
  tariffId        Int
  tariff          Tariff
  
  billingPeriod   String   // "2024-11", місяць звіту
  previousReading Float    // Попереднього показання
  currentReading  Float    // Поточне показання
  consumption     Float    // Розраховане споживання
  amount          Float    // Сума до сплати (consumption * price)
  dueDate         String   // Крайній термін оплати
  isPaid          Boolean  @default(false)
  
  payments        Payment[]
  createdAt       String   @default(now())
}
```

### 8. **Payment (Платіж)** - НОВЕ
```prisma
model Payment {
  id              Int      @id @default(autoincrement())
  userId          Int
  user            User
  billingId       Int?
  billing         Billing?
  
  amount          Float    // Сума платежу
  paymentMethod   String   // "готівка", "переказ", "карта"
  paymentDate     String   // Дата платежу
  reference       String?  // Номер переказу/чека
  notes           String?
  
  createdAt       String   @default(now())
}
```

---

## 🛠️ План Реалізації (Поступовий)

### **ЕТАП 1: Базова структура (цей тиждень)**

#### 1.1 Оновлення моделі даних
- [ ] Додати `Service` модель до `schema.prisma`
- [ ] Розширити `Device` з `serviceId`, `meterNumber`
- [ ] Додати `MeterReading` модель для історії показань
- [ ] Розширити `Tariff` з `serviceId`, `name`
- [ ] Розширити `Billing` з повними полями (previousReading, consumption, amount, dueDate, isPaid)
- [ ] Додати `Payment` модель

```bash
npm run prisma:migrate:dev --name add_services_and_extend_models
npm run prisma:generate
```

#### 1.2 GraphQL Schema оновлення
- [ ] Додати типи в `src/graphql/schema.graphql`:
  - `Service`, `MeterReading`, `Payment`
  - Розширити `Device`, `Tariff`, `Billing`

#### 1.3 GraphQL Resolvers
- [ ] `src/graphql/resolvers/query/`: Query для списків (services, readings, payments)
- [ ] `src/graphql/resolvers/mutation/`: Mutation для CRUD операцій

```bash
npm run codegen
```

---

### **ЕТАП 2: Управління Абонентами (тиждень 2)**

#### 2.1 Сторінка Абонентів (User Management)
Вже частково існує, потребує розширення:
- [ ] Оновити `src/app/pages/user/query.ts` для нових полів
- [ ] Оновити `UserModal.tsx` з автозаповненням адреси/лічильника
- [ ] Оновити `UserTable.tsx` з графічним інтерфейсом

#### 2.2 Сторінка Адрес (Address Management)
Вже існує `src/app/pages/address/`, додати:
- [ ] Поля: city, zipCode
- [ ] Валідація унікальності адреси
- [ ] Пошук по адресі

#### 2.3 Сторінка Послуг (Services) - НОВЕ
```
src/app/pages/service/
├── page.tsx
├── query.ts (GET_SERVICES, CREATE_SERVICE, UPDATE_SERVICE, DELETE_SERVICE)
├── action.ts (server actions)
├── ServiceTable.tsx
└── ServiceModal.tsx
```

---

### **ЕТАП 3: Управління Лічильниками (тиждень 3)**

#### 3.1 Оновлення Device Management
- [ ] Переіменувати на "Лічильники" в UI
- [ ] Додати вибір Service при створенні
- [ ] Додати meterNumber як унікальне поле
- [ ] Оновити форму пристрою з новими полями

#### 3.2 Нова сторінка - Показання Лічильників (Meter Readings) - НОВЕ
```
src/app/pages/meter-reading/
├── page.tsx (Таблиця всіх показань з фільтрацією по лічильнику)
├── query.ts (GET_READINGS, CREATE_READING)
├── action.ts
├── MeterReadingTable.tsx
└── MeterReadingModal.tsx
```

Функціоналу:
- Вибір лічильника
- Введення нового показання
- Автоматичний розрахунок споживання
- Історія показань для обраного лічильника

---

### **ЕТАП 4: Біліинг (тиждень 4)**

#### 4.1 Розширення Billing Management
Вже існує `src/app/pages/billing/`, додати:
- [ ] Оновити модель: previousReading, currentReading, consumption, amount, dueDate, isPaid
- [ ] Автоматичне формування рахунків при введенні показання
- [ ] Калькулятор: (currentReading - previousReading) * tariff.price

#### 4.2 Функціоналу:
- Список рахунків з фільтром: "Неоплачені", "Оплачені", "Прострочені"
- Статус сплати (красивої кольори: ⚠️ Прострочено, ⏳ Очікується, ✅ Сплачено)
- Генерація PDF квитанції
- Масова операція: позначити кілька як сплачені

---

### **ЕТАП 5: Платежі (тиждень 5)**

#### 5.1 Нова сторінка - Платежі - НОВЕ
```
src/app/pages/payment/
├── page.tsx
├── query.ts (GET_PAYMENTS, CREATE_PAYMENT, DELETE_PAYMENT)
├── action.ts
├── PaymentTable.tsx
└── PaymentModal.tsx
```

Функціоналу:
- Список платежів по абонентам
- Прив'язка платежу до рахунку (опціонально)
- Способи оплати: готівка, переказ, карта
- Пошук по номеру чека/переказу
- Статистика: "Загалом сплачено цього місяця", тощо

#### 5.2 Оновлення Billing на основі платежів
- [ ] При створенні платежу: автоматично позначити Billing як isPaid (якщо сума співпадає)
- [ ] Розпізнавання часткових платежів (partial payments)

---

### **ЕТАП 6: Звіти та Аналітика (тиждень 6)**

#### 6.1 Нова сторінка - Звіти - НОВЕ
```
src/app/pages/reports/
├── page.tsx
└── components/
    ├── ConsumptionReport.tsx (Мова спожитого по послугам)
    ├── DebtReport.tsx (Боржники)
    └── RevenueReport.tsx (Доходи по місяцях)
```

Звіти:
1. **Споживання**: Графік/таблиця з консумацією по послугам/місяцям
2. **Боржники**: Список абонентів з невиплаченими рахунками
3. **Доходи**: Сумарні доходи, статистика платежів

#### 6.2 Dashboard - НОВЕ (опціонально)
- Поточну статистику: активні абоненти, прострочені рахунки, вчора сплачено
- Графіки

---

### **ЕТАП 7: Telegram Bot Інтеграція (тиждень 7)**

#### 7.1 Розширення Bot Команд
```
src/app/api/bot/command/
├── start.ts (вже існує)
├── myaccount.ts (показати баланс абонента)
├── billing.ts (список поточних рахунків)
├── payment.ts (останні платежі)
└── help.ts (довідка)
```

Функціоналу:
- `/myaccount` - показувати залишок боргу, прострочені платежі
- `/billing` - список квитанцій
- `/payment НОМЕР_РАХУНКУ СУМА` - реєстрація платежу
- Сповіщення: нова квитанція, прострочена оплата

---

### **ЕТАП 8: UI/UX Покращення (тиждень 8)**

- [ ] Кольорові індикатори статусів
- [ ] Пошук по адресі/абоненту
- [ ] Фільтри та сортування
- [ ] Експорт в Excel (для звітів)
- [ ] Мобільна версія оптимізація

---

## 📝 Файли для створення/оновлення

### Модель Даних
```
prisma/
├── schema.prisma (оновити)
└── migrations/
    ├── {timestamp}_add_services_and_extend_models/
    └── migration.sql
```

### GraphQL
```
src/graphql/
├── schema.graphql (оновити)
├── resolvers/
│   ├── query/
│   │   ├── index.ts (додати new queries)
│   │   └── service.ts (нові)
│   ├── mutation/
│   │   └── index.ts (оновити)
│   ├── service/
│   │   └── index.ts (нові)
│   ├── device/
│   │   └── index.ts (нові)
│   └── payment/
│       └── index.ts (нові)
└── resolvers-types.ts (regenerate via codegen)
```

### Frontend Pages
```
src/app/pages/
├── service/
│   ├── page.tsx
│   ├── query.ts
│   ├── action.ts
│   ├── ServiceTable.tsx
│   └── ServiceModal.tsx
├── meter-reading/
│   ├── page.tsx
│   ├── query.ts
│   ├── action.ts
│   ├── MeterReadingTable.tsx
│   └── MeterReadingModal.tsx
├── payment/
│   ├── page.tsx
│   ├── query.ts
│   ├── action.ts
│   ├── PaymentTable.tsx
│   └── PaymentModal.tsx
├── reports/
│   ├── page.tsx
│   └── components/
│       ├── ConsumptionReport.tsx
│       ├── DebtReport.tsx
│       └── RevenueReport.tsx
└── [оновити: user, address, device, billing]/
```

### Bot Commands
```
src/app/api/bot/
└── command/
    ├── start.ts (вже існує)
    ├── myaccount.ts
    ├── billing.ts
    ├── payment.ts
    └── help.ts
```

---

## 🔍 Приклади GraphQL Queries/Mutations

### Services
```graphql
type Service {
  id: Int!
  name: String!
  unit: String!
  tariffs: [Tariff!]!
}

query GetServices {
  services {
    id
    name
    unit
  }
}

mutation CreateService($name: String!, $unit: String!) {
  createService(name: $name, unit: $unit) {
    id
    name
  }
}
```

### Meter Readings
```graphql
type MeterReading {
  id: Int!
  deviceId: Int!
  readingDate: String!
  value: Float!
  consumption: Float
}

query GetReadings($deviceId: Int!, $take: Int!, $skip: Int!) {
  readings(deviceId: $deviceId, take: $take, skip: $skip) {
    list {
      id
      readingDate
      value
      consumption
    }
    total
  }
}

mutation CreateReading(
  $deviceId: Int!
  $value: Float!
  $readingDate: String!
) {
  createReading(deviceId: $deviceId, value: $value, readingDate: $readingDate) {
    id
    consumption
  }
}
```

### Billing (Розширено)
```graphql
query GetBillings($take: Int!, $skip: Int!, $status: String) {
  billings(take: $take, skip: $skip, status: $status) {
    list {
      id
      billingPeriod
      consumption
      amount
      isPaid
      dueDate
      user { name }
      device { service { name } }
    }
    total
  }
}

mutation MarkBillingAsPaid($billingId: Int!) {
  markBillingAsPaid(billingId: $billingId) {
    id
    isPaid
  }
}
```

### Payments
```graphql
type Payment {
  id: Int!
  userId: Int!
  amount: Float!
  paymentDate: String!
  paymentMethod: String!
}

mutation CreatePayment(
  $userId: Int!
  $amount: Float!
  $billingId: Int
  $paymentMethod: String!
) {
  createPayment(
    userId: $userId
    amount: $amount
    billingId: $billingId
    paymentMethod: $paymentMethod
  ) {
    id
    amount
    paymentDate
  }
}
```

---

## ✅ Контрольний Список Тестування

- [ ] CRUD для всіх нових сутностей
- [ ] Розрахунок споживання при введенні показання
- [ ] Автоматичне формування рахунків
- [ ] Фільтрація та пошук
- [ ] Платежі позначають рахунки як оплачені
- [ ] Telegram інтеграція
- [ ] Експорт звітів

---

## 📚 Інструкції для AI Агенту

При реалізації кожного етапу:
1. Слідувати архітектурі: Prisma → GraphQL → Server Actions → UI Components
2. Запускати `npm run codegen` після кожної зміни schema.graphql
3. Використовувати типизацію з `resolvers-types.ts`
4. Слідувати паттерну `useLocalState` для стану компонентів
5. Логування помилок через `console.error/log` (поки без centralized handling)
6. Документувати нові patterns у `.github/copilot-instructions.md`

---

## 🚀 Дальший Розвиток (Future Features)

- Розсилка SMS/Email повідомлень про задолженість
- Інтеграція з платіжними системами (LiqPay, Stripe)
- Багатокористувацький доступ (User Roles)
- Цифрові рахунки (PDF/Email)
- Калькулятор тарифів з гарячого забору
- Статистика по кварталам/років
- Mobile App (React Native)

