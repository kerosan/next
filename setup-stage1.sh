#!/bin/bash
# Запуск Prisma миграции и кодогенерации

echo "🔄 Запуск Prisma миграции..."
npm run prisma:migrate:dev

echo "📝 Регенерирование GraphQL типов..."
npm run codegen

echo "✅ Готово! Теперь можете запустить npm run dev"
