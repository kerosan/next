# setup-stage1.ps1 - Запуск Prisma миграции и кодогенерации

Write-Host "🔄 Запуск Prisma миграции..."
npm run prisma:migrate:dev

Write-Host "📝 Регенерирование GraphQL типов..."
npm run codegen

Write-Host "✅ Готово! Теперь можете запустить npm run dev"
