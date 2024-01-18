import {ProductCard, Section, Grid} from '~/components';

const mockProducts = {
  nodes: new Array(12).fill(''),
};

/**
 * @param {ProductSwimlaneProps}
 */

export function ProductSwimlane({
  title = 'Featured Products',
  products = mockProducts,
  count = 12,
  ...props
}) {
  //<div className="swimlane hiddenScroll md:pb-8 md:scroll-px-8 lg:scroll-px-12 md:px-8 lg:px-12">

  return (
    <Section heading={title} padding="y" {...props}>
      <Grid items={products.length}>
        {products.nodes.map((product) => (
          <ProductCard
            product={product}
            key={product.id}
            className="snap-start "
          />
        ))}
      </Grid>
    </Section>
  );
}

/**
 * @typedef {HomepageFeaturedProductsQuery & {
 *   title?: string;
 *   count?: number;
 * }} ProductSwimlaneProps
 */

/** @typedef {import('storefrontapi.generated').HomepageFeaturedProductsQuery} HomepageFeaturedProductsQuery */
