import type { User, Post, Pagination } from '~/types';

export const useUser = () => {
  const client = useSanctumClient();
  const route = useRoute();
  
  const getUser = async (username: string): Promise<User | null> => {
    try {
      const _user = useSanctumUser<any>();
      if (_user.value?.username === username) {
        return _user.value as User;
      }

      const response = await client(`/api/v1/users/${username}`);
      return response.data?.user ?? null;
    } catch (err) {
      const error = useApiError(err);
      console.log(error.code);
      return null;
    }
  };

  const getUserPosts = async (username: string, page: number = 1): Promise<{ posts: Post[]; pagination: Pagination | null }> => {
    try {
      const response: any = await client(`/api/v1/me/posts?page=${page}`, {
        credentials: "include",
      });
      
      return parseUserPostsResponse(response);
    } catch (err) {
      console.log(err);
      const error = useApiError(err);
      if (error.isValidationError || error.isNotFoundError) {
        throw error.bag;
      }
      return { posts: [], pagination: null };
    }
  };

  const getUserAndPosts = async (username: string, page: number = 1): Promise<{ posts: Post[]; pagination: Pagination | null }> => {
    try {
      const response: any = await client(`/api/v1/users/${username}?posts=include&page=${page}`, {
        credentials: "include",
      });
      
      return parseUserPostsResponse(response);
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

const parseUserPostsResponse = (response: any): { posts: Post[]; pagination: Pagination | null } => {
  let posts: Post[] = [];
  let pagination: Pagination | null = null;

  const data = response?.data;
  if (data) {
    if (data.posts) {
      if (data.posts.data && Array.isArray(data.posts.data)) {
        posts = data.posts.data;
      } else if (Array.isArray(data.posts)) {
        posts = data.posts;
      }
      if (data.posts.current_page) {
        pagination = data.posts;
      }
    }
    if (data.pagination) {
      pagination = data.pagination;
    }
  }

  return { posts, pagination };
};
