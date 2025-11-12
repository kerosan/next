# Система управління та обліку абонентів комунальних послуг

**Next.js 14** + **GraphQL** + **Prisma** + **SQLite** + **Telegram Bot**

Система для управління абонентами комунальних послуг (вода, газ, електрика) з можливістю реєстрації абонентів, ведення обліку лічильників, розрахунку платежів та отримання оплат.

## 📋 Документація Проекту

- **[.github/copilot-instructions.md](./.github/copilot-instructions.md)** - Інструкції для AI агентів
- **[IMPLEMENTATION_PLAN.md](./IMPLEMENTATION_PLAN.md)** - План реалізації системи
- **[STAGE1_SETUP_GUIDE.md](./STAGE1_SETUP_GUIDE.md)** - Інструкції для завершення Етапу 1 ⚠️ ПРОЧИТАЙТЕ ЦЕ СПОЧАТКУ!
- **[STAGE1_COMPLETION.md](./STAGE1_COMPLETION.md)** - Огляд змін та приклади

## 🚀 Швидкий Старт

### Завершення Етапу 1 (База Даних і GraphQL)

**ВАЖЛИВО:** Необхідно завершити наступні кроки:

```powershell
# 1. Очистити та переустановити зависимости
Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
Remove-Item package-lock.json -ErrorAction SilentlyContinue
npm install

# 2. Застосувати міграцію
npm run prisma:migrate:reset

# 3. Генерувати Prisma Client
npm run prisma:generate

# 4. Генерувати GraphQL типи
npm run codegen

# 5. Запустити dev сервер
npm run dev
```

Детальні інструкції: [STAGE1_SETUP_GUIDE.md](./STAGE1_SETUP_GUIDE.md)

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
