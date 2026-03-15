export const usePagination = (initialPage: number = 1) => {
  const currentPage = ref(initialPage);
  const hasMore = ref(true);
  const loading = ref(false);
  const loadingMore = ref(false);

  const reset = () => {
    currentPage.value = 1;
    hasMore.value = true;
    loading.value = false;
    loadingMore.value = false;
  };

  const setPagination = (pagination: { current_page: number; last_page: number } | null) => {
    if (pagination) {
      hasMore.value = pagination.current_page < pagination.last_page;
      currentPage.value = pagination.current_page;
    } else {
      hasMore.value = false;
    }
  };

  const startLoad = (append: boolean = false) => {
    if (append) {
      loadingMore.value = true;
    } else {
      loading.value = true;
    }
  };

  const endLoad = () => {
    loading.value = false;
    loadingMore.value = false;
  };

  const nextPage = () => currentPage.value + 1;

  return {
    currentPage: readonly(currentPage),
    hasMore: readonly(hasMore),
    loading: readonly(loading),
    loadingMore: readonly(loadingMore),
    reset,
    setPagination,
    startLoad,
    endLoad,
    nextPage,
  };
};
