import {json} from '@shopify/remix-oxygen';
import {useLoaderData} from '@remix-run/react';
import invariant from 'tiny-invariant';
import {Pagination, getPaginationVariables,flattenConnection} from '@shopify/hydrogen';

import {PageHeader, Section, ProductCard, Grid, Heading, SortFilter} from '~/components';
import {PRODUCT_CARD_FRAGMENT} from '~/data/fragments';
import {getImageLoadingPriority} from '~/lib/const';
import {seoPayload} from '~/lib/seo.server';
import {FILTER_URL_PREFIX} from '~/components/SortFilter';
import {routeHeaders} from '~/data/cache';

const PAGE_BY = 8;

export const headers = routeHeaders;

/**
 * @param {LoaderFunctionArgs}
 */
export async function loader({request, context}) {
  const variables = getPaginationVariables(request, {pageBy: PAGE_BY});
  const searchParams = new URL(request.url).searchParams;
  const {sortKey, reverse} = getSortValuesFromParam(searchParams.get('sort'));
  // const filter = searchParams.get('filter.v.availability')
  let filterAvailability =  searchParams.get('filter.v.availability') === 'true' ? true :  searchParams.get('filter.v.availability') === 'false' ? false : 'both';

const filters = [...searchParams.entries()].reduce(
    (filters, [key, value]) => {
      if (key.startsWith(FILTER_URL_PREFIX)) {
        const filterKey = key.substring(FILTER_URL_PREFIX.length);
        filters.push({
          [filterKey]: JSON.parse(value),
        });
      }
      return filters;
    },
    [],
  );
console.log('filter',filters)

  const {collection, collections} = await context.storefront.query(
    COLLECTION_QUERY,
    {
      variables: {
        ...variables,
        filters,
        sortKey,
        reverse,
        country: context.storefront.i18n.country,
        language: context.storefront.i18n.language,
      },
    },
  );

  const data = await context.storefront.query(ALL_PRODUCTS_QUERY, {
    variables: {
      ...variables,
      filters,
      sortKey,
      reverse,
      country: context.storefront.i18n.country,
      language: context.storefront.i18n.language,
     
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

const allFilterValues = collection.products.filters.flatMap(
    (filter) => filter.values,
  );
console.log('apl',allFilterValues)

const appliedFilters = filters
    .map((filter) => {
      const foundValue = allFilterValues.find((value) => {
        const valueInput = JSON.parse(value.input);
        // special case for price, the user can enter something freeform (still a number, though)
        // that may not make sense for the locale/currency.
        // Basically just check if the price filter is applied at all.
        if (valueInput.price && filter.price) {
          return true;
        }
        return (
          // This comparison should be okay as long as we're not manipulating the input we
          // get from the API before using it as a URL param.
          JSON.stringify(valueInput) === JSON.stringify(filter)
        );
      });
      if (!foundValue) {
        // eslint-disable-next-line no-console
        console.error('Could not find filter value for filter', filter);
        return null;
      }

      if (foundValue.id === 'filter.v.price') {
        // Special case for price, we want to show the min and max values as the label.
        const input = JSON.parse(foundValue.input);
        const min = parseAsCurrency(input.price?.min ?? 0, locale);
        const max = input.price?.max
          ? parseAsCurrency(input.price.max, locale)
          : '';
        const label = min && max ? `${min} - ${max}` : 'Price';

        return {
          filter,
          label,
        };
      }
      return {
        filter,
        label: foundValue.label,
      };
    })
    .filter((filter) => filter !== null);

    
  return json({
    collection,
    appliedFilters,
    allFilterValues,
    collections: flattenConnection(collections),
    products: data.products,
    filters,
    seo,
  });
}


export default function AllProducts() {
  /** @type {LoaderReturnData} */
  const {products,collection,collections, appliedFilters,allFilterValues} = useLoaderData();
  // console.log('price',allFilterValues);
  // console.log('coll', collection.products.edges)

  return (
    <>
      
      <Section>
      
        <Heading format size="copy" className="t-4">
          All Products
        </Heading>
       <SortFilter
          filters={collection.products.filters}
          appliedFilters={appliedFilters}
          products={products}
        >
        </SortFilter>
        <Pagination connection={collection.products}>
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
                  <NextLink className="inline-block rounded font-medium text-center py-3 px-6 border-custom  bg-light w-full">
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

const COLLECTION_QUERY = `#graphql
  query AllProductFilter(
    $country: CountryCode
    $language: LanguageCode
    $filters: [ProductFilter!]
    $sortKey: ProductCollectionSortKeys!
    $reverse: Boolean
    $first: Int
    $last: Int
    $startCursor: String
    $endCursor: String
  ) @inContext(country: $country, language: $language) {
    collection(handle: "womens-dresses") {
      id
      handle
      title
      description
      seo {
        description
        title
      }
      image {
        id
        url
        width
        height
        altText
      }
      products(
        first: $first,
        last: $last,
        before: $startCursor,
        after: $endCursor,
        filters: $filters,
        sortKey: $sortKey,
        reverse: $reverse
      ) {
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
         edges {
        node {
          handle
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
            maxVariantPrice {
              amount
              currencyCode
            }
          }
        }
      }
        nodes {
          ...ProductCard
        }
        pageInfo {
          hasPreviousPage
          hasNextPage
          endCursor
          startCursor
        }
      }
    }
    collections(first: 100) {
      edges {
        node {
          title
          handle
        }
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
    
    default:
      return {
        sortKey: 'RELEVANCE',
        reverse: false,
      };
  }
}

/** @typedef {import('@shopify/remix-oxygen').LoaderFunctionArgs} LoaderFunctionArgs */
/** @typedef {import('@shopify/remix-oxygen').SerializeFrom<typeof loader>} LoaderReturnData */
