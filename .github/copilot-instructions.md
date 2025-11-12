# AI Coding Agent Instructions for Next.js GraphQL Project

## Project Overview

This is a **Next.js 14** full-stack application with a **GraphQL API**, **Telegram bot**, and **SQLite database** using Prisma. The architecture separates concerns into:

- **API Layer**: GraphQL endpoint via graphql-yoga (`/graphql`)
- **Telegram Bot**: Webhook-based grammy bot at `/api/bot`
- **Frontend Pages**: React Server Components in `src/app/pages/` (not Next.js `/pages` router)
- **Database**: Prisma ORM with SQLite, user/device/address/billing/tariff entities

---

## Architecture & Data Flow

### Stack

- **Framework**: Next.js 14 (App Router)
- **Database**: SQLite via Prisma ORM with Prisma Accelerate
- **API**: GraphQL (graphql-yoga) + Apollo Client
- **Bot**: Telegram bot using grammy
- **Styling**: Ant Design + Tailwind CSS
- **Tooling**: Biome (linter/formatter), TypeScript strict mode

### Critical Patterns

1. **GraphQL Schema-First Approach**

   - Schema defined in `src/graphql/schema.graphql` (TypeDefs)
   - Resolvers in `src/graphql/resolvers/{query,mutation,user}/` organized by type
   - Types auto-generated via `graphql-codegen` → `src/graphql/resolvers-types.ts`
   - Run `npm run codegen` after modifying `schema.graphql` to regenerate types

2. **Server Actions + GraphQL Queries**

   - Page features defined in `src/app/pages/{entity}/{page,query,action}.ts`
   - `query.ts`: GraphQL queries/mutations (gql tagged templates)
   - `action.ts`: Server-side mutations with `"use server"` directive
   - Example: `src/app/pages/user/action.ts` → `onCreate`, `onUpdate`, `onDelete` call GraphQL mutations
   - **Pattern**: UI calls server action → action executes GraphQL mutation via Apollo client

3. **Database Access Layer**

   - Single Prisma instance in `src/db/prisma.ts` (exported as default)
   - **Always use transactions** for multi-table operations (see `src/graphql/resolvers/query/index.ts`)
   - Example: `prisma.$transaction([prisma.address.count(), prisma.address.findMany(...)])`
   - No direct fetch calls; all DB access goes through resolvers

4. **Apollo Client Configuration**

   - Registered in `src/lib/apolloClient.tsx` using experimental Next.js app support
   - Endpoint from `process.env.API_URL`
   - Error link logs GraphQL/network errors; cache set to `no-store` for fresh data

5. **File Organization for New Features**
   - Create `src/app/pages/{entity}/` directory with:
     - `page.tsx` - Server component rendering
     - `query.ts` - GraphQL queries/mutations
     - `action.ts` - Server action handlers
     - `{Entity}Table.tsx`, `{Entity}Modal.tsx` - UI components
   - Add entity to `src/graphql/schema.graphql`
   - Create resolvers in `src/graphql/resolvers/{query,mutation,entity}/`
   - Run `npm run codegen` to update types

---

## Development Workflows

### Start Development

```bash
npm run dev              # Runs with --turbo flag for fast HMR
npm run debug           # Debug mode with Node inspector
```

### Database

```bash
npm run prisma:push            # Sync schema.prisma to SQLite (dev only!)
npm run prisma:migrate:dev     # Create new migration with name
npm run prisma:migrate:reset   # Reset DB to initial state (dev only!)
npm run prisma:studio         # Open Prisma Studio UI at localhost:5555
npm run prisma:generate       # Generate Prisma Client (run after `npm install`)
```

### Code Generation

```bash
npm run codegen                # Regenerate GraphQL types from schema.graphql
                               # Must run after modifying schema.graphql
```

### Build & Lint

```bash
npm run build           # Next.js production build
npm start              # Run production server
npm run lint           # Biome linting (auto-fixable issues)
```

---

## Key Conventions

1. **Path Aliases**: Use `@/` prefix for imports (configured in `tsconfig.json`)

   - `@/app`, `@/components`, `@/db`, `@/graphql`, `@/lib`, `@/types`, `@/utils`

2. **Biome Linting**:

   - Enabled with recommended rules in `biome.json`
   - Ignores use `// biome-ignore lint/rule-name: <explanation>`
   - Used throughout codebase (see `src/app/graphql/route.ts` for examples)

