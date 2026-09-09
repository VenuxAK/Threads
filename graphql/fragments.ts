/**
 * Shared GraphQL fragments for ThreadsApp frontend.
 *
 * Fragments define consistent field selection sets across multiple queries and mutations,
 * guaranteeing uniform type hydration across feeds, profiles, and comment dialogs.
 */

export const USER_FRAGMENT = `
  fragment UserFields on User {
    id
    name
    username
    avatar
    bio
  }
`;

export const POST_FRAGMENT = `
  ${USER_FRAGMENT}
  fragment PostFields on Post {
    id
    content
    tags
    published_at
    edited_at
    likes
    comments
    reposts
    is_liked
    is_reposted
    interactions {
      likes
      comments
      shares
      reposts
    }
    author {
      ...UserFields
    }
  }
`;

export const COMMENT_FRAGMENT = `
  ${USER_FRAGMENT}
  fragment CommentFields on Comment {
    id
    content
    post_id
    parent_id
    created_at
    reply_count
    replying_to {
      username
    }
    author {
      ...UserFields
    }
  }
`;
