import {json} from '@shopify/remix-oxygen';
import {useLoaderData} from '@remix-run/react';
import invariant from 'tiny-invariant';
import {Pagination, getPaginationVariables} from '@shopify/hydrogen';

import {PageHeader, Section, ProductCard, Grid, Heading, SortFilter,CollectionFilter} from '~/components';
import {PRODUCT_CARD_FRAGMENT} from '~/data/fragments';
import {getImageLoadingPriority} from '~/lib/const';
import {seoPayload} from '~/lib/seo.server';
import {FILTER_URL_PREFIX} from '~/components/SortFilter';
import {routeHeaders} from '~/data/cache';

const PAGE_BY = 8;
// let sortKey = 'TITLE';

// let reverse = false;

export const headers = routeHeaders;

/**
 * @param {LoaderFunctionArgs}
 */

export async function loader({ request, context: {storefront}}) {
  const variables = getPaginationVariables(request, {pageBy: PAGE_BY});
  const searchParams = new URL(request.url).searchParams;
  const {sortKey, reverse} = getSortValuesFromParam(searchParams.get('sort'));
  const filters = true;
  
console.log('filter',filters)

  const data = filters ? await storefront.query(ALL_PRODUCTS_AVAILABILITY_QUERY, {
    variables: {
      ...variables,
      sortKey,
      reverse,
      country: storefront.i18n.country,
      language: storefront.i18n.language,
     
    },
  })
  :
  await storefront.query(ALL_PRODUCTS_QUERY, {
    variables: {
      ...variables,
      sortKey,
      reverse,
      country: storefront.i18n.country,
      language: storefront.i18n.language,
     
    },
  })
  invariant(data, 'No data returned from Shopify API');

  const seo = seoPayload.collection({
    url: request.url,
    collection: {
      id: 'all-products',
      title: 'All Products',
      handle: 'products',
      descriptionHtml: 'All the store products',
      description: 'All the store products',
      seo: {
        title: 'All Products',
        description: 'All the store products',
      },
      metafields: [],
      products: data.products,
      updatedAt: '',
    },
  });


  return json({
    products: data.products,
    seo,
  });
  
}

export default function AllProducts() {
  /** @type {LoaderReturnData} */
  const {products} = useLoaderData();
  console.log('products',products)
  return (
    <>
      
      <Section>
      
        <Heading format size="copy" className="t-4">
          All Products
        </Heading>
        <CollectionFilter/>
       <SortFilter
          products={products}
        >
        </SortFilter>
        <Pagination connection={products}>
          {({nodes, isLoading, NextLink, PreviousLink}) => {
            const itemsMarkup = nodes.map((product, i) => (
              <ProductCard
                key={product.id}
                product={product}
                loading={getImageLoadingPriority(i)}
              />
            ));

            return (
              <>
                {/*<div className="flex items-center justify-center mt-6">
                  <PreviousLink className="inline-block rounded font-medium text-center py-3 px-6 border border-primary/10 bg-contrast text-primary w-full">
                    {isLoading ? 'Loading...' : 'Previous'}
                  </PreviousLink>
                </div>*/}
                <Grid data-test="product-grid">{itemsMarkup}</Grid>
                
                <div className="flex items-center justify-center mt-6">
                  <NextLink className="inline-block rounded font-medium text-center py-3 px-6 border-custom  bg-light text-contrast w-full">
                    {isLoading ? 'Loading...' : 'Next'}
                  </NextLink>
                </div>
              </>
            );
          }}
        </Pagination>
      </Section>
    </>
  );
}


const ALL_PRODUCTS_QUERY = `#graphql
  query AllProducts(
    $country: CountryCode
    $language: LanguageCode
    $first: Int
    $last: Int
    $startCursor: String
    $endCursor: String
    $sortKey : ProductSortKeys
    $reverse: Boolean
  ) @inContext(country: $country, language: $language) {
    products(first: $first, last: $last, before: $startCursor, after: $endCursor,
      sortKey : $sortKey, reverse : $reverse) {
     filters {
        id
        label
        type
        values {
          id
          label
          count
          input
        }
      }
      nodes {
        ...ProductCard
      }
      pageInfo {
        hasPreviousPage
        hasNextPage
        startCursor
        endCursor
      }
    }
    }
  ${PRODUCT_CARD_FRAGMENT}
`;

const ALL_PRODUCTS_AVAILABILITY_QUERY = `#graphql
  query AllProducts(
    $country: CountryCode
    $language: LanguageCode
    $first: Int
    $last: Int
    $startCursor: String
    $endCursor: String
    $sortKey : ProductSortKeys
    $reverse: Boolean
  ) @inContext(country: $country, language: $language) {
    products(first: $first,filters: { available: true}, last: $last, before: $startCursor, after: $endCursor,
      sortKey : $sortKey, reverse : $reverse) {
     
      nodes {
        ...ProductCard
      }
      pageInfo {
        hasPreviousPage
        hasNextPage
        startCursor
        endCursor
      }
    }
    }
  ${PRODUCT_CARD_FRAGMENT}
`;
function getSortValuesFromParam(sortParam) {
  switch (sortParam) {
    case 'featured':
      return {
        sortKey: 'RELEVANCE',
        reverse: false,
      };
    case 'alphabetically-A-Z':
      return {
        sortKey: 'TITLE',
        reverse: false,
      };
      case 'alphabetically-Z-A':
      return {
        sortKey: 'TITLE',
        reverse: true,
      };
    case 'price-high-low':
      return {
        sortKey: 'PRICE',
        reverse: true,
      };
    case 'price-low-high':
      return {
        sortKey: 'PRICE',
        reverse: false,
      };
    case 'best-selling':
      return {
        sortKey: 'BEST_SELLING',
        reverse: false,
      };
    case 'newest':
      return {
        sortKey: 'CREATED_AT',
        reverse: false,
      };
    default:
      return {
        sortKey: 'RELEVANCE',
        reverse: false,
      };
  }
}

/** @typedef {import('@shopify/remix-oxygen').LoaderFunctionArgs} LoaderFunctionArgs */
/** @typedef {import('@shopify/remix-oxygen').SerializeFrom<typeof loader>} LoaderReturnData */
