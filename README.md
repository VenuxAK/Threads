# Threads Clone (Nuxt 4 + Laravel)

A Threads clone built with Nuxt 4 and Laravel API backend.

## Tech Stack

- **Frontend:** Nuxt 4, TypeScript, TailwindCSS
- **State Management:** Pinia
- **Authentication:** Sanctum (Laravel)
- **Backend:** Laravel API (separate repo)

## Prerequisites

- Node.js 18+
- Bun (recommended) or npm
- Laravel backend running on `http://localhost:8000`

## Setup

```bash
# Install dependencies
bun install

# Start development server
bun run dev
```

The app will be available at `http://localhost:3000`

## Environment

Configure your Laravel API URL in `nuxt.config.ts`:

```ts
sanctum: {
  baseUrl: "http://localhost:8000",
}
```

## Scripts

```bash
# Development
bun run dev

# Build for production
bun run build

# Preview production build
bun run preview
```

## Project Structure

```
├── components/     # Vue components
├── composables/    # Vue composables
├── layouts/       # Nuxt layouts
├── pages/         # Nuxt pages
├── stores/        # Pinia stores
├── types/         # TypeScript interfaces
└── utils/         # Utility functions
```

## Features

- User authentication (Laravel Sanctum)
- Create, view posts
- User profiles
- Infinite scroll pagination
- Dark mode support

## License

MIT
