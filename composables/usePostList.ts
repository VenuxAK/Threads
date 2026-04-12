import type { Post, Pagination } from '~/types';
import { useRateLimit } from '~/composables/useRateLimit';

interface UsePostListOptions {
  fetchFn?: (page: number) => Promise<{ posts: Post[]; pagination: Pagination | null }>;
}

export const usePostList = (options: UsePostListOptions = {}) => {
  const { getPosts } = usePost();
  const { state: rateLimitState, checkRateLimit } = useRateLimit();
  const postsStore = usePostsStore();

  const posts = computed(() => postsStore.posts);
  const loading = computed(() => postsStore.loading);
  const loadingMore = computed(() => postsStore.loadingMore);
  const currentPage = computed(() => postsStore.currentPage);
  const hasMore = computed(() => postsStore.hasMore);
  const error = computed(() => postsStore.error);

  const loadPosts = async (page: number = 1, append: boolean = false) => {
    if (append && postsStore.loadingMore) return;

    postsStore.setLoadingMore(append);
    if (!append) {
      postsStore.setLoading(true);
    }

    postsStore.setError(null);

    try {
      const result = await (options.fetchFn ? options.fetchFn(page) : getPosts(page));

      if (result && result.posts) {
        if (append) {
          postsStore.appendPosts(result.posts, result.pagination);
        } else {
          postsStore.setPosts(result.posts, result.pagination);
        }
      }
    } catch (err) {
      if (checkRateLimit(err)) {
        postsStore.setError('Rate limit exceeded. Please wait before making more requests.');
      } else {
        postsStore.setError('Failed to load posts');
        console.error('loadPosts error:', err);
      }
    } finally {
      postsStore.setLoading(false);
      postsStore.setLoadingMore(false);
    }
  };

  const loadMore = () => {
    if (postsStore.hasMore && !postsStore.loadingMore) {
      loadPosts(postsStore.currentPage + 1, true);
    }
  };

  const addPost = (post: Post) => {
    postsStore.addPost(post);
  };

  const refresh = () => {
    loadPosts(1, false);
  };

  return {
    posts,
    loading,
    loadingMore,
    hasMore,
    currentPage,
    error,
    rateLimit: readonly(rateLimitState),
    loadPosts,
    loadMore,
    addPost,
    refresh,
  };
};
