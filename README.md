# DuoFit

DuoFit is a fitness tracking web application built with Next.js. It gives users a central place to manage workout plans, set fitness goals, record progress, review completed workouts on a calendar, and generate personalized workout ideas with AI.

## What the website does

- **Authentication:** Email/password sign-up and login, plus Google sign-in through Firebase Authentication.
- **Dashboard:** Shows today’s workout, completed-workout activity, weight history, and shortcuts to the main fitness tools.
- **Workout plans:** Browse, filter, create, update, delete, and complete workout plans with exercises, sets, reps, weights, and notes.
- **Goals and profile:** Set or update a fitness goal and target date.
- **Progress tracking:** Record weight, body-fat percentage, measurements, and notes, then review progress visually.
- **Workout calendar:** See completed workouts by date.
- **AI workout generator:** Create a structured workout plan from duration, goal, equipment, muscle focus, intensity, gender preference, and specific requests.

## Technology

- Next.js App Router and React
- TypeScript
- Tailwind CSS with shadcn/ui and Radix UI primitives
- Firebase Authentication
- Prisma ORM with SQLite
- Genkit with Google AI for workout generation
- Recharts for progress visualizations

## Getting started

### Prerequisites

- Node.js 20 or newer
- npm
- A Google AI API key for the AI workout generator

### Install dependencies

```bash
npm install
```

### Configure environment variables

Create `.env.local` in the project root:

```env
DATABASE_URL="file:./prisma/dev.db"
GOOGLE_GENAI_API_KEY="your-google-ai-api-key"
```

The Firebase web configuration is currently defined in `src/lib/firebase/config.ts`. For production, move those Firebase values to environment variables and configure the required Firebase Authentication providers in the Firebase console.

### Set up the database

```bash
npx prisma generate
npx prisma migrate dev
```

### Run the development server

```bash
npm run dev
```

Open [http://localhost:9002](http://localhost:9002) in your browser.

## Available scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the Next.js development server on port 9002 |
| `npm run build` | Create a production build |
| `npm run start` | Start the production server |
| `npm run typecheck` | Run the TypeScript compiler without emitting files |
| `npm run genkit:dev` | Start the Genkit development environment |
| `npm run genkit:watch` | Start Genkit with file watching |

## Main routes

| Route | Description |
| --- | --- |
| `/login` | Sign in |
| `/signup` | Create an account |
| `/dashboard` | Dashboard overview |
| `/dashboard/goal` | Goal and profile setup |
| `/dashboard/workouts` | Workout plan library |
| `/dashboard/create-workout` | Create a custom workout |
| `/dashboard/ai-workout` | Generate an AI workout plan |
| `/dashboard/calendar` | Completed workout calendar |
| `/dashboard/progress` | Weight and fitness progress |

## Project structure

```text
src/
├── app/                  Next.js routes, layouts, and API handlers
├── components/           Feature components and reusable UI primitives
├── hooks/                React hooks, including authentication helpers
├── lib/                  API clients, Firebase setup, and utilities
├── ai/                   Genkit configuration and AI workout flow
└── types/                Shared application and workout types
prisma/
├── schema.prisma         User, workout, goal, exercise, and progress models
└── migrations/           Prisma database migrations
```

## Audit notes

The application currently presents a focused, responsive authentication experience at the root entry point and routes authenticated users into the dashboard. The main product areas are represented in the dashboard navigation and share a consistent component system.

Before production deployment, review the following items:

- Replace hard-coded Firebase client configuration with environment variables.
- Configure and verify Firebase authorized domains and the Google sign-in provider.
- Use a managed production database instead of the checked-in SQLite database.
- Keep the Google AI credential server-side and configure production secrets through the deployment platform.
- Add automated tests for authentication, workout mutations, authorization boundaries, and AI generation failures.
- Verify that every API query scopes workout, goal, and progress data to the authenticated user.

## License

No license has been specified for this project yet.

## Repository

DuoFit is maintained in the `Cbreezz/DuoFit` repository.
"}]} सहाय. Need validate build/typecheck maybe npm scripts. Use Bash. Also SyncGit required after file change and branch? Need create branch from master. SyncGit can branchName e.g. v0/audit-readme, commit. But before maybe validate. Use parallel bash build/typecheck? independent, yes.”】【 to=multi_tool_use.parallel.parallel  (commentary)  codeҭеи 广益json(signal) waswo期特码>{
