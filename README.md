# Runforge Runs

Страница Runs для Runforge: список запусков AI-агентов с поиском, фильтром по статусу, сортировкой и деталями запуска. Данные приходят из локального mock-сервиса.

Демо: https://runforge-runs.vercel.app

## Запуск

Нужен Node.js 22+.

```bash
npm ci
npm run dev        # http://localhost:5173
npm run build      # production-сборка в dist/
```

## Проверки

```bash
npm test           # Vitest + React Testing Library
npm run lint       # oxlint
npm run typecheck
npm run format:check
```

## Структура

- `src/api` — mock-сервис `fetchRuns()` (Promise с задержкой 800 мс) и тестовые данные
- `src/lib` — фильтрация, сортировка и форматирование дат и длительности
- `src/hooks` — `useRuns` (загрузка, ошибка, повтор) и `useRunsSearchParams` (состояние в URL)
- `src/components` — `RunsPage` собирает тулбар, список, состояния данных и drawer с деталями

## Решения

- Фильтр, поиск, сортировка и открытый запуск хранятся в query-параметрах (`?status=failed&q=api&run=run_8f3a1c`), ссылку можно отправить.
- Ошибку загрузки можно увидеть по адресу `/?fail=1`: первый запрос падает, «Повторить» загружает данные.
- Детали открываются в drawer: закрыть можно кнопкой «К списку запусков», клавишей Esc, кликом по фону или кнопкой «Назад» в браузере.
- Роутер и стейт-менеджер не подключены: страница одна, состояния хватает в хуках.