3. **Type Safety**:

   - Strict TypeScript mode enforced
   - GraphQL resolvers must match auto-generated `Resolvers` type from `resolvers-types.ts`
   - Mutations use `"use server"` directive in `action.ts` files

4. **Environment Variables**:

   - `API_URL`: Apollo client GraphQL endpoint (e.g., `http://localhost:3000/graphql`)
   - `TELEGRAM_BOT_TOKEN`: Telegram bot token (required for `/api/bot`)
   - `NODE_TLS_REJECT_UNAUTHORIZED=0`: Used in `prisma:generate` script (dev only)

5. **Pagination Pattern**:

   - All list queries accept `take` and `skip` parameters
   - Resolvers return `{ list, total }` object (see `query/index.ts`)
   - Frontend components expect this structure (see `AddressTable.tsx`, etc.)

6. **Custom Hook: `useLocalState`** (from `src/utils/useLocalState.ts`)

   - Drop-in replacement for `useState` with reducer-based state management
   - Signature: `useLocalState<State>(initialState, onChange?)`
   - `onChange` callback fires on every state update: `(newState, oldState) => void`
   - Used in table/modal components for managing open/close states and pagination
   - Example: `const [state, setState] = useLocalState({ open: false, current: undefined })`
   - Supports partial state updates: `setState({ open: true })` merges with existing state
   - Returns `[state, dispatch]` like `useReducer`; marked with `'use client'` directive

7. **Error Handling Pattern**:

   - **No centralized error handling layer** - errors flow to client for display
   - GraphQL mutations propagate Prisma errors directly (unhandled at resolver level)
   - Apollo Client logs errors via `errorLink` in `src/lib/apolloClient.tsx` console
   - Console logging used throughout: `console.log`, `console.error` in resolvers/handlers
   - Telegram handlers use try-catch in `route.ts` (lines 48-53) with error responses
   - **Best practice for new features**: Wrap Prisma operations in try-catch, send error messages to client
   - **No testing framework configured** - manual testing via dev server + browser/API client (Postman, GraphQL Playground)

8. **Search Pattern**:

   - Dedicated `search{Entity}` queries (e.g., `searchAddress`, `searchDevice`)
   - Uses Prisma's `contains` filter with 10-item limit
   - Called independently; not part of paginated list query

9. **Telegram Bot Handler Pattern** (localhost development only)
   - **Context**: Currently only works in development mode on localhost; production webhook integration planned
   - **Bot Registration**: Global singleton via `getInstance()` in `src/app/api/bot/handlers.ts`
   - **Message Routing**: Switch-based dispatch in `handlers.ts` → `/start` command calls `src/app/api/bot/command/start.ts`
   - **Handler Flow**: Extract user context → Query Prisma → Send Telegram reply
   - **Example (`start.ts`)**: Extract `ctx.from.id` → format as `smId: "telegram:{userId}"` → check existing user → create or greet
   - **Development Endpoint**: GET `/api/bot?action=start` initializes bot polling (localhost only)
   - **Production Endpoint**: POST `/api/bot` receives webhook callbacks via grammy's `webhookCallback()`
   - **Lifecycle**: Graceful shutdown on SIGTERM/SIGINT in dev mode (lines 8-11 in `route.ts`)
   - **Environment**: Requires `TELEGRAM_BOT_TOKEN` set; throws error if missing; no auth logic (bot identity = token)

---

## Important Notes

- **No Pages Router**: Application uses Next.js App Router; `/pages` directory is NOT used
- **UI Pages Location**: React components are in `src/app/pages/{entity}/`, NOT `app/` route segments
- **GraphQL Endpoint**: Exposed at `/app/graphql/route.ts` via graphql-yoga, accessible at `/graphql`
- **Telegram Bot**: Webhook handler at `/api/bot`; graceful shutdown on dev mode (SIGTERM/SIGINT)
- **Prisma Shadow DB**: Uses SQLite; migrations stored in `prisma/migrations/`
- **Build Optimization**: Next.js 14 with Turbo mode for faster HMR in development

---

## When Adding New Features

1. Extend `schema.prisma` with new model
2. Create migration: `npm run prisma:migrate:dev --name <description>`
3. Add GraphQL types to `schema.graphql`
4. Implement resolvers in `src/graphql/resolvers/{query,mutation}/`
5. Run `npm run codegen` to auto-generate resolver types
6. Create `src/app/pages/{entity}/` with page, queries, actions, and components
7. Export Apollo client via `getClient()` from `@/lib/apolloClient.tsx` for mutations
