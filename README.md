# Threads Clone (Nuxt 4 + GraphQL + Laravel)

A modern Instagram Threads clone built with **Nuxt 4**, **Vue 3**, **Pinia**, **Tailwind CSS**, and **GraphQL**.

---

## 🚀 Tech Stack

- **Framework:** Nuxt 4 (`^4.2.2`), Vue 3, TypeScript
- **API Protocol:** **GraphQL** via `useGraphQL` (typed queries & mutations)
- **State Management:** Pinia (`stores/posts.ts`, `stores/interactions.ts`, `stores/ui.ts`)
- **Authentication:** Laravel Sanctum stateful cookie authentication (`nuxt-auth-sanctum`)
- **Styling:** Tailwind CSS with SCSS (`assets/css/tailwind.scss`) & Dark Mode (`@nuxtjs/color-mode`)
- **UI & Icons:** Headless UI (`nuxt-headlessui`) & Iconify (`@nuxt/icon`)
- **Sanitization:** DOMPurify (`dompurify`)

---

## 📋 Prerequisites & Setup

- Node.js 18+
- Bun (recommended) or npm
- Laravel backend running on `http://localhost:8000`

```bash
# Install dependencies
bun install

# Generate Nuxt types
bun run postinstall

# Start development server
bun run dev
```

The application will be available at **`http://localhost:3000`**.

---

## ⚙️ Environment Configuration

Configure the backend API URL in `nuxt.config.ts`:

```ts
sanctum: {
  baseUrl: "http://localhost:8000",
  endpoints: {
    login: "/auth/login",
    logout: "/auth/logout",
    user: "/api/v1/me/profile",
  },
}
```

GraphQL requests are automatically routed to `http://localhost:8000/graphql` by the [`useGraphQL`](composables/useGraphQL.ts) composable with credentials and CSRF tokens included.

---

## 📁 Project Structure

```
├── assets/         # SCSS & Tailwind styles
├── components/     # Vue 3 components (Post, Comments, Sidebar, Modal)
├── composables/    # Business logic & API abstractions
│   ├── useGraphQL.ts # Unified Sanctum-integrated GraphQL client
│   ├── usePost.ts    # Post feed, single post, and search operations
│   ├── useLike.ts    # Like/unlike post mutation
│   ├── useRepost.ts  # Repost thread mutation
│   ├── useComment.ts # Nested comment & thread queries
│   └── useUser.ts    # Profile, posts, reposts, and liked posts queries
├── graphql/        # GraphQL operations library
│   ├── fragments.ts  # Reusable UserFields, PostFields, CommentFields
│   ├── queries/      # feed.ts, comments.ts, user.ts, search.ts
│   └── mutations/    # posts.ts, interactions.ts, comments.ts
├── layouts/        # Default & Auth layouts
├── pages/          # File-based routing (Feed, Profile, Liked, Search, Auth)
├── stores/         # Pinia reactive stores (posts, interactions, ui)
├── types/          # TypeScript interfaces (Post, User, Comment, Pagination)
└── utils/          # Utility helpers
```

---

## 💡 How GraphQL is Consumed

Instead of bulky Apollo Client dependencies, components consume typed GraphQL operations via composables:

```typescript
// Fetching paginated feed
const { getPosts } = usePost();
const { posts, pagination } = await getPosts(1);

// Liking a post with optimistic updates
const { likePost } = useLike();
const result = await likePost(post.id);

// Fetching user's liked posts
const { getMyLikedPosts } = useUser();
const { posts } = await getMyLikedPosts(1);
```

---

## 📜 Available Scripts

```bash
# Development server
bun run dev

# Prepare TypeScript declarations
bun run postinstall

# Build for production
bun run build

# Preview production build
bun run preview
```

---

## 📄 License

MIT
