export const useRepost = () => {
  const client = useSanctumClient();

  const toggleRepost = async (postId: string | number) => {
    try {
      const response: any = await client(`/api/v1/posts/${postId}/repost`, {
        method: "POST",
      });
      return {
        success: true,
        repostsCount: response.data?.reposts_count ?? 0,
        reposted: response.data?.reposted ?? false,
      };
    } catch (err: any) {
      console.error("Failed to repost:", err);
      return {
        success: false,
        error: err.response?.data?.message || "Failed to repost",
      };
    }
  };

  return {
    toggleRepost,
  };
};
