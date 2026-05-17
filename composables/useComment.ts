import type { Comment } from '~/types';

export const useComment = () => {
  const { get, post, del } = useApi();

  const getComments = async (postId: string | number) => {
    const { data, error } = await get<{ comments: Comment[] }>(
      `/api/v1/posts/${postId}/comments`,
    );
    return { data: data?.comments ?? [], error };
  };

  const createComment = async (
    postId: string | number,
    content: string,
    parentId?: string,
  ) => {
    const body: { content: string; parent_id?: string } = { content };
    if (parentId) body.parent_id = parentId;

    const { data, error } = await post<{ comment: Comment }>(
      `/api/v1/posts/${postId}/comments`,
      body,
    );
    return { data: data?.comment ?? null, error };
  };

  const deleteComment = async (commentId: string | number) => {
    return del(`/api/v1/comments/${commentId}`);
  };

  const getReplies = async (commentId: string | number) => {
    const { data, error } = await get<{ replies: Comment[] }>(
      `/api/v1/comments/${commentId}/replies`,
    );
    return { data: data?.replies ?? [], error };
  };

  const getCommentThread = async (commentId: string | number) => {
    const { data, error } = await get<{ thread: Comment[] }>(
      `/api/v1/comments/${commentId}/thread`,
    );
    return { data: data?.thread ?? [], error };
  };

  return { getComments, createComment, deleteComment, getReplies, getCommentThread };
};
