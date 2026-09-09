/**
 * GraphQL Client Composable for Nuxt 4.
 *
 * Built directly on top of `useSanctumClient()`, this composable sends GraphQL
 * operations to `/graphql` while automatically attaching CSRF tokens (`X-XSRF-TOKEN`)
 * and session credentials (`credentials: 'include'`). It provides strong TypeScript
 * generic typing for query and mutation results, and standardizes error responses.
 */
export const useGraphQL = () => {
  const client = useSanctumClient();

  /**
   * Executes a GraphQL Query or Mutation request against the Laravel Lighthouse server.
   *
   * @template T The expected data payload shape matching the GraphQL operation.
   * @param query The GraphQL operation document string.
   * @param variables Optional variables dictionary passed to the GraphQL executor.
   * @returns An object containing the typed data payload and any error message.
   */
  const request = async <T>(
    query: string,
    variables?: Record<string, any>,
  ): Promise<{ data: T | null; error: string | null }> => {
    try {
      const response: any = await client('/graphql', {
        method: 'POST',
        body: {
          query,
          variables: variables || {},
        },
      });

      // Handle GraphQL-level execution errors (e.g., validation, syntax, or unauthorized)
      if (response?.errors && response.errors.length > 0) {
        const primaryError = response.errors[0];
        const errorMessage = primaryError?.message || 'GraphQL operation failed';
        return { data: null, error: errorMessage };
      }

      return { data: response?.data as T, error: null };
    } catch (err: any) {
      // Capture HTTP or network-level errors returned by the server or WAF
      const message =
        err?.response?.data?.errors?.[0]?.message ||
        err?.response?.data?.message ||
        err?.message ||
        'Network error during GraphQL request';

      return { data: null, error: message };
    }
  };

  /**
   * Convenience alias for executing queries.
   */
  const query = <T>(queryDoc: string, variables?: Record<string, any>) => {
    return request<T>(queryDoc, variables);
  };

  /**
   * Convenience alias for executing mutations.
   */
  const mutate = <T>(mutationDoc: string, variables?: Record<string, any>) => {
    return request<T>(mutationDoc, variables);
  };

  return { request, query, mutate };
};
