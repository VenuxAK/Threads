import { defineStore } from 'pinia';
import type { Post, Pagination } from '~/types';
import { useInteractionsStore } from '~/stores/interactions';

interface PostsState {
  posts: Post[];
  pagination: Pagination | null;
  currentPage: number;
  hasMore: boolean;
  loading: boolean;
  loadingMore: boolean;
  error: string | null;
}

export const usePostsStore = defineStore('posts', {
  state: (): PostsState => ({
    posts: [],
    pagination: null,
    currentPage: 1,
    hasMore: true,
    loading: false,
    loadingMore: false,
    error: null,
  }),

  getters: {
    hasPosts: (state) => state.posts.length > 0,
    isEmpty: (state) => state.posts.length === 0 && !state.loading,
  },

  actions: {
    setPosts(posts: Post[], pagination: Pagination | null) {
      this.posts = posts;
      const interactions = useInteractionsStore();
      interactions.syncFromPosts(posts);
      this.pagination = pagination;
      if (pagination) {
        this.hasMore = pagination.current_page < pagination.last_page;
        this.currentPage = pagination.current_page;
      } else {
        this.hasMore = false;
      }
    },

    appendPosts(newPosts: Post[], pagination: Pagination | null) {
      this.posts = [...this.posts, ...newPosts];
      const interactions = useInteractionsStore();
      interactions.syncFromPosts(newPosts);
      this.pagination = pagination;
      if (pagination) {
        this.hasMore = pagination.current_page < pagination.last_page;
        this.currentPage = pagination.current_page;
      } else {
        this.hasMore = false;
      }
    },

    addPost(post: Post) {
      this.posts = [post, ...this.posts];
    },

    updatePostLikes(postId: string, likesCount: number) {
      const postIndex = this.posts.findIndex(p => p.id.toString() === postId.toString());
      if (postIndex !== -1 && this.posts[postIndex]) {
        this.posts[postIndex].likes = likesCount;
      }
    },

    updatePostComments(postId: string, commentsCount: number) {
      const postIndex = this.posts.findIndex(p => p.id.toString() === postId.toString());
      if (postIndex !== -1 && this.posts[postIndex]) {
        this.posts[postIndex].comments = commentsCount;
      }
    },

    updatePostReposts(postId: string, repostsCount: number) {
      const postIndex = this.posts.findIndex(
        (p) => p.id.toString() === postId.toString(),
      );
      if (postIndex !== -1 && this.posts[postIndex]) {
        this.posts[postIndex].reposts = repostsCount;
        if (this.posts[postIndex].interactions) {
          this.posts[postIndex].interactions!.reposts = repostsCount;
        }
      }
    },

    setLoading(loading: boolean) {
      this.loading = loading;
    },

    setLoadingMore(loadingMore: boolean) {
      this.loadingMore = loadingMore;
    },

    setError(error: string | null) {
      this.error = error;
    },

    reset() {
      this.posts = [];
      this.pagination = null;
      this.currentPage = 1;
      this.hasMore = true;
      this.loading = false;
      this.loadingMore = false;
      this.error = null;
    },
  },
});
