export const useUser = () => {
  const client = useSanctumClient();
  const route = useRoute();
  
  const getUser = async (username: String) => {
    try {
      const _user = useSanctumUser<any>();
      if (_user.value?.username === username) {
        return _user;
      }

      const response = await client(`/api/v1/users/${username}`);

      return toRef(response.data?.user);
    } catch (err) {
      const error = useApiError(err);
      console.log(error.code);
    }
  };

  const getUserPosts = async (username: String, page: number = 1) => {
    try {
      const response: any = await client(`/api/v1/me/posts?page=${page}`, {
        credentials: "include",
      });
      
      let posts: any[] = [];
      let pagination: any = null;

      const data = response?.data;
      if (data) {
        if (data.posts) {
          if (data.posts.data && Array.isArray(data.posts.data)) {
            posts = data.posts.data;
          } else if (Array.isArray(data.posts)) {
            posts = data.posts;
          }
        }
        pagination = data.pagination;
      }

      return { posts, pagination };
    } catch (err) {
      console.log(err);
      const error = useApiError(err);
      if (error.isValidationError || error.isNotFoundError) {
        throw error.bag;
      }
      return { posts: [], pagination: null };
    }
  };

  const getUserAndPosts = async (username: String, page: number = 1) => {
    try {
      const response: any = await client(`/api/v1/users/${username}?posts=include&page=${page}`, {
        credentials: "include",
      });
      
      let posts: any[] = [];
      let pagination: any = null;

      const data = response?.data;
      if (data) {
        if (data.posts) {
          if (data.posts.data && Array.isArray(data.posts.data)) {
            posts = data.posts.data;
          } else if (Array.isArray(data.posts)) {
            posts = data.posts;
          }
        }
        pagination = data.pagination;
      }

      return { posts, pagination };
    } catch (err) {
      console.log(err);
      const error = useApiError(err);
      if (error.isValidationError || error.isNotFoundError) {
        throw error.bag;
      }
      return { posts: [], pagination: null };
    }
  };

  return {
    getUser,
    getUserPosts,
    getUserAndPosts,
  };
};
