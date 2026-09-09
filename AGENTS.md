# Frontend - Agent Guidelines & Architecture

## 1. Stack & Runtime
- **Framework**: Nuxt 4 (Vue 3, TypeScript, script setup).
- **Package Manager**: Bun (preferred) or npm.
- **State Management**: Pinia (`@pinia/nuxt`).
- **Styling**: Tailwind CSS (`@nuxtjs/tailwindcss`) with custom styles in `assets/css/tailwind.scss`.
- **Icons & UI Primitives**: `@nuxt/icon` with local Iconify collections, `@headlessui/vue` for accessible dialogs/menus, `@nuxtjs/color-mode` for dark mode.
- **Sanitization**: DOMPurify (`dompurify`).

---

## 2. GraphQL Architecture & API Interaction
All client-to-server data operations are executed via GraphQL, backed by stateful Laravel Sanctum cookie authentication:

```
┌─────────────────────────────────┐
│         Nuxt 4 View             │ (e.g. pages/index.vue, pages/@[username]/index.vue)
└────────────────┬────────────────┘
                 ▼
┌─────────────────────────────────┐
│        Composable Layer         │ (e.g. usePostList, usePost, useLike)
└────────────────┬────────────────┘
                 ▼
┌─────────────────────────────────┐
│          useGraphQL             │ (Lightweight client wrapper on useSanctumClient)
│   - Injects X-XSRF-TOKEN        │
│   - credentials: 'include'      │
│   - Typed Query / Mutation      │
└────────────────┬────────────────┘
                 ▼
┌─────────────────────────────────┐
│      Pinia State Stores         │ (stores/posts.ts, stores/interactions.ts)
└─────────────────────────────────┘
```

### Critical Rules:
1. **Always Use `useGraphQL`**: Never call raw `fetch()` or construct custom Axios instances. Use `useGraphQL()` which encapsulates `useSanctumClient()` to ensure session cookies and CSRF tokens are passed automatically to `http://localhost:8000/graphql`.
2. **Modular GraphQL Documents**:
   - Store queries in `graphql/queries/*.ts` (e.g., `feed.ts`, `comments.ts`, `user.ts`).
   - Store mutations in `graphql/mutations/*.ts` (e.g., `posts.ts`, `interactions.ts`, `comments.ts`).
   - Group reusable GraphQL fragments when retrieving repeated structures (like `PostFields` or `AuthorFields`).
3. **Pinia as the Single Source of Truth**:
   - After executing GraphQL mutations (such as liking, reposting, or creating posts), always update the Pinia store (`usePostsStore()` and `useInteractionsStore()`) to keep the UI synchronized reactively across all tabs and modals.

---

## 3. UI, Formatting & Security Standards
1. **User Input Sanitization**:
   - Never render user-generated content directly with `v-html`.
   - Always route text through `useSanitize().sanitizeWithHashtags()` to neutralize XSS vulnerabilities and auto-link hashtags.
2. **Optimistic Updates**:
   - Interactions like `like` and `repost` should update local UI immediately in `components/Post/Footer.vue`, reverting back only if the GraphQL mutation fails.
3. **Responsive Design & Dark Mode**:
   - Always support both light and dark modes using Tailwind `dark:` variants.
   - Maintain mobile navigation via `components/Mobile/BottomNavigation.vue` and desktop navigation via `components/Sidebar/index.vue`.

---

## 4. Commenting & Code Quality Standards
- **Medium-Length Comments**: Every component script setup, custom composable, Pinia store action, and utility function must include a 2 to 4-line explanatory comment detailing:
  1. What state or lifecycle event is being handled.
  2. Any optimistic update rollback logic or GraphQL error handling present.
- **Type Safety**: Maintain strict TypeScript interfaces in `types/`. Never use unchecked `any` when a typed interface can be provided.
- **Verification**: Run `bun run postinstall` (Nuxt prepare) to verify types compile cleanly before marking tasks complete.
