import { POST_FRAGMENT } from '~/graphql/fragments';

/**
 * GraphQL Mutation operations for creating, updating, and deleting posts.
 *
 * Successful authoring operations return fully hydrated PostFields,
 * allowing instant insertion into the Pinia posts store.
 */

export const CREATE_POST_MUTATION = `
  ${POST_FRAGMENT}
  mutation CreatePost($content: String!) {
    createPost(content: $content) {
      ...PostFields
    }
  }
`;

export const UPDATE_POST_MUTATION = `
  ${POST_FRAGMENT}
  mutation UpdatePost($id: ID!, $content: String!) {
    updatePost(id: $id, content: $content) {
      ...PostFields
    }
  }
`;

export const DELETE_POST_MUTATION = `
  mutation DeletePost($id: ID!) {
    deletePost(id: $id)
  }
`;
