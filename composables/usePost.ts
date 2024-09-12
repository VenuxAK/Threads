export const usePost = () => {
  const client = useSanctumClient();

  const getPosts = async () => {
    try {
      const response = await client("/api/v1/posts");
      return response.posts;
    } catch (err) {
      console.log(err);
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

  const createPost = async (content: string) => {
    try {
      await client("/api/v1/posts", {
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
    createPost,
    updatePost,
    deletePost,
  };
};
