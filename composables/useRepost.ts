export const useRepost = () => {
  const { post } = useApi();

  const toggleRepost = async (postId: string | number) => {
    const { data, error } = await post<{ reposts_count: number; reposted: boolean }>(
      `/api/v1/posts/${postId}/repost`,
    );
    if (error) return { success: false, error };
    return {
      success: true,
      repostsCount: data!.reposts_count,
      reposted: data!.reposted,
    };
  };

  return { toggleRepost };
};
