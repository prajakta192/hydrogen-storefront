import {useMemo, useState} from 'react';
import {Menu, Disclosure} from '@headlessui/react';
import {
  Link,
  useLocation,
  useSearchParams,
  useNavigate,
} from '@remix-run/react';
import {useDebounce} from 'react-use';

import {Heading, IconFilters, IconCaret, IconXMark, Text,CollectionFilter} from '~/components';
export const FILTER_URL_PREFIX = 'filter.';

/**
 * @param {Props}
 */
export function SortFilter({
  appliedFilters=[],
  filters = [],
  products = [],
  children,
}) {
  const [isOpen, setIsOpen] = useState(false);
  
  // console.log('filter',appliedFilters)
  return (
    <>
      <div className="flex items-center justify-between w-full filterContainer">
        
           <div className="flex flex-col flex-wrap md:flex-row">
          <div>
         <div
          className={`transition-all duration-200 `}
        >
          <FiltersDrawer filters={filters} appliedFilters={appliedFilters} />
        </div>
        </div>
        <div className="flex-1">{children} </div>
      </div>
        <SortMenu />
      </div>
     
    </>
  );
}

/**
 * @param {Omit<Props, 'children'>}
 */
export function FiltersDrawer({filters = [], appliedFilters = []}) {
  const [params] = useSearchParams();
  const location = useLocation();

  const filterMarkup = (filter, option) => {
    switch (filter.type) {
      case 'PRICE_RANGE':
        const priceFilter = params.get(`${FILTER_URL_PREFIX}price`);
        const price = priceFilter ? JSON.parse(priceFilter) : undefined;
        const min = isNaN(Number(price?.min)) ? undefined : Number(price?.min);
        const max = isNaN(Number(price?.max)) ? undefined : Number(price?.max);

        return <PriceRangeFilter min={min} max={max} />;

      default:
        const to = getFilterLink(option.input, params, location);
        return (
          <Link
            className="focus:underline hover:underline"
            prefetch="intent"
            to={to}
          >
            {option.label}
          </Link>
        );
    }
  };

  return (
    <>
         {appliedFilters.length > 0 ? (
          <div>
            <AppliedFilters filters={appliedFilters} />
          </div>
        ) : null}

      <nav className="flex customFilters">
        <Heading as="h4" size="lead">
          Filter By :
        </Heading>
        <div className="divide-y relative z-40">
          {filters.map((filter) => (
            <Disclosure as="div" key={filter.id} className="w-full">
              {({open}) => (
                <>
                  <Disclosure.Button className="flex justify-between w-full px-4">
                    <span className="customFilters">{filter.label}</span>
                    <IconCaret direction={open ? 'up' : 'down'} />
                  </Disclosure.Button>
                  <Disclosure.Panel key={filter.id}>
                    <ul key={filter.id} className="py-2 absolute bg-white left-2 border rounded">
                      {filter.values?.map((option) => {
                        return (
                          <li key={option.id} className="px-2 py-1">
                            {filterMarkup(filter, option)}
                          </li>
                        );
                      })}
                    </ul>
                  </Disclosure.Panel>
                </>
              )}
            </Disclosure>
          ))}
        </div>
      </nav>
      
    </>
  );
}

/**
 * @param {{filters: AppliedFilter[]}}
 */
function AppliedFilters({filters = []}) {
  const [params] = useSearchParams();
  const location = useLocation();
  return (
    <>
      
      <div className="flex flex-wrap gap-2 customFilters pb-4">
        {filters.map((filter) => {
          return (
            <Link
              to={getAppliedFilterLink(filter, params, location)}
              className="flex px-2 border rounded-full gap-2"
              key={`${filter.label}-${JSON.stringify(filter.filter)}`}
            >
              <span className="flex-grow mt-1">{filter.label}</span>
              <span>
                <IconXMark />
              </span>
            </Link>
          );
        })}
      </div>
    </>
  );
}

/**
 * @param {AppliedFilter} filter
 * @param {URLSearchParams} params
 * @param {Location} location
 */
function getAppliedFilterLink(filter, params, location) {
  const paramsClone = new URLSearchParams(params);
  Object.entries(filter.filter).forEach(([key, value]) => {
    const fullKey = FILTER_URL_PREFIX + key;
    paramsClone.delete(fullKey, JSON.stringify(value));
  });
  return `${location.pathname}?${paramsClone.toString()}`;
}

/**
 * @param {SortParam} sort
 * @param {URLSearchParams} params
 * @param {Location} location
 */
function getSortLink(sort, params, location) {
  params.set('sort', sort);
  return `${location.pathname}?${params.toString()}`;
}

/**
 * @param {string | ProductFilter} rawInput
 * @param {URLSearchParams} params
 * @param {Class<useLocation>>} location
 */
function getFilterLink(rawInput, params, location) {
  const paramsClone = new URLSearchParams(params);
   const newParams = filterInputToParams(rawInput, paramsClone);
  return `${location.pathname}?${newParams.toString()}`;
}

const PRICE_RANGE_FILTER_DEBOUNCE = 500;

