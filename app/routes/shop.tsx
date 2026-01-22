import type {LoaderFunctionArgs, MetaFunction} from '@shopify/hydrogen';
import { Image, Money} from '@shopify/hydrogen';
import {useLoaderData, Link} from 'react-router';
//import { useLoaderData } from 'react-router';
//import { Link } from '@shopify/hydrogen';

import shopStyles from '~/styles/pages/shop.css?url';
import {
  SHOP_COLLECTIONS_QUERY,
  SHOP_PRODUCTS_QUERY,
} from '~/graphql/shop.queries';

export const meta: MetaFunction = () => [
  {title: 'Shop Premium Minerals'},
];

export function links() {
  return [{rel: 'stylesheet', href: shopStyles}];
}

export async function loader({ context }: LoaderFunctionArgs) {
  const { storefront } = context;

  // Hard-coded debug data for now
  const debugData = {
    collections: [
      {
        id: 'debug-collection-1',
        title: 'Debug Collection',
      },
    ],
    products: [
      {
        id: 'debug-product-1',
        title: 'Debug Product',
        description: 'If you see this, the loader works.',
        handle: 'debug-product',
        priceRange: {
          minVariantPrice: {
            amount: '19.99',
            currencyCode: 'USD',
          },
        },
        compareAtPriceRange: {
          minVariantPrice: {
            amount: '29.99',
            currencyCode: 'USD',
          },
        },
        featuredImage: null,
      },
    ],
  };

  try {
    console.log("--- Query Storefront ---");
    // Run both queries in parallel
    const [collectionsResult, productsResult] = await Promise.all([
      storefront.query(SHOP_COLLECTIONS_QUERY),
      storefront.query(SHOP_PRODUCTS_QUERY),
    ]);

    // Extract nodes from GraphQL response
    const collections = collectionsResult.collections?.nodes || [];
    const products = productsResult.products?.nodes || [];

    console.log('--- Collections Result ---');
    //console.log(JSON.stringify(collectionsResult, null, 2));

    console.log('--- Products Result ---');
    //console.log(JSON.stringify(productsResult, null, 2));
    // Return plain object — React Router loader can handle it
    return { collections, products };
  } catch (err) {
    console.error('Error querying storefront:', err);
    // Return empty arrays if query fails so page still renders
    return { collections: [], products: [] };
  }

  // Always return hard-coded data to keep the page functional
  // DxB unreachable
  console.log("--------------- UNREACHABLe ?!?!!?!?");
  return debugData;
}

{/* 
export async function loader({context}: LoaderFunctionArgs) {
  const {storefront} = context;

  const [collectionsResult, productsResult] = await Promise.all([
    storefront.query(SHOP_COLLECTIONS_QUERY),
    storefront.query(SHOP_PRODUCTS_QUERY),
  ]);

  return json({
    collections: collectionsResult.collections.nodes,
    products: productsResult.products.nodes,
  });
}

*/}

export default function ShopPage() {
  const {collections, products} = useLoaderData<typeof loader>();

  return (
    <section className="shop-page">
      {/* Header */}
      <header className="shop-header">
        <h1>Shop Premium Minerals</h1>
        <p>
          Discover our line of minerals designed for purity, potency, and
          performance.
        </p>
      </header>

      {/* Collection Buttons */}
      <div className="collection-buttons">
        {collections.map((collection) => (
          <button key={collection.id} className="collection-button">
            {collection.title}
          </button>
        ))}
      </div>

      {/* Product Grid */}
      <div className="product-grid">
        {products.map((product) => {
          const price = product.priceRange.minVariantPrice;
          const compareAt =
            product.compareAtPriceRange?.minVariantPrice;

          return (
            <article key={product.id} className="product-card">
              {product.featuredImage && (
                <Image
                  data={product.featuredImage}
                  className="product-image"
                  sizes="(min-width: 768px) 300px, 100vw"
                />
              )}

              <h3>{product.title}</h3>
              <p className="product-description">
                {product.description}
              </p>

              {/* Reviews */}
              <div className="product-reviews">
                <div className="stars">★★★★☆</div>
                <span>(128)</span>
              </div>

              {/* Pricing */}
              <div className="product-pricing">
                <Money data={price} />
                {compareAt && (
                  <span className="retail-price">
                    <Money data={compareAt} />
                  </span>
                )}
              </div>

              {/* Promotion */}
              <div className="promo-box">
                <strong>Subscribe & Save 15%</strong>
                <span>$21.24 per delivery</span>
              </div>

              {/* Actions */}
              <div className="product-actions">
                <button className="add-to-cart">🛒 Add to cart</button>
                <button className="buy-now">Buy now</button>
              </div>

              {/* View Details */}
              <Link
                to={`/products/${product.handle}`}
                className="view-details"
              >
                View details
              </Link>
            </article>
          );
        })}
      </div>
    </section>
  );
}
