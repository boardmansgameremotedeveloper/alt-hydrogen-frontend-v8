import {useState} from 'react';

import {
  Link,
  useLoaderData,
} from 'react-router';
import type {Route} from './+types/blogs._index';
import { Image, getPaginationVariables} from '@shopify/hydrogen';
import {PaginatedResourceSection} from '~/components/PaginatedResourceSection';
import type {BlogsQuery} from 'storefrontapi.generated';

type BlogNode = BlogsQuery['blogs']['nodes'][0];

export const meta: Route.MetaFunction = () => {
  return [{title: `Hydrogen | Blogs`}];
};

// DxB - Import CSS
import blogStyles from '~/styles/pages/blogs.css?url';
export function links() {
  return [{rel: 'stylesheet', href: blogStyles}];
}

export async function loader(args: Route.LoaderArgs) {
  // Start fetching non-critical data without blocking time to first byte
  const deferredData = loadDeferredData(args);

  // Await the critical data required to render initial state of the page
  const criticalData = await loadCriticalData(args);

  return {...deferredData, ...criticalData};
}

/**
 * Load data necessary for rendering content above the fold. This is the critical data
 * needed to render the page. If it's unavailable, the whole page should 400 or 500 error.
 */
async function loadCriticalData({context, request}: Route.LoaderArgs) {
  const paginationVariables = getPaginationVariables(request, {
    pageBy: 10,
  });

  const [{blogs}] = await Promise.all([
    context.storefront.query(BLOGS_QUERY, {
      variables: {
        ...paginationVariables,
      },
    }),
    // Add other queries here, so that they are loaded in parallel
  ]);


  // Fetch all blog articles for tag extraction
  const ARTICLES_QUERY = `
    query Articles($blogHandle: String!, $first: Int = 20) {
      blog(handle: $blogHandle) {
        articles(first: $first) {
          nodes {
            id
            title
            handle
            tags
            authorV2 {
              name
            }
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

  // For simplicity, just grab the first blog
  const blogHandle = blogs.nodes[0]?.handle;
  let articles: any[] = [];
  let tags: string[] = [];
  if (blogHandle) {
    const res = await context.storefront.query(ARTICLES_QUERY, {variables: {blogHandle}});
    articles = res.blog?.articles?.nodes || [];
    tags = Array.from(new Set(articles.flatMap((a: any) => a.tags || [])));
  }

  console.log("---- Blogs QUERY ---");
  console.log(JSON.stringify(blogs, null, 2));

  console.log("---- Articles QUERY ---");
  console.log(JSON.stringify(articles, null, 2));

  console.log("---- Tags QUERY ---");
  console.log(JSON.stringify(tags, null, 2));


  return {blogs, articles, tags};

  //return {blogs};
}

/**
 * Load data for rendering content below the fold. This data is deferred and will be
 * fetched after the initial page load. If it's unavailable, the page should still 200.
 * Make sure to not throw any errors here, as it will cause the page to 500.
 */
function loadDeferredData({context}: Route.LoaderArgs) {
  return {};
}


export default function Blogs() {
  const {blogs} = useLoaderData<typeof loader>();
  //const {blogs, articles, tags} = useLoaderData<typeof loader>();  

  console.log("---- Here blogs._index.tsx ----");
  console.log(JSON.stringify(blogs, null, 2));

  return (
    <div className="blogs">
      <h1>Blogs</h1>
      <div className="blogs-grid">
        <PaginatedResourceSection<BlogNode> connection={blogs}>
          {({node: blog}) => (
            <Link
              className="blog"
              key={blog.handle}
              prefetch="intent"
              to={`/blogs/${blog.handle}`}
            >
              <h2>{blog.title}</h2>
            </Link>
          )}
        </PaginatedResourceSection>
      </div>
    </div>
  );
}

// NOTE: https://shopify.dev/docs/api/storefront/latest/objects/blog
const BLOGS_QUERY = `#graphql
  query Blogs(
    $country: CountryCode
    $endCursor: String
    $first: Int
    $language: LanguageCode
    $last: Int
    $startCursor: String
  ) @inContext(country: $country, language: $language) {
    blogs(
      first: $first,
      last: $last,
      before: $startCursor,
      after: $endCursor
    ) {
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      nodes {
        title
        handle
        seo {
          title
          description
        }
      }
    }
  }
` as const;
