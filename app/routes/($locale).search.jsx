import {defer} from '@shopify/remix-oxygen';
import {Await, Form, useLoaderData} from '@remix-run/react';
import {Suspense} from 'react';
import {Pagination, getPaginationVariables} from '@shopify/hydrogen';

import {
  FeaturedCollections,
  Grid,
  Heading,
  Input,
  PageHeader,
  ProductCard,
  ProductSwimlane,
  Section,
  Text,
  IconSearch
} from '~/components';
import {PRODUCT_CARD_FRAGMENT} from '~/data/fragments';
import {getImageLoadingPriority, PAGINATION_SIZE} from '~/lib/const';
import {seoPayload} from '~/lib/seo.server';

import {getFeaturedData} from './($locale).featured-products';

/**
 * @param {LoaderFunctionArgs}
 */
export async function loader({request, context: {storefront}}) {
  const searchParams = new URL(request.url).searchParams;
  const searchTerm = searchParams.get('q');
  const variables = getPaginationVariables(request, {pageBy: 8});

  const {products} = await storefront.query(SEARCH_QUERY, {
    variables: {
      searchTerm,
      ...variables,
      country: storefront.i18n.country,
      language: storefront.i18n.language,
    },
  });

  const shouldGetRecommendations = !searchTerm || products?.nodes?.length === 0;

  const seo = seoPayload.collection({
    url: request.url,
    collection: {
      id: 'search',
      title: 'Search',
      handle: 'search',
      descriptionHtml: 'Search results',
      description: 'Search results',
      seo: {
        title: 'Search',
        description: `Showing ${products.nodes.length} search results for "${searchTerm}"`,
      },
      metafields: [],
      products,
      updatedAt: new Date().toISOString(),
    },
  });

  return defer({
    seo,
    searchTerm,
    products,
    noResultRecommendations: shouldGetRecommendations
      ? getNoResultRecommendations(storefront)
      : Promise.resolve(null),
  });
}

export default function Search() {
  /** @type {LoaderReturnData} */
  const {searchTerm, products, noResultRecommendations} = useLoaderData();
  const noResults = products?.nodes?.length === 0;

  return (
    <>
      <PageHeader className='justify-center'>
        <Heading as="h1" size="copy">
          Search results
        </Heading>
        <Form method="get" className="search-form">
        <div className='relative search-field flex items-center w-full'>
          <Input
            defaultValue={searchTerm}
            name="q"
            placeholder="Search…"
            type="search"
            variant="search"
            className='focus:border-primary/20 dark:focus:border-primary/20 flex-grow'
          />
          <button
            className="absolute right-2 flex items-center justify-center w-5 h-5 focus:ring-primary/5"
            
          >
            <IconSearch/>
          </button>
        </div>  
        </Form>
      </PageHeader>
      {!searchTerm || noResults ? (
        <NoResults
          noResults={noResults}
          recommendations={noResultRecommendations}
        />
      ) : (
        <Section>
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
                  <div className="flex items-center justify-center mt-6">
                    <PreviousLink className="inline-block rounded font-medium text-center py-3 px-6 border border-primary/10 bg-contrast text-primary w-full">
                      {isLoading ? 'Loading...' : 'Previous'}
                    </PreviousLink>
                  </div>
                  <Grid data-test="product-grid">{itemsMarkup}</Grid>
                  <div className="flex items-center justify-center mt-6">
                    <NextLink className="inline-block rounded font-medium text-center py-3 px-6 border border-primary/10 bg-contrast text-primary w-full">
                      {isLoading ? 'Loading...' : 'Next'}
                    </NextLink>
                  </div>
                </>
              );
            }}
          </Pagination>
        </Section>
      )}
    </>
  );
}

/**
 * @param {{
 *   noResults: boolean;
 *   recommendations: Promise<null | FeaturedData>;
 * }}
 */
function NoResults({noResults, recommendations}) {
  return (
    <>
      {noResults && (
        <Section padding="x">
          <span className="opacity-50 text-center">
            No results, try a different search.
          </span>
        </Section>
      )}
      <Suspense>
        <Await
          errorElement="There was a problem loading related products"
          resolve={recommendations}
        >
          {(result) => {
            if (!result) return null;
            const {featuredCollections, featuredProducts} = result;

            return (
              <>
                <FeaturedCollections
                  title="Trending Collections"
                  collections={featuredCollections}
                />
                <ProductSwimlane
                  title="Trending Products"
                  products={featuredProducts}
                />
              </>
            );
          }}
        </Await>
      </Suspense>
    </>
  );
}

/**
 * @param {LoaderFunctionArgs['context']['storefront']} storefront
 */
export function getNoResultRecommendations(storefront) {
  return getFeaturedData(storefront, {pageBy: PAGINATION_SIZE});
}

const SEARCH_QUERY = `#graphql
  query PaginatedProductsSearch(
    $country: CountryCode
    $endCursor: String
    $first: Int
    $language: LanguageCode
    $last: Int
    $searchTerm: String
    $startCursor: String
  ) @inContext(country: $country, language: $language) {
    products(
      first: $first,
      last: $last,
      before: $startCursor,
      after: $endCursor,
      sortKey: RELEVANCE,
      query: $searchTerm
    ) {
      nodes {
        ...ProductCard
      }
      pageInfo {
        startCursor
        endCursor
        hasNextPage
        hasPreviousPage
      }
    }
  }

  ${PRODUCT_CARD_FRAGMENT}
`;

/** @typedef {import('@shopify/remix-oxygen').LoaderFunctionArgs} LoaderFunctionArgs */
/** @typedef {import('./($locale).featured-products').FeaturedData} FeaturedData */
/** @typedef {import('@shopify/remix-oxygen').SerializeFrom<typeof loader>} LoaderReturnData */
