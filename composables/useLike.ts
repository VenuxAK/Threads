export const useLike = () => {
  const { post } = useApi();

  const likePost = async (postId: string | number) => {
    const { data, error } = await post<{ likes_count: number; liked: boolean }>(
      `/api/v1/posts/${postId}/like`,
    );
    if (error) return { success: false, error };
    return {
      success: true,
      likesCount: data!.likes_count,
      liked: data!.liked,
    };
  };

  return { likePost };
};
