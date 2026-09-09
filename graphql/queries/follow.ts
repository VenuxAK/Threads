import { USER_FRAGMENT, POST_FRAGMENT } from '~/graphql/fragments';

/**
 * GraphQL Query operations for user follow graphs and followed post feeds.
 * Standardized across follower/following lists and the customized Following feed.
 */

export const FOLLOWING_FEED_QUERY = `
  ${POST_FRAGMENT}
  query GetFollowingFeed($page: Int, $perPage: Int) {
    followingFeed(page: $page, perPage: $perPage) {
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

export const FOLLOWING_QUERY = `
  ${USER_FRAGMENT}
  query GetFollowing($userId: ID!) {
    following(userId: $userId) {
      ...UserFields
      created_at
    }
  }
`;

export const FOLLOWERS_QUERY = `
  ${USER_FRAGMENT}
  query GetFollowers($userId: ID!) {
    followers(userId: $userId) {
      ...UserFields
      created_at
    }
  }
`;
