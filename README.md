# Aura AG

Modern chatbot web application with authentication and conversation persistence, built with Next.js and Supabase.

## Description

Aura AG is an intelligent chatbot application that allows users to have conversations with advanced AI models. The application includes complete authentication, persistent conversation management, and a modern, responsive user interface.

## Tech Stack

### Framework and Core

- **Next.js 15.5.3** - React framework with App Router and Turbopack support
- **React 19.1.0** - UI library
- **TypeScript 5** - Static typing
- **Turbopack** - High-speed bundler for development

### Authentication and Database

- **Supabase** - Backend-as-a-Service platform
  - `@supabase/ssr` (v0.7.0) - SSR client for Next.js
  - `@supabase/supabase-js` (v2.57.4) - Supabase JavaScript client
  - Authentication fully managed through Supabase Auth
  - PostgreSQL database hosted on Supabase

### ORM and Migrations

- **Drizzle ORM** (v0.44.5) - Type-safe ORM for PostgreSQL
- **Drizzle Kit** (v0.31.4) - Migration tools and schema generation
- **Postgres** (v3.4.7) - PostgreSQL driver

### AI and Chatbot

- **Vercel AI SDK**
  - `ai` (v5.0.48) - Main SDK for AI model integration
  - `@ai-sdk/react` (v2.0.48) - React hooks for AI SDK
- Support for multiple models:
  - OpenAI GPT-4o
  - Deepseek R1
  - Perplexity Sonar (with web search)

### UI and Components

- **Radix UI** - Accessible primitive components:
  - Accordion, Alert Dialog, Avatar, Checkbox, Dialog, Dropdown Menu
  - Popover, Progress, Radio Group, Select, Slider, Switch, Tabs
  - Tooltip, and many more components
- **Tailwind CSS 4** - CSS utility framework
- **Lucide React** (v0.544.0) - Icons
- **next-themes** (v0.4.6) - Light/dark theme support
- **shadcn/ui** - UI components built on Radix UI

### State and Data

- **TanStack Query (former React Query)** (v5.89.0) - Server state management and caching
- **TanStack Query Devtools** (v5.89.0) - Development tools
- **React Hook Form** (v7.63.0) - Form handling
- **Zod** (v4.1.9) - Schema validation
- **@hookform/resolvers** (v5.2.2) - Resolvers for React Hook Form

### Utilities

- **date-fns** (v4.1.0) - Date utilities
- **nanoid** (v5.1.5) - Unique ID generation
- **clsx** (v2.1.1) - Utility for building class names
- **tailwind-merge** (v3.3.1) - Tailwind class merging
- **class-variance-authority** (v0.7.1) - Component variants
- **bcryptjs** (v3.0.2) - Password hashing
- **recharts** (v2.15.4) - Charts and visualizations
- **react-syntax-highlighter** (v15.6.6) - Syntax highlighting
- **sonner** (v2.0.7) - Toast notifications

### Testing

- **Jest** (v30.1.3) - Unit testing framework
- **React Testing Library** (v16.3.0) - Component testing utilities
- **@testing-library/jest-dom** (v6.8.0) - Custom matchers for Jest
- **@testing-library/user-event** (v14.6.1) - User event simulation
- **Playwright** (v1.55.0) - End-to-end testing
- **ts-jest** (v29.4.4) - TypeScript preprocessor for Jest
- **jest-environment-jsdom** (v30.1.2) - DOM testing environment

### Development

- **ESLint** (v9) - Code linter
- **eslint-config-next** (v15.5.3) - ESLint configuration for Next.js
- **@tailwindcss/postcss** (v4) - PostCSS plugin for Tailwind

## Authentication

Authentication is fully managed through **Supabase Auth**. The project uses:

- **Browser client** (`src/lib/supabase/client.ts`) - For client-side operations
- **Server client** (`src/lib/supabase/server.ts`) - For SSR and API route operations
- **Middleware** (`middleware.ts`) - Route protection and session verification
- **Custom hook** (`src/hooks/use-auth.ts`) - Authentication state management

### Authentication Features

- User registration
- Email and password login
- Session management
- User profiles synchronized with Supabase `auth.users`
- Route protection via middleware

## Database and Persistence

### Database Schema

The application uses **Drizzle ORM** to define the database schema. The main tables are:

#### `profiles`

- Stores user profile information
- Synchronized with Supabase `auth.users`
- Fields: `id`, `full_name`, `email`, `bio`, `avatar_url`, `role`, `status`

#### `conversations`

- Stores chatbot conversations
- Related to `profiles` via `user_id`
- Fields: `id`, `user_id`, `title`, `model`, `system_prompt`, `web_search_enabled`, `is_archived`, `created_at`, `updated_at`

#### `messages`

