import type { Post, Pagination } from '~/types';

const parsePostsResponse = (response: any): { posts: Post[]; pagination: Pagination | null } => {
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

export const usePost = () => {
  const { get, post } = useApi();
  const client = useSanctumClient();

  const getPosts = async (page: number = 1) => {
    try {
      const response: any = await client(`/api/v1/posts?page=${page}`);
      return parsePostsResponse(response);
    } catch (err) {
      console.error('getPosts error:', err);
      return { posts: [], pagination: null };
    }
  };

  const getPost = async (id: string): Promise<Post | null> => {
    const { data, error } = await get<{ post: Post }>(`/api/v1/posts/${id}`);
    if (error) {
      const apiError = useApiError(error);
      if (apiError.isNotFoundError) {
        throw createError({ status: 404, statusMessage: "Post Not Found" });
      }
      return null;
    }
    return data?.post ?? null;
  };

  const search = async (search: string, includePosts: boolean = false) => {
    try {
      const response = await client(
        `/api/v1/search${includePosts ? "?posts=include" : ""}`,
        { method: "POST", body: { keyword: search } },
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
      const apiError = useApiError(err);
      if (apiError.isValidationError) {
        throw apiError.bag;
      }
    }
  };

  return { getPosts, getPost, search, createPost };
};
