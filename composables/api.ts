export const useApi = () => {
  const client = useSanctumClient();

  const get = async <T>(
    url: string,
  ): Promise<{ data: T | null; error: string | null }> => {
    try {
      const response: any = await client(url);
      return { data: (response?.data ?? response) as T, error: null };
    } catch (err: any) {
      return {
        data: null,
        error:
          err.response?.data?.message ||
          err.message ||
          "Request failed",
      };
    }
  };

  const post = async <T>(
    url: string,
    body?: Record<string, any>,
  ): Promise<{ data: T | null; error: string | null }> => {
    try {
      const response: any = await client(url, { method: "POST", body });
      return { data: (response?.data ?? response) as T, error: null };
    } catch (err: any) {
      return {
        data: null,
        error:
          err.response?.data?.message ||
          err.response?.data?.errors?.content?.[0] ||
          err.message ||
          "Request failed",
      };
    }
  };

  const del = async (
    url: string,
  ): Promise<{ success: boolean; error: string | null }> => {
    try {
      await client(url, { method: "DELETE" });
      return { success: true, error: null };
    } catch (err: any) {
      return {
        success: false,
        error:
          err.response?.data?.message ||
          err.message ||
          "Request failed",
      };
    }
  };

  return { get, post, del };
};
