import type { Post, Pagination } from '~/types';

interface UsePostListOptions {
  fetchFn?: (page: number) => Promise<{ posts: Post[]; pagination: Pagination | null }>;
}

export const usePostList = (options: UsePostListOptions = {}) => {
  const { getPosts } = usePost();
  
  const posts = ref<Post[]>([]);
  const loading = ref(false);
  const loadingMore = ref(false);
  const currentPage = ref(1);
  const hasMore = ref(true);
  const error = ref<string | null>(null);

  const loadPosts = async (page: number = 1, append: boolean = false) => {
    if (append && loadingMore.value) return;
    
    if (append) {
      loadingMore.value = true;
    } else {
      loading.value = true;
    }
    
    error.value = null;
    
    try {
      const result = await (options.fetchFn ? options.fetchFn(page) : getPosts(page));
      
      if (result && result.posts) {
        if (append) {
          posts.value = [...posts.value, ...result.posts];
        } else {
          posts.value = result.posts;
        }
        
        if (result.pagination) {
          hasMore.value = result.pagination.current_page < result.pagination.last_page;
          currentPage.value = result.pagination.current_page;
        } else {
          hasMore.value = false;
        }
      }
    } catch (err) {
      error.value = 'Failed to load posts';
      console.error('loadPosts error:', err);
    } finally {
      loading.value = false;
      loadingMore.value = false;
    }
  };

  const loadMore = () => {
    if (hasMore.value && !loadingMore.value) {
      loadPosts(currentPage.value + 1, true);
    }
  };

  const addPost = (post: Post) => {
    posts.value = [post, ...posts.value];
  };

  const refresh = () => {
    loadPosts(1, false);
  };

  return {
    posts: readonly(posts),
    loading: readonly(loading),
    loadingMore: readonly(loadingMore),
    hasMore: readonly(hasMore),
    currentPage: readonly(currentPage),
    error: readonly(error),
    loadPosts,
    loadMore,
    addPost,
    refresh,
  };
};
