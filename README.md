# aura-ag

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

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

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Testing

This project includes comprehensive testing setup with Jest, React Testing Library, and Playwright.

### Unit Tests

Run unit tests:

```bash
pnpm test
```

Run tests in watch mode:

```bash
pnpm test:watch
```

Run tests with coverage:

```bash
pnpm test:coverage
```

### End-to-End Tests

Run E2E tests:

```bash
pnpm test:e2e
```

Run E2E tests with UI:

```bash
pnpm test:e2e:ui
```

Run E2E tests in headed mode:

```bash
pnpm test:e2e --headed
```

Run specific E2E test:

```bash
pnpm test:e2e login.spec.ts
```

**E2E Test Structure:**

- `_tests_/e2e/specs/` - Test specifications
- `_tests_/e2e/page-objects/` - Page Object Model classes
- `_tests_/e2e/fixtures/` - Test fixtures and shared data
- `_tests_/e2e/playwright.config.ts` - Playwright configuration

**Test Categories:**

- Login Flow Tests - Form validation, authentication
- Dashboard Tests - Navigation, session management
- User Journey Tests - Complete user workflows

### Coverage Reports

Coverage reports are generated in multiple formats:

- **Terminal**: Shows coverage summary in console
- **HTML**: Detailed report in `coverage/index.html`
- **LCOV**: For integration with CI/CD tools

The coverage configuration includes:

- Collects coverage from `src/**/*.{js,jsx,ts,tsx}`
- Excludes type definitions, stories, and config files
- Generates reports in text, HTML, and LCOV formats

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
