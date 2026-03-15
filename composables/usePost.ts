export const usePost = () => {
  const client = useSanctumClient();

  const getPosts = async (page: number = 1) => {
    try {
      const response: any = await client(`/api/v1/posts?page=${page}`);
      
      let posts: any[] = [];
      let pagination: any = null;

      // The API returns { success: true, data: { posts: { data: [], ... }, pagination: { ... } } }
      // OR { success: true, data: { posts: [], pagination: { ... } } }
      
      const data = response?.data;
      if (data) {
        if (data.posts) {
          // If posts is a paginator object
          if (data.posts.data && Array.isArray(data.posts.data)) {
            posts = data.posts.data;
          } 
          // If posts is directly an array
          else if (Array.isArray(data.posts)) {
            posts = data.posts;
          }
        }
        pagination = data.pagination;
      }

      return { posts, pagination };
    } catch (err) {
      console.error('getPosts error:', err);
      return { posts: [], pagination: null };
    }
  };

  const getPost = async (id: string) => {
    try {
      const response: any = await client(`/api/v1/posts/${id}`);
      return response.data?.post ?? response.post;
    } catch (err) {
      const error = useApiError(err);
      if (error.isNotFoundError) {
        throw createError({
          status: 404,
          statusMessage: "Post Not Found",
        });
      }
    }
  };

  const search = async (search: string, post: boolean = false) => {
    try {
      const response = await client(
        `/api/v1/search${post ? "?posts=include" : ""}`,
        {
          method: "POST",
          body: { keyword: search },
        },
      );

      return response.data;
    } catch (error) {
      console.log(error);
    }
  };

  const createPost = async (content: string) => {
    try {
      await client("/api/v1/me/posts", {
        method: "POST",
        body: { content },
      });
    } catch (err) {
      const error = useApiError(err);
      if (error.isValidationError) {
        throw error.bag;
      }
    }
  };

  const updatePost = async () => {};

  const deletePost = async () => {};

  return {
    getPosts,
    getPost,
    search,
    createPost,
    updatePost,
    deletePost,
  };
};
