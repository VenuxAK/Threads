import { defineStore } from 'pinia';
import type { Post } from '~/types';

interface InteractionsState {
  likedPosts: Set<string>;
  repostedPosts: Set<string>;
  savedPosts: Set<string>;
}

export const useInteractionsStore = defineStore('interactions', {
  state: (): InteractionsState => ({
    likedPosts: new Set<string>(),
    repostedPosts: new Set<string>(),
    savedPosts: new Set<string>(),
  }),

  hydrate(state) {
    state.likedPosts = new Set<string>();
    state.repostedPosts = new Set<string>();
    state.savedPosts = new Set<string>();
  },

  getters: {
    isPostLiked: (state) => (postId: string) => state.likedPosts.has(postId.toString()),
    isPostReposted: (state) => (postId: string) =>
      state.repostedPosts.has(postId.toString()),
    isPostSaved: (state) => (postId: string) =>
      state.savedPosts.has(postId.toString()),
  },

  actions: {
    syncFromPosts(posts: Post[]) {
      posts.forEach((p) => {
        const id = p.id.toString();
        if (p.is_reposted) {
          this.repostedPosts.add(id);
        } else {
          this.repostedPosts.delete(id);
        }
        if (p.is_liked) {
          this.likedPosts.add(id);
        } else {
          this.likedPosts.delete(id);
        }
        if (p.is_saved) {
          this.savedPosts.add(id);
        } else {
          this.savedPosts.delete(id);
        }
      });
    },

    toggleLike(postId: string, liked: boolean) {
      if (liked) {
        this.likedPosts.add(postId.toString());
      } else {
        this.likedPosts.delete(postId.toString());
      }
    },

    toggleRepost(postId: string, reposted: boolean) {
      if (reposted) {
        this.repostedPosts.add(postId.toString());
      } else {
        this.repostedPosts.delete(postId.toString());
      }
    },

    toggleSave(postId: string, saved: boolean) {
      if (saved) {
        this.savedPosts.add(postId.toString());
      } else {
        this.savedPosts.delete(postId.toString());
      }
    },

    clearLikedPosts() {
      this.likedPosts.clear();
    },

    clearSavedPosts() {
      this.savedPosts.clear();
    },

    clear() {
      this.likedPosts.clear();
      this.repostedPosts.clear();
      this.savedPosts.clear();
    },
  },
});