- Stores individual messages from each conversation
- Related to `conversations` via `conversation_id`
- Fields: `id`, `conversation_id`, `role` (user/assistant/system), `content`, `metadata` (JSONB), `sequence`, `model_used`, `tokens_used`, `created_at`, `updated_at`

### Conversation Persistence

Chatbot conversations are **saved and retrieved entirely from Supabase**:

- **Conversation creation**: Automatically created when the user sends their first message
- **Message storage**: Each message (user and assistant) is saved in real-time to Supabase
- **History loading**: Conversations and messages are loaded from Supabase upon login
- **Real-time subscriptions**: The `use-chat.ts` hook uses Supabase subscriptions to update the UI when changes occur
- **Conversation management**: Users can create, update, archive, and delete conversations

### Database Scripts

```bash
pnpm db:generate  # Generate migrations from schema
pnpm db:migrate   # Run migrations
pnpm db:push      # Sync schema directly (development)
pnpm db:studio    # Open Drizzle Studio (visual interface)
pnpm db:seed      # Run initial data seed
```

## Project Structure

```
aura-ag/
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── (auth)/               # Authentication route group
│   │   │   ├── login/           # Login page
│   │   │   └── register/        # Registration page
│   │   ├── (dashboard)/          # Protected route group
│   │   │   ├── chat/            # Main chatbot page
│   │   │   ├── settings/        # User settings
│   │   │   └── layout.tsx       # Dashboard layout
│   │   ├── api/                  # API Routes
│   │   │   └── chat/            # Chatbot endpoint
│   │   ├── layout.tsx            # Root layout
│   │   └── page.tsx              # Home page (redirects to /login)
│   ├── components/
│   │   ├── ai-elements/         # Chatbot-specific components
│   │   │   ├── conversation.tsx # Conversation component
│   │   │   ├── message.tsx       # Message component
│   │   │   ├── prompt-input.tsx # User input
│   │   │   ├── response.tsx      # Assistant response
│   │   │   ├── actions.tsx       # Message actions
│   │   │   ├── sources.tsx       # Information sources
│   │   │   ├── reasoning.tsx     # Model reasoning
│   │   │   └── ...               # Other AI components
│   │   └── ui/                   # Reusable UI components (shadcn/ui)
│   ├── hooks/
│   │   ├── use-auth.ts          # Authentication hook
│   │   ├── use-chat.ts          # Conversation management hook (Supabase)
│   │   ├── use-mobile.ts        # Mobile detection hook
│   │   └── use-supabase.ts      # Supabase helper hook
│   ├── lib/
│   │   ├── db/
│   │   │   ├── schema/          # Drizzle ORM schemas
│   │   │   │   └── public/
│   │   │   │       ├── profiles.ts
│   │   │   │       ├── conversations.ts
│   │   │   │       └── messages.ts
│   │   │   ├── index.ts         # Drizzle client
│   │   │   ├── queries.ts       # Database queries
│   │   │   ├── migrate.ts       # Migration utilities
│   │   │   └── seed.ts          # Seed data
│   │   ├── supabase/
│   │   │   ├── client.ts        # Supabase client (browser)
│   │   │   └── server.ts        # Supabase client (server)
│   │   ├── tanstack/
│   │   │   └── query-client.tsx # React Query configuration
│   │   └── utils.ts             # General utilities
│   └── ...
├── _tests_/                      # Tests
│   ├── __fixtures__/            # Test data and mocks
│   ├── integration/             # Integration tests
│   │   └── pages/
│   │       └── login-flow.test.tsx
│   └── unit/                    # Unit tests
│       ├── components/
│       ├── lib/
│       └── utils/
├── middleware.ts                 # Next.js middleware (route protection)
├── drizzle.config.ts             # Drizzle Kit configuration
├── jest.config.ts                # Jest configuration
├── jest.setup.ts                 # Jest setup
├── next.config.ts                # Next.js configuration
├── tsconfig.json                 # TypeScript configuration
└── package.json                  # Dependencies and scripts
```

## Main Files

### Authentication

- `src/lib/supabase/client.ts` - Supabase client for browser
- `src/lib/supabase/server.ts` - Supabase client for server
- `src/hooks/use-auth.ts` - Authentication hook with session and profile management
- `middleware.ts` - Route protection middleware

### Chatbot and Conversations

- `src/app/api/chat/route.ts` - API route for chatbot endpoint
- `src/hooks/use-chat.ts` - Hook for conversation and message management in Supabase
- `src/app/(dashboard)/chat/page.tsx` - Main chatbot page
- `src/components/ai-elements/` - Chatbot-specific components

### Database

- `src/lib/db/schema/public/profiles.ts` - Profiles schema
- `src/lib/db/schema/public/conversations.ts` - Conversations schema
- `src/lib/db/schema/public/messages.ts` - Messages schema
- `drizzle.config.ts` - Drizzle Kit configuration

### Configuration

- `next.config.ts` - Next.js configuration
- `tsconfig.json` - TypeScript configuration
- `jest.config.ts` - Jest configuration
- `package.json` - Project dependencies and scripts

