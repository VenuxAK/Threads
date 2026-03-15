# Refactor Plan - Phase 2

## 1. New Folder Structure

```
composables/          (existing)
├── useAuth.ts        (keep - auth logic)
├── useUser.ts        (refactor - extract pagination)
├── usePost.ts        (refactor - extract pagination)
├── useApiError.ts    (keep - error handling)
└── useSanitize.ts    (keep - sanitization)

utils/                (NEW - utility functions)
├── capitalize.ts     (rename from useCaptitalize.ts)
└── date.ts           (NEW - date formatting)

types/                (NEW - TypeScript interfaces)
├── post.ts
├── user.ts
└── api.ts

components/           (existing)
├── ui/               (NEW - reusable base components)
│   ├── Card.vue
│   ├── Button.vue
│   └── Avatar.vue
├── post/             (existing - refactor)
│   ├── Post.vue      (rename from index.vue)
│   ├── Card.vue
│   ├── Header.vue
│   ├── Footer.vue
│   └── ...
└── ...

composables/          (NEW - extracted logic)
├── usePagination.ts
├── useInfiniteScroll.ts
└── usePostList.ts
```

## 2. Composables to Create

### `composables/usePagination.ts`
- Extract common pagination logic
- Handles: page tracking, hasMore, loading states
- Returns: currentPage, hasMore, load, loadMore

### `composables/useInfiniteScroll.ts`
- IntersectionObserver setup
- Reusable for any infinite scroll list

### `composables/usePostList.ts`
- Combines: getPosts + pagination + infinite scroll
- Single composable for pages that display posts

### `composables/useApi.ts` (optional)
- Normalize API response parsing
- Handle the `data.posts.data || data.posts` pattern

## 3. Components to Split

### `pages/index.vue` (134 lines → ~60 lines)
- Extract post list into `<PostList />` component
- Use `usePostList` composable

### `pages/@[username]/index.vue` (213 lines → ~80 lines)
- Extract profile header into `<ProfileHeader />`
- Extract tabs into `<ProfileTabs />`
- Use `usePostList` composable

### `Post/index.vue` vs `Post/Card.vue`
- Consolidate into single `<Post />` component
- Or clarify: Card = wrapper, Post = full component

## 4. Stores to Redesign

**Current: No Pinia store used**

Recommend adding Pinia for:
- UI state (modals, sidebars)
- Cache user data temporarily

For now, keep using composables + Sanctum for auth state.

## 5. Utilities to Extract

### `utils/capitalize.ts`
```typescript
export function capitalize(str: string): string {
  return str.toLowerCase()
    .split(" ")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
```

### `utils/date.ts` (NEW)
- Date formatting helpers
- `formatRelativeTime()` for "2h ago" style

### Fixes Required

1. **Fix typo**: `useCaptitalize` → `capitalize`
2. **Fix Avatar**: Accept dynamic `src` prop
3. **Fix Post/Card.vue**: `post="post"` → `:post="post"`
4. **Add types**: Create interfaces for Post, User

## Why Each Change Improves:

### Maintainability
- Single source of truth for pagination logic
- Smaller components = easier to understand
- Clear naming conventions

### Scalability
- Reusable composables work for any list
- New pages can use `usePostList` quickly
- Type safety prevents runtime errors

### Performance
- Less code duplication = smaller bundle
- Proper TypeScript = better tree-shaking
- Separated concerns = better caching potential
