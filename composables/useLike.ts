import type { Post } from '~/types';

export const useLike = () => {
  const client = useSanctumClient();

  const likePost = async (postId: string | number) => {
    try {
      const response: any = await client(`/api/v1/posts/${postId}/like`, {
        method: 'POST',
      });
      return {
        success: true,
        likesCount: response.data?.likes_count ?? 0,
        liked: response.data?.liked ?? false,
      };
    } catch (err: any) {
      console.error('Failed to like post:', err);
      return {
        success: false,
        error: err.response?.data?.message || 'Failed to like post',
      };
    }
  };

  return {
    likePost,
  };
};
