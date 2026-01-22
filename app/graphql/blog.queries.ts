// src/graphql/blog.queries.ts
import {gql} from '@shopify/hydrogen';

export const BLOG_POSTS_QUERY = gql`
  query BlogPosts($handle: String!, $first: Int = 10) {
    blog(handle: $handle) {
      id
      title
      articles(first: $first) {
        nodes {
          id
          title
          handle
          tags
          authorV2 {
            name
          }
          publishedAt
          contentHtml
          image {
            url
            altText
            width
            height
          }
        }
      }
    }
  }
`;