## Testing

The project includes a comprehensive testing suite with multiple levels:

### Unit Tests (Jest + React Testing Library)

Unit tests run with Jest and React Testing Library:

```bash
pnpm test              # Run all tests
pnpm test:watch         # Watch mode
pnpm test:coverage      # With coverage report
```

**Configuration:**

- Environment: `jsdom` for DOM simulation
- Setup: `jest.setup.ts` with `@testing-library/jest-dom` configuration
- Coverage: Generates reports in text, HTML, and LCOV formats
- Location: `src/**/*.{test,spec}.{js,jsx,ts,tsx}` and `_tests_/unit/**/*`

**Unit Test Structure:**

- `_tests_/unit/components/` - UI component tests
- `_tests_/unit/lib/` - Utility and library tests
- `_tests_/unit/utils/` - Utility function tests

### Integration Tests

Integration tests test complete application flows:

- `_tests_/integration/pages/login-flow.test.tsx` - Complete login flow

### End-to-End Tests (Playwright)

E2E tests run with Playwright to test the complete application:

```bash
pnpm test:e2e         # Run E2E tests
pnpm test:e2e:ui      # Run with Playwright UI
pnpm test:e2e --headed # Headed mode (with visible browser)
```

**E2E Test Structure:**

- `_tests_/e2e/specs/` - Test specifications
- `_tests_/e2e/page-objects/` - Page Object Model classes
- `_tests_/e2e/fixtures/` - Fixtures and shared data
- `_tests_/e2e/playwright.config.ts` - Playwright configuration

**Test Categories:**

- Login Flow Tests - Form validation and authentication
- Dashboard Tests - Navigation and session management
- User Journey Tests - Complete user workflows

### Testing Fixtures and Utilities

- `_tests_/__fixtures__/mock-data.ts` - Mock data for tests
- `_tests_/__fixtures__/api-responses.ts` - Mock API responses
- `_tests_/__fixtures__/test-utils.tsx` - Shared testing utilities

### Coverage Reports

Coverage reports are generated in multiple formats:

- **Terminal**: Coverage summary in console
- **HTML**: Detailed report in `coverage/index.html`
- **LCOV**: For CI/CD tool integration

Coverage configuration includes:

- Collects coverage from `src/**/*.{js,jsx,ts,tsx}`
- Excludes type definitions, stories, and config files
- Generates reports in text, HTML, and LCOV formats

## Available Scripts

### Development

```bash
pnpm dev              # Development server with Turbopack
pnpm build            # Production build with Turbopack
pnpm start            # Production server
pnpm lint             # Run ESLint
```

### Database

```bash
pnpm db:generate      # Generate migrations from schema
pnpm db:migrate       # Run migrations
pnpm db:push          # Sync schema (development)
pnpm db:studio        # Open Drizzle Studio
pnpm db:seed          # Run data seed
```

### Testing

```bash
pnpm test             # Unit tests
pnpm test:watch       # Tests in watch mode
pnpm test:coverage    # Tests with coverage
pnpm test:e2e         # End-to-end tests
pnpm test:e2e:ui      # E2E tests with UI
```

## Environment Variables

The project requires the following environment variables:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Database (for Drizzle)
DATABASE_URL=your_postgresql_connection_string
```

## Getting Started

1. **Install dependencies:**

```bash
pnpm install
```

2. **Configure environment variables:**

   - Create `.env.local` file with required variables
   - Set up Supabase and obtain credentials

3. **Set up the database:**

```bash
pnpm db:push          # Sync initial schema
pnpm db:seed          # Optional: load example data
```

4. **Start the development server:**

```bash
pnpm dev
```

5. **Open in browser:**
   - Navigate to [http://localhost:3000](http://localhost:3000)
   - The application will automatically redirect to `/login`

## Main Features

- ✅ Complete authentication with Supabase
- ✅ Chatbot with multiple AI models (GPT-4o, Deepseek R1)
- ✅ Conversation persistence in Supabase
- ✅ Optional web search with Perplexity
- ✅ Modern and responsive interface
- ✅ Light/dark theme
- ✅ Real-time subscriptions for conversation updates
- ✅ Complete conversation management (create, archive, delete)
- ✅ Persistent message history
- ✅ Comprehensive testing (unit, integration, E2E)
- ✅ TypeScript for complete type-safety
- ✅ Performance optimizations with Turbopack

## Key Technologies

- **Next.js 15** with App Router and Turbopack for ultra-fast development
- **Supabase** for authentication and PostgreSQL database
- **Vercel AI SDK** for AI model integration
- **Drizzle ORM** for type-safe database queries
- **Radix UI + Tailwind CSS** for accessible and modern components
- **React Query** for efficient server state management
- **Jest + Playwright** for comprehensive testing

## License

This project is private.
