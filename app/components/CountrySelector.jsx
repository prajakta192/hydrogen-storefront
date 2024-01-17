import {useFetcher, useLocation} from '@remix-run/react';
import {useCallback, useEffect, useRef} from 'react';
import {useInView} from 'react-intersection-observer';
import clsx from 'clsx';
import {CartForm} from '@shopify/hydrogen';

import {Heading, Button, IconCheck} from '~/components';
import {DEFAULT_LOCALE} from '~/lib/utils';
import {useRootLoaderData} from '~/root';

export function CountrySelector() {
  const fetcher = useFetcher();
  const closeRef = useRef(null);
  const rootData = useRootLoaderData();
  const selectedLocale = rootData?.selectedLocale ?? DEFAULT_LOCALE;
  const {pathname, search} = useLocation();
  const pathWithoutLocale = `${pathname.replace(
    selectedLocale.pathPrefix,
    '',
  )}${search}`;

  const countries = fetcher.data ?? {};
  const defaultLocale = countries?.['default'];
  const defaultLocalePrefix = defaultLocale
    ? `${defaultLocale?.language}-${defaultLocale?.country}`
    : '';

  const {ref, inView} = useInView({
    threshold: 0,
    triggerOnce: true,
  });

  const observerRef = useRef(null);
  useEffect(() => {
    ref(observerRef.current);
  }, [ref, observerRef]);

  // Get available countries list when in view
  useEffect(() => {
    if (!inView || fetcher.data || fetcher.state === 'loading') return;
    fetcher.load('/api/countries');
  }, [inView, fetcher]);

  const closeDropdown = useCallback(() => {
    closeRef.current?.removeAttribute('open');
  }, []);

  return (
    <>
    {/*<section className="md:col-span-3 lg:col-span">*/}
    <section>
    <div className="footer-block--newsletter">
      <div className="footer-block__newsletter">
          <h2 className="footer-block__heading font-bold">Subscribe to our emails</h2>
          <form method="post" action="/contact#ContactFooter" id="ContactFooter" acceptCharset="UTF-8" className="footer__newsletter newsletter-form">
              <div className="newsletter-form__field-wrapper">
                  <div className="field">
                  <input id="NewsletterForm--footer" type="email" name="contact[email]" className="field__input"  aria-required="true" autoCorrect="off" autoCapitalize="none" autoComplete="email" placeholder="Email" required=""/>
                  <label className="field__label" htmlFor="NewsletterForm--footer">
                      
                  </label>
                  <button type="submit" className="newsletter-form__button field__button" name="commit" id="Subscribe" aria-label="Subscribe">
                  <svg viewBox="0 0 14 10" fill="none" aria-hidden="true" focusable="false" role="presentation" className="icon icon-arrow" xmlns="http://www.w3.org/2000/svg">
                     <path fillRule="evenodd" clipRule="evenodd" d="M8.537.808a.5.5 0 01.817-.162l4 4a.5.5 0 010 .708l-4 4a.5.5 0 11-.708-.708L11.793 5.5H1a.5.5 0 010-1h10.793L8.646 1.354a.5.5 0 01-.109-.546z" fill="currentColor"></path>
                  </svg>
               </button>
                  </div>
              </div>
          </form>
      </div>
  </div>
    </section>
    {/*<section
      ref={observerRef}
      className="md:col-span-2 lg:col-span"
      onMouseLeave={closeDropdown}
    >*/}
    <section
      ref={observerRef}
      onMouseLeave={closeDropdown}
    >
      <Heading size="lead" className="cursor-default font-bold" as="h2">
        Country/region
      </Heading>
      <div className="relative">
        <details
          className="absolute w-full border rounded border-contrast/30 dark:border-white open:round-b-none overflow-clip"
          ref={closeRef}
        >
          <summary className="flex items-center justify-between w-full py-3 cursor-pointer">
            {selectedLocale.label}
          </summary>
          <div className="w-full overflow-auto border-t border-contrast/30 dark:border-white bg-contrast/30 max-h-36">
            {countries &&
              Object.keys(countries).map((countryPath) => {
                const countryLocale = countries[countryPath];
                const isSelected =
                  countryLocale.language === selectedLocale.language &&
                  countryLocale.country === selectedLocale.country;

                const countryUrlPath = getCountryUrlPath({
                  countryLocale,
                  defaultLocalePrefix,
                  pathWithoutLocale,
                });

                return (
                  <Country
                    key={countryPath}
                    closeDropdown={closeDropdown}
                    countryUrlPath={countryUrlPath}
                    isSelected={isSelected}
                    countryLocale={countryLocale}
                  />
                );
              })}
          </div>
        </details>
      </div>
    </section>
    </>
  );
}

/**
 * @param {{
 *   closeDropdown: () => void;
 *   countryLocale: Locale;
 *   countryUrlPath: string;
 *   isSelected: boolean;
 * }}
 */
function Country({closeDropdown, countryLocale, countryUrlPath, isSelected}) {
  return (
    <ChangeLocaleForm
      key={countryLocale.country}
      redirectTo={countryUrlPath}
      buyerIdentity={{
        countryCode: countryLocale.country,
      }}
    >
      <Button
        className={clsx([
          'text-contrast dark:text-primary',
          'bg-primary dark:bg-contrast w-full p-2 transition rounded flex justify-start',
          'items-center text-left cursor-pointer py-2 px-4',
        ])}
        type="submit"
        variant="primary"
        onClick={closeDropdown}
      >
        {countryLocale.label}
        {isSelected ? (
          <span className="ml-2">
            <IconCheck />
          </span>
        ) : null}
      </Button>
    </ChangeLocaleForm>
  );
}

/**
 * @param {{
 *   children: React.ReactNode;
 *   buyerIdentity: CartBuyerIdentityInput;
 *   redirectTo: string;
 * }}
 */
function ChangeLocaleForm({children, buyerIdentity, redirectTo}) {
  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.BuyerIdentityUpdate}
      inputs={{
        buyerIdentity,
      }}
    >
      <>
        <input type="hidden" name="redirectTo" value={redirectTo} />
        {children}
      </>
    </CartForm>
  );
}

/**
 * @param {{
 *   countryLocale: Locale;
 *   pathWithoutLocale: string;
 *   defaultLocalePrefix: string;
 * }}
 */
function getCountryUrlPath({
  countryLocale,
  defaultLocalePrefix,
  pathWithoutLocale,
}) {
  let countryPrefixPath = '';
  const countryLocalePrefix = `${countryLocale.language}-${countryLocale.country}`;

  if (countryLocalePrefix !== defaultLocalePrefix) {
    countryPrefixPath = `/${countryLocalePrefix.toLowerCase()}`;
  }
  return `${countryPrefixPath}${pathWithoutLocale}`;
}

/** @typedef {import('@shopify/hydrogen/storefront-api-types').CartBuyerIdentityInput} CartBuyerIdentityInput */
/** @typedef {import('~/lib/type').Localizations} Localizations */
/** @typedef {import('~/lib/type').Locale} Locale */
