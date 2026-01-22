export const SHOP_COLLECTIONS_QUERY = `#graphql
  query ShopCollections {
    collections(first: 20) {
      nodes {
        id
        title
        handle
      }
    }
  }
`;

export const SHOP_PRODUCTS_QUERY = `#graphql
  query ShopProducts {
    products(first: 50) {
      nodes {
        id
        title
        handle
        description
        featuredImage {
          url
          altText
          width
          height
        }
        priceRange {
          minVariantPrice {
            amount
            currencyCode
          }
        }
        compareAtPriceRange {
          minVariantPrice {
            amount
            currencyCode
          }
        }
      }
    }
  }
`;
