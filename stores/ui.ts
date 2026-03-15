import { defineStore } from 'pinia';

interface UIState {
  isCreatePostModalOpen: boolean;
  isSidebarOpen: boolean;
  isApperenceOpen: boolean;
}

export const useUIStore = defineStore('ui', {
  state: (): UIState => ({
    isCreatePostModalOpen: false,
    isSidebarOpen: true,
    isApperenceOpen: false,
  }),
  
  actions: {
    toggleCreatePostModal() {
      this.isCreatePostModalOpen = !this.isCreatePostModalOpen;
    },
    
    openCreatePostModal() {
      this.isCreatePostModalOpen = true;
    },
    
    closeCreatePostModal() {
      this.isCreatePostModalOpen = false;
    },
    
    toggleSidebar() {
      this.isSidebarOpen = !this.isSidebarOpen;
    },
    
    toggleApperence() {
      this.isApperenceOpen = !this.isApperenceOpen;
    },
    
    closeApperence() {
      this.isApperenceOpen = false;
    },
  },
});
