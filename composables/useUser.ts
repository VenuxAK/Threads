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
      
      return toRef(response?.user);
    } catch (err) {
      const error = useApiError(err);
      console.log(error.code);
    }
  };

  const getUserPosts = async (username: String) => {
    try {
      const response = await client(`/api/v1/user/posts`, {
        credentials: "include",
      });
      // console.log(response);
      return response.posts;
    } catch (err) {
      console.log(err);
      const error = useApiError(err);
      if (error.isValidationError || error.isNotFoundError) {
        throw error.bag;
      }
    }
  };

  const getUserAndPosts = async (username: String) => {
    try {
      const response = await client(`/api/v1/users/${username}?posts=include`, {
        credentials: "include",
      });
      // console.log(response);
      return response;
    } catch (err) {
      console.log(err);
      const error = useApiError(err);
      if (error.isValidationError || error.isNotFoundError) {
        throw error.bag;
      }
    }
  };

  return {
    getUser,
    getUserPosts,
    getUserAndPosts,
  };
};
