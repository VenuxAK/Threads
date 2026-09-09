import { POST_FRAGMENT } from '~/graphql/fragments';

/**
 * GraphQL Query operations for post feeds and profiles.
 *
 * Each query requests standardized PostFields and pagination information,
 * matching the backend PostPaginator type definition.
 */

export const FEED_QUERY = `
  ${POST_FRAGMENT}
  query GetFeed($page: Int, $perPage: Int) {
    feed(page: $page, perPage: $perPage) {
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

export const SINGLE_POST_QUERY = `
  ${POST_FRAGMENT}
  query GetPost($id: ID!) {
    post(id: $id) {
      ...PostFields
    }
  }
`;

export const MY_POSTS_QUERY = `
  ${POST_FRAGMENT}
  query GetMyPosts($page: Int, $perPage: Int) {
    myPosts(page: $page, perPage: $perPage) {
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

export const MY_REPOSTS_QUERY = `
  ${POST_FRAGMENT}
  query GetMyReposts($page: Int, $perPage: Int) {
    myReposts(page: $page, perPage: $perPage) {
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

export const USER_POSTS_QUERY = `
  ${POST_FRAGMENT}
  query GetUserPosts($username: String!, $page: Int, $perPage: Int) {
    userPosts(username: $username, page: $page, perPage: $perPage) {
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

export const USER_REPOSTS_QUERY = `
  ${POST_FRAGMENT}
  query GetUserReposts($username: String!, $page: Int, $perPage: Int) {
    userReposts(username: $username, page: $page, perPage: $perPage) {
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

export const MY_LIKED_POSTS_QUERY = `
  ${POST_FRAGMENT}
  query GetMyLikedPosts($page: Int, $perPage: Int) {
    myLikedPosts(page: $page, perPage: $perPage) {
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
