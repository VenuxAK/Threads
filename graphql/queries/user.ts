import { USER_FRAGMENT } from '~/graphql/fragments';

/**
 * GraphQL Query operations for user identities and profiles.
 *
 * Retrieves public user details as well as authenticated session data
 * including verified email addresses and creation timestamps.
 */

export const ME_QUERY = `
  ${USER_FRAGMENT}
  query GetMe {
    me {
      ...UserFields
      email
      created_at
    }
  }
`;

export const USER_QUERY = `
  ${USER_FRAGMENT}
  query GetUser($username: String!) {
    user(username: $username) {
      ...UserFields
      created_at
    }
  }
`;
