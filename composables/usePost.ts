export const usePost = () => {
  const client = useSanctumClient();

  const getPosts = async () => {
    try {
      const response = await client("/api/v1/posts");
      return response.posts;
    } catch (err) {
      const error = useApiError(err);
      // console.log(`Error: ${error.bag}\nCode: ${error.code}` );
      // console.log(err);
    }
  };

  const getPost = async (id: string) => {
    try {
      const response = await client(`/api/v1/posts/${id}`);
      return response.post;
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
        }
      );
      // console.log(response);

      return response;
    } catch (error) {
      console.log(error);
    }
  };

  const createPost = async (content: string) => {
    try {
      await client("/api/v1/user/posts", {
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
