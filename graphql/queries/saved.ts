import { POST_FRAGMENT } from '~/graphql/fragments';

/**
 * GraphQL Query operations for bookmarked and saved threads.
 * Retrieves paginated post documents saved by the authenticated user.
 */

export const MY_SAVED_POSTS_QUERY = `
  ${POST_FRAGMENT}
  query GetMySavedPosts($page: Int, $perPage: Int) {
    mySavedPosts(page: $page, perPage: $perPage) {
      data {
        ...PostFields
      }
      pagination {
        total
        per_page
        current_page
        last_page
        has_more
      }
    }
  }
`;
