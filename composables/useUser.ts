import type { User, Post, Pagination } from '~/types';

const parseUserPostsResponse = (response: any): { posts: Post[]; pagination: Pagination | null } => {
  let posts: Post[] = [];
  let pagination: Pagination | null = null;

  const data = response?.data;
  if (data) {
    if (Array.isArray(data.posts)) {
      posts = data.posts;
    }
    if (data.pagination) {
      pagination = data.pagination;
    }
  }

  return { posts, pagination };
};

export const useUser = () => {
  const { get } = useApi();
  const client = useSanctumClient();

  const getUser = async (username: string): Promise<User | null> => {
    const { data, error } = await get<{ user: User }>(`/api/v1/users/${username}`);
    if (error) return null;
    return data?.user ?? null;
  };

  const getUserPosts = async (username: string, page: number = 1) => {
    try {
      const response: any = await client(`/api/v1/me/posts?page=${page}`);
      return parseUserPostsResponse(response);
    } catch (err) {
      const apiError = useApiError(err);
      if (apiError.isValidationError || apiError.isNotFoundError) {
        throw apiError.bag;
      }
      return { posts: [], pagination: null };
    }
  };

  const getUserAndPosts = async (username: string, page: number = 1) => {
    const { data, error } = await get<{
      user: User;
      posts: Post[];
      pagination: Pagination;
    }>(`/api/v1/users/${username}/posts?page=${page}`);

    if (error) {
      const apiError = useApiError(error);
      if (apiError.isValidationError || apiError.isNotFoundError) {
        throw apiError.bag;
      }
      return { posts: [], pagination: null };
    }

    return {
      posts: data?.posts ?? [],
      pagination: data?.pagination ?? null,
    };
  };

  const getMyReposts = async (page: number = 1) => {
    try {
      const response: any = await client(`/api/v1/me/reposts?page=${page}`);
      return parseUserPostsResponse(response);
    } catch (err) {
      console.error(err);
      return { posts: [], pagination: null };
    }
  };

  const getUserReposts = async (username: string, page: number = 1) => {
    const { data, error } = await get<{
      posts: Post[];
      pagination: Pagination;
    }>(`/api/v1/users/${username}/reposts?page=${page}`);

    if (error) {
      console.error(error);
      return { posts: [], pagination: null };
    }

    return {
      posts: data?.posts ?? [],
      pagination: data?.pagination ?? null,
    };
  };

  return {
    getUser,
    getUserPosts,
    getUserAndPosts,
    getMyReposts,
    getUserReposts,
  };
};
