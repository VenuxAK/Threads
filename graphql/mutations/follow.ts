import { USER_FRAGMENT } from '~/graphql/fragments';

/**
 * GraphQL Mutation operations for following and unfollowing user accounts.
 * Returns updated follower and following counts to drive optimistic client reconciliations.
 */

export const FOLLOW_USER_MUTATION = `
  ${USER_FRAGMENT}
  mutation FollowUser($userId: ID!) {
    followUser(userId: $userId) {
      status
      followers_count
      following_count
      user {
        ...UserFields
      }
    }
  }
`;

export const UNFOLLOW_USER_MUTATION = `
  ${USER_FRAGMENT}
  mutation UnfollowUser($userId: ID!) {
    unfollowUser(userId: $userId) {
      status
      followers_count
      following_count
      user {
        ...UserFields
      }
    }
  }
`;
