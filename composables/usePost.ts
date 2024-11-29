export const usePost = () => {
  const client = useSanctumClient();
  const route = useRoute();
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
      const response = await client(
        `/api/v1/users/${route.params.username}?post=${id}`
      );
      console.log(response);

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

  const createComment = async (content: string) => {
    try {
      await client(
        `/api/v1/users/${route.params.username}/posts/${route.params.id}/comments`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: {
            content,
          },
        }
      );
    } catch (err) {
      const error = useApiError(err);
      if (error.bag) {
        console.log(error.bag);
        throw error.bag;
      }
    }
  };

  const createLike = async (post_id: string) => {
    try {
      await client(
        `/api/v1/users/${route.params.username}/posts/${post_id}/likes`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );
    } catch (err) {
      const error = useApiError(err);
      console.log(error.bag);
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
    createComment,
    createLike,
  };
};
