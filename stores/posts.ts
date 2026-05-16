import { defineStore } from 'pinia';
import type { Post, Pagination } from '~/types';

interface PostsState {
  posts: Post[];
  pagination: Pagination | null;
  currentPage: number;
  hasMore: boolean;
  loading: boolean;
  loadingMore: boolean;
  error: string | null;
  likedPosts: Set<string>;
  repostedPosts: Set<string>;
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
    likedPosts: new Set<string>(),
    repostedPosts: new Set<string>(),
  }),

  hydrate(state) {
    // Initialize with empty liked posts - backend will provide actual like state
    state.likedPosts = new Set<string>();
    state.repostedPosts = new Set<string>();
  },

  getters: {
    hasPosts: (state) => state.posts.length > 0,
    isEmpty: (state) => state.posts.length === 0 && !state.loading,
    isPostLiked: (state) => (postId: string) => state.likedPosts.has(postId.toString()),
    isPostReposted: (state) => (postId: string) =>
      state.repostedPosts.has(postId.toString()),
  },

  actions: {
    setPosts(posts: Post[], pagination: Pagination | null) {
      this.posts = posts;
      posts.forEach((p) => {
        if (p.is_reposted) {
          this.repostedPosts.add(p.id.toString());
        } else {
          this.repostedPosts.delete(p.id.toString());
        }
      });
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
      newPosts.forEach((p) => {
        if (p.is_reposted) {
          this.repostedPosts.add(p.id.toString());
        } else {
          this.repostedPosts.delete(p.id.toString());
        }
      });
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

    toggleRepost(postId: string, reposted: boolean) {
      if (reposted) {
        this.repostedPosts.add(postId.toString());
      } else {
        this.repostedPosts.delete(postId.toString());
      }
      const postIndex = this.posts.findIndex(
        (p) => p.id.toString() === postId.toString(),
      );
      if (postIndex !== -1 && this.posts[postIndex]) {
        this.posts[postIndex].is_reposted = reposted;
      }
    },

    toggleLike(postId: string, liked: boolean) {
      if (liked) {
        this.likedPosts.add(postId.toString());
      } else {
        this.likedPosts.delete(postId.toString());
      }
      const postIndex = this.posts.findIndex(
        (p) => p.id.toString() === postId.toString(),
      );
      if (postIndex !== -1 && this.posts[postIndex]) {
        this.posts[postIndex].is_liked = liked;
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
      this.likedPosts.clear();
      this.repostedPosts.clear();
    },

    clearLikedPosts() {
      this.likedPosts.clear();
    },

    setLikedPosts(postIds: string[]) {
      this.likedPosts = new Set(postIds);
    },

    checkAndSetLike(postId: string) {
      // This method should be called after fetching posts to check like status from backend
      // The backend API should include is_liked field in post responses
      // For now, we'll keep it empty and rely on the backend to provide like status
    },
  },
});