/**
 * @param {{max?: number; min?: number}}
 */
function PriceRangeFilter({max, min}) {
  const location = useLocation();
  const params = useMemo(
    () => new URLSearchParams(location.search),
    [location.search],
  );
  const navigate = useNavigate();

  const [minPrice, setMinPrice] = useState(min);
  const [maxPrice, setMaxPrice] = useState(max);

  useDebounce(
    () => {
      if (minPrice === undefined && maxPrice === undefined) {
        params.delete(`${FILTER_URL_PREFIX}price`);
        navigate(`${location.pathname}?${params.toString()}`);
        return;
      }

      const price = {
        ...(minPrice === undefined ? {} : {min: minPrice}),
        ...(maxPrice === undefined ? {} : {max: maxPrice}),
      };
      const newParams = filterInputToParams({price}, params);
      navigate(`${location.pathname}?${newParams.toString()}`);
    },
    PRICE_RANGE_FILTER_DEBOUNCE,
    [minPrice, maxPrice],
  );

  const onChangeMax = (event) => {
    const value = event.target.value;
    const newMaxPrice = Number.isNaN(parseFloat(value))
      ? undefined
      : parseFloat(value);
    setMaxPrice(newMaxPrice);
  };

  const onChangeMin = (event) => {
    const value = event.target.value;
    const newMinPrice = Number.isNaN(parseFloat(value))
      ? undefined
      : parseFloat(value);
    setMinPrice(newMinPrice);
  };

  return (
    <div className="flex flex-col">
      <label className="mb-4">
        <span>from</span>
        <input
          name="minPrice"
          className="text-black"
          type="number"
          value={minPrice ?? ''}
          placeholder={'$'}
          onChange={onChangeMin}
        />
      </label>
      <label>
        <span>to</span>
        <input
          name="maxPrice"
          className="text-black"
          type="number"
          value={maxPrice ?? ''}
          placeholder={'$'}
          onChange={onChangeMax}
        />
      </label>
    </div>
  );
}

/**
 * @param {string | ProductFilter} rawInput
 * @param {URLSearchParams} params
 */
function filterInputToParams(rawInput, params) {
  const input = typeof rawInput === 'string' ? JSON.parse(rawInput) : rawInput;

  Object.entries(input).forEach(([key, value]) => {
    if (params.has(`${FILTER_URL_PREFIX}${key}`, JSON.stringify(value))) {
      return;
    }
    if (key === 'price') {
      // For price, we want to overwrite
      params.set(`${FILTER_URL_PREFIX}${key}`, JSON.stringify(value));
    } else {
      params.append(`${FILTER_URL_PREFIX}${key}`, JSON.stringify(value));
    }
  });

  return params;
}

export default function SortMenu() {
  const items = [
    {label: 'Featured', key: 'featured'},
    {
      label: 'Alphabetically A-Z',
      key: 'alphabetically-A-Z',
    },
    {
      label: 'Alphabetically Z-A',
      key: 'alphabetically-Z-A',
    },
    {
      label: 'Price, Low - High',
      key: 'price-low-high',
    },
    {
      label: 'Price, High - Low',
      key: 'price-high-low',
    },
  ];
  const [params] = useSearchParams();
  const location = useLocation();
  const activeItem = items.find((item) => item.key === params.get('sort'));

  return (
    <Menu as="div" className="relative z-40">
      <Menu.Button className="flex items-center">
        <span className="px-3">
          <span className="px-2 customFilters">Sort by :</span>
          <span className='customFilters'>{(activeItem || items[0]).label}</span>
        </span>
        <IconCaret />
      </Menu.Button>

      <Menu.Items
        as="nav"
        className="absolute right-0 flex flex-col p-2 rounded border bg-white"
      >
        {items.map((item) => (
          <Menu.Item key={item.label}>
            {() => (
              <Link
                className={`block text-sm pb-2 px-3 ${
                  activeItem?.key === item.key ? 'font-bold' : 'font-normal'
                }`}
                to={getSortLink(item.key, params, location)}
              >
                {item.label}
              </Link>
            )}
          </Menu.Item>
        ))}
      </Menu.Items>
    </Menu>
  );
}

/**
 * @typedef {{
 *   label: string;
 *   filter: ProductFilter;
 * }} AppliedFilter
 */
/**
 * @typedef {| 'price-low-high'
 *   | 'price-high-low'
 *   | 'best-selling'
 *   | 'newest'
 *   | 'featured'} SortParam
 */
/**
 * @typedef {{
 *   filters: Filter[];
 *   appliedFilters?: AppliedFilter[];
 *   children: React.ReactNode;
 *   collections?: Array<{handle: string; title: string}>;
 * }} Props
 */

/** @typedef {import('react').SyntheticEvent} SyntheticEvent */
/** @typedef {import('@remix-run/react').Location} Location */
/** @typedef {import('@shopify/hydrogen/storefront-api-types').Filter} Filter */
/** @typedef {import('@shopify/hydrogen/storefront-api-types').ProductFilter} ProductFilter */
