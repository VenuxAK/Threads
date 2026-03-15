import type { Post, Pagination } from '~/types';

const parsePostsResponse = (response: any): { posts: Post[]; pagination: Pagination | null } => {
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

export const usePost = () => {
  const client = useSanctumClient();

  const getPosts = async (page: number = 1): Promise<{ posts: Post[]; pagination: Pagination | null }> => {
    try {
      const response: any = await client(`/api/v1/posts?page=${page}`);
      return parsePostsResponse(response);
    } catch (err) {
      console.error('getPosts error:', err);
      return { posts: [], pagination: null };
    }
  };

  const getPost = async (id: string): Promise<Post | null> => {
    try {
      const response: any = await client(`/api/v1/posts/${id}`);
      return response.data?.post ?? response.post ?? null;
    } catch (err) {
      const error = useApiError(err);
      if (error.isNotFoundError) {
        throw createError({
          status: 404,
          statusMessage: "Post Not Found",
        });
      }
      return null;
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
