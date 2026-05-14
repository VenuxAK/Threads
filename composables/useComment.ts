import type { Comment } from '~/types';

export const useComment = () => {
  const client = useSanctumClient();

  const getComments = async (postId: string | number): Promise<{data: Comment[]; error: string | null}> => {
    try {
      const response: any = await client(`/api/v1/posts/${postId}/comments`);
      return { data: response.data?.comments ?? [], error: null };
    } catch (err: any) {
      console.error('Failed to fetch comments:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch comments';
      return { data: [], error: errorMessage };
    }
  };

  const createComment = async (postId: string | number, content: string, parentId?: string): Promise<{data: Comment | null; error: string | null}> => {
    try {
      const body: { content: string; parent_id?: string } = { content };
      if (parentId) {
        body.parent_id = parentId;
      }

      const response: any = await client(`/api/v1/posts/${postId}/comments`, {
        method: 'POST',
        body,
      });
      return { data: response.data?.comment ?? null, error: null };
    } catch (err: any) {
      console.error('Failed to create comment:', err);
      const errorMessage = err.response?.data?.message || err.response?.data?.errors?.content?.[0] || err.message || 'Failed to create comment';
      return { data: null, error: errorMessage };
    }
  };

  const deleteComment = async (commentId: string | number): Promise<{success: boolean; error: string | null}> => {
    try {
      await client(`/api/v1/comments/${commentId}`, {
        method: 'DELETE',
      });
      return { success: true, error: null };
    } catch (err: any) {
      console.error('Failed to delete comment:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Failed to delete comment';
      return { success: false, error: errorMessage };
    }
  };

  const getReplies = async (commentId: string | number): Promise<{data: Comment[]; error: string | null}> => {
    try {
      const response: any = await client(`/api/v1/comments/${commentId}/replies`);
      return { data: response.data?.replies ?? [], error: null };
    } catch (err: any) {
      console.error('Failed to fetch replies:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch replies';
      return { data: [], error: errorMessage };
    }
  };

  /** Full flat thread (all nested levels) under one top-level comment */
  const getCommentThread = async (commentId: string | number): Promise<{ data: Comment[]; error: string | null }> => {
    try {
      const response: any = await client(`/api/v1/comments/${commentId}/thread`);
      return { data: response.data?.thread ?? [], error: null };
    } catch (err: any) {
      console.error('Failed to fetch comment thread:', err);
      const errorMessage =
        err.response?.data?.message || err.message || 'Failed to fetch comment thread';
      return { data: [], error: errorMessage };
    }
  };

  return {
    getComments,
    createComment,
    deleteComment,
    getReplies,
    getCommentThread,
  };
};
