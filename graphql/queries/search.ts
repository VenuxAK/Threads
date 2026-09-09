import { POST_FRAGMENT } from '~/graphql/fragments';

/**
 * GraphQL Query operations for searching across users and posts.
 *
 * Supports conditional inclusion of MongoDB posts alongside MySQL user accounts
 * with pagination parameters and matched query echo.
 */

export const SEARCH_QUERY = `
  ${POST_FRAGMENT}
  query Search($keyword: String!, $includePosts: Boolean, $page: Int, $perPage: Int) {
    search(keyword: $keyword, includePosts: $includePosts, page: $page, perPage: $perPage) {
      query
      users {
        ...UserFields
      }
      posts {
        ...PostFields
      }
    }
  }
`;
