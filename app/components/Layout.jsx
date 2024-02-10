import {useParams, Form, Await} from '@remix-run/react';
import {useWindowScroll} from 'react-use';
import {Disclosure} from '@headlessui/react';
import {Suspense, useEffect, useMemo, useState} from 'react';
import {CartForm} from '@shopify/hydrogen';
import {
  Drawer,
  useDrawer,
  Text,
  Input,
  IconLogin,
  IconAccount,
  IconBag,
  IconSearch,
  IconClose,
  Heading,
  IconMenu,
  IconCaret,
  Section,
  CountrySelector,
  Cart,
  CartLoading,
  Link,
Hero} from '~/components';
import {useIsHomePath} from '~/lib/utils';
import {useIsHydrated} from '~/hooks/useIsHydrated';
import {useCartFetchers} from '~/hooks/useCartFetchers';
import {useRootLoaderData} from '~/root';

/**
 * @param {LayoutProps}
 */
export function Layout({children, layout}) {
//console.log('children', children)
  const {headerMenu, footerMenu} = layout || {};
  return (
    <>
      <div className="flex flex-col min-h-screen border-b mainNav">
        <div className="">
          <a href="#mainContent" className="sr-only">
            Skip to content
          </a>
        </div>
        <div id="shopify-section-announcement-bar" className="shopify-section">
            <div className="announcement-bar border-b" role="region" aria-label="Announcement">
            <div className="page-width">
              <p className="announcement-bar__message center py-4">
                  Welcome to our store
              </p>
              </div>
        </div>
        </div>
        {headerMenu && layout?.shop.name && (
          <Header title={layout.shop.name} menu={headerMenu} />
        )}
        <main role="main" id="mainContent" className="flex-grow">
            {children}
        </main>
      </div>
      {footerMenu && <Footer menu={footerMenu} />}
    </>
  );
}

/**
 * @param {{title: string; menu?: EnhancedMenu}}
 */
function Header({title, menu}) {
  const isHome = useIsHomePath();
  const[hidden, setHidden] = useState(false)
  function openSearch() {
    setHidden(!hidden)
  }
  function closeSearch(){
    setHidden(!hidden)
  }

  const {
    isOpen: isCartOpen,
    openDrawer: openCart,
    closeDrawer: closeCart,
  } = useDrawer();

  const {
    isOpen: isMenuOpen,
    openDrawer: openMenu,
    closeDrawer: closeMenu,
  } = useDrawer();

  const addToCartFetchers = useCartFetchers(CartForm.ACTIONS.LinesAdd);

  // toggle cart drawer when adding to cart
  useEffect(() => {
    if (isCartOpen || !addToCartFetchers.length) return;
    openCart();
  }, [addToCartFetchers, isCartOpen, openCart]);

  return (
    <>
      <CartDrawer isOpen={isCartOpen} onClose={closeCart} />
      {menu && (
        <MenuDrawer isOpen={isMenuOpen} onClose={closeMenu} menu={menu} />
      )}
      <DesktopHeader
        isHome={isHome}
        title={title}
        menu={menu}
        openCart={openCart}
        openSearch={openSearch}
        closeSearch={closeSearch}
        hidden={hidden}
      />
      <MobileHeader
        isHome={isHome}
        title={title}
        openCart={openCart}
        openMenu={openMenu}
        openSearch={openSearch}
        closeSearch={closeSearch}
        hidden={hidden}
      />
    </>
  );
}

/**
 * @param {{isOpen: boolean; onClose: () => void}}
 */

function CartDrawer({isOpen, onClose}) {
  const rootData = useRootLoaderData();

  return (
    <Drawer open={isOpen} onClose={onClose} heading="Cart" openFrom="right">
      <div className="grid">
        <Suspense fallback={<CartLoading />}>
          <Await resolve={rootData?.cart}>
            {(cart) => <Cart layout="drawer" onClose={onClose} cart={cart} />}
          </Await>
        </Suspense>
      </div>
    </Drawer>
  );
}

/**
 * @param {{
 *   isOpen: boolean;
 *   onClose: () => void;
 *   menu: EnhancedMenu;
 * }}
 */
export function MenuDrawer({isOpen, onClose, menu}) {
  return (
    <Drawer open={isOpen} onClose={onClose} openFrom="left" heading="Menu">
      <div className="grid">
        <MenuMobileNav menu={menu} onClose={onClose} />
      </div>
    </Drawer>
  );
}

/**
 * @param {{
 *   menu: EnhancedMenu;
 *   onClose: () => void;
 * }}
 */
function MenuMobileNav({menu, onClose}) {
  return (
    <nav className="grid gap-4 p-6 sm:gap-6 sm:px-12 sm:py-8">
      {/* Top level menu items */}
      {(menu?.items || []).map((item) => (
        <span key={item.id} className="block">
          <Link
            to={item.to}
            target={item.target}
            onClick={onClose}
            className={({isActive}) =>
              isActive ? 'pb-1 border-b -mb-px' : 'pb-1'
            }
          >
            <Text as="span" size="copy">
              {item.title}
            </Text>
          </Link>
        </span>
      ))}
    </nav>
  );
}

/**
 * @param {{
 *   title: string;
 *   isHome: boolean;
 *   openCart: () => void;
 *   openMenu: () => void;
 * }}
 */
function MobileHeader({title, isHome, openCart, openMenu,openSearch,closeSearch,hidden}) {
  // useHeaderStyleFix(containerStyle, setContainerStyle, isHome);

  const params = useParams();
/*<header
      role="banner"
      className={`${
        isHome
          ? 'bg-primary/80 light:bg-contrast/60 text-contrast light:text-primary shadow-darkHeader'
          : 'bg-contrast/80 text-primary'
      } flex lg:hidden items-center h-nav sticky backdrop-blur-lg z-40 top-0 justify-between w-full leading-none gap-4 px-4 md:px-8`}
    >
*/
  return (
    <>
    {!hidden &&
    <header
      role="banner"
      className={`${
        isHome
          ? 'light:bg-contrast/60  light:text-primary'
          : 'bg-contrast/80'
      } border-b flex lg:hidden items-center h-nav sticky z-40 top-0 justify-between w-full leading-none gap-4 px-2 md:px-8`}
    >
      <div className="">
        <button
          onClick={openMenu}
          className="flex items-center justify-center w-8 h-8"
        >
          <IconMenu />
        </button>
       
      </div>

      <Link
        className="flex items-center self-stretch leading-[3rem] md:leading-[4rem] justify-center flex-grow w-full h-full"
        to="/"
      >
        <Heading
          className="font-bold text-center leading-none"
          as={isHome ? 'h1' : 'h2'}
        >
          {title}
        </Heading>
      </Link>

      <div className="flex items-center justify-end">
      <button
            className="relative flex items-center justify-center w-8 h-8 focus:ring-primary/5"
            onClick={openSearch}
          >
            <IconSearch />
          </button>
        <AccountLink className="relative flex items-center justify-center w-8 h-8" />
        <CartCount isHome={isHome} openCart={openCart} />
      </div>
    </header>
  }
  {hidden &&
  <div className="flex items-center gap-1 search-modal justify-center py-2 px-2 border-b lg:hidden">
     <Form
          method="get"
          action={params.locale ? `/${params.locale}/search` : '/search'}
          className="items-center gap-2 flex"
        >
          
          <Input
            className={
              isHome
                ? 'focus:border-contrast/20 dark:focus:border-primary/20'
                : 'focus:border-primary/20'
            }
            type="search"
            variant="minisearch"
            placeholder="Search"
            name="q" 
          />
          <button
            type="submit"
            className="relative flex items-center justify-center w-8 h-8"
          >
            <IconSearch />
          </button>
        </Form>
        <button className="relative flex items-center justify-center w-8 h-8 focus:ring-primary/5">
        <IconClose onClick={closeSearch}/>
        </button>
        </div>
}
</>
  );
}

/**
 * @param {{
 *   isHome: boolean;
 *   openCart: () => void;
 *   menu?: EnhancedMenu;
 *   title: string;
 * }}
 */
function DesktopHeader({isHome, menu, openCart, title,openSearch,closeSearch,hidden}) {
  const params = useParams();
  const {y} = useWindowScroll();
  
  return (
   <>
   {!hidden &&
    <header
      role="banner"
      className={`${
        isHome
          ? 'bg-primary/80 light:bg-contrast/60 text-contrast light:text-primary'
          : 'light:bg-contrast/60 light:text-primary'
      } ${
        !isHome && y > 50 && 'shadow-lightHeader'
      } hidden h-nav lg:flex border-b items-center sticky transition duration-300 backdrop-blur-lg z-40 top-0 w-full leading-none px-4 py-8 lg:px-14`}
    >
      <div className="lg:flex gap-12 justify-between items-center w-full">
        <Link className="font-bold" to="/" prefetch="intent">
          {title}
        </Link>
        <nav className="flex gap-12">
          {/* Top level menu items */}
          {(menu?.items || []).map((item) => (
            <Link
              key={item.id}
              to={item.to}
              target={item.target}
              prefetch="intent"
              className={({isActive}) =>
                isActive ? 'pb-1 border-b -mb-px' : 'pb-1'
              }
            >
              {item.title}
            </Link>
          ))}
        </nav>
     <div className="flex items-center gap-1">  
          <button
            className="relative flex items-center justify-center w-8 h-8 focus:ring-primary/5"
            onClick={openSearch}
          >
            <IconSearch />
          </button>
      
        <AccountLink className="relative flex items-center justify-center w-8 h-8 focus:ring-primary/5" />
        <CartCount isHome={isHome} openCart={openCart} />
      </div>
      </div>
    </header>
  }
    { hidden && 
    <div className={`flex items-center gap-1 search-modal border-b justify-center py-8 ${
        !isHome && y > 50 && ' shadow-lightHeader'
      } hidden h-nav lg:flex items-center sticky transition duration-300 backdrop-blur-lg z-40 top-0 w-full leading-none py-4`}>
        <Form
          method="get"
          action={params.locale ? `/${params.locale}/search` : '/search'}
          className="flex items-center"
        >
        
          <Input
            className={
              isHome 
                ? 'focus:border-contrast/20 dark:focus:border-primary/20'
                : 'focus:border-primary/20 '
            }
            type="search"
            variant="minisearch"
            placeholder="Search"
            name="q"
          />

          <button
            className="relative flex items-center justify-center w-8 h-8 focus:ring-primary/5"
            
          >
            <IconSearch/>
          </button>
        </Form>
        <button className="relative flex items-center justify-center w-8 h-8 focus:ring-primary/5">
        <IconClose onClick={closeSearch}/>
        </button>
    </div>
}
    </>
  );
}

/**
 * @param {{className?: string}}
 */
function AccountLink({className}) {
  const rootData = useRootLoaderData();
  const isLoggedIn = rootData?.isLoggedIn;

  return isLoggedIn ? (
    <Link to="/account" className={className}>
      <IconAccount />
    </Link>
  ) : (
    <Link to="/account/login" className={className}>
      <IconLogin />
    </Link>
  );
}

/**
 * @param {{
 *   isHome: boolean;
 *   openCart: () => void;
 * }}
 */
function CartCount({isHome, openCart}) {
  const rootData = useRootLoaderData();

  return (
    <Suspense fallback={<Badge count={0} dark={isHome} openCart={openCart} />}>
      <Await resolve={rootData?.cart}>
        {(cart) => (
          <Badge
            dark={isHome}
            openCart={openCart}
            count={cart?.totalQuantity || 0}
          />
        )}
      </Await>
    </Suspense>
  );
}

/**
 * @param {{
 *   count: number;
 *   dark: boolean;
 *   openCart: () => void;
 * }}
 */
function Badge({openCart, dark, count}) {
  const isHydrated = useIsHydrated();

  const BadgeCounter = useMemo(
    () => (
      <>
        <IconBag />
        <div
          className={`${
            dark
              ? 'text-primary bg-contrast dark:text-contrast dark:bg-primary'
              : 'text-contrast bg-primary'
          } absolute bottom-1 right-1 text-[0.625rem] font-medium subpixel-antialiased h-3 min-w-[0.75rem] flex items-center justify-center leading-none text-center rounded-full w-auto px-[0.125rem] pb-px`}
        >
          <span>{count || 0}</span>
        </div>
      </>
    ),
    [count, dark],
  );

  return isHydrated ? (
    <button
      onClick={openCart}
      className="relative flex items-center justify-center w-8 h-8 focus:ring-primary/5"
    >
      {BadgeCounter}
    </button>
  ) : (
    <Link
      to="/cart"
      className="relative flex items-center justify-center w-8 h-8 focus:ring-primary/5"
    >
      {BadgeCounter}
    </Link>
  );
}

/**
 * @param {{menu?: EnhancedMenu}}
 */
function Footer({menu}) {
  // console.log(menu)
  const isHome = useIsHomePath();
  /*
    const itemsCount = menu
    ? menu?.items?.length + 1 > 4
      ? 4
      : menu?.items?.length + 1
    : [];
  */
  const itemsCount = menu
    ? menu?.items?.length + 1 > 4
      ? 4
      : menu?.items?.length + 1
    : [];

  return (
    <>
    
    <Section
      divider={isHome ? 'none' : 'top'}
      as="footer"
      role="contentinfo"
      style={{border:'1px solid #ececec'}}
      className={`py-8 px-6 md:px-8 lg:px-12 min-h-[20rem] bg-primary light:bg-contrast light:text-primary text-contrast overflow-hidden`}
    >
    <div className={`grid border-b pb-8 items-start grid-flow-row w-full gap-6 md:gap-8 lg:gap-12 grid-cols-1 md:grid-cols-3 lg:grid-cols-${itemsCount}`}>
      <FooterMenu menu={menu} />
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
                  <button type="submit" className="newsletter-form__button field__button lg-field__button" name="commit" id="Subscribe" aria-label="Subscribe">
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
      <CountrySelector />
    </div>
    
      <div
        className={`self-start opacity-50 text-center`}
      >
      <p>
        &copy; {new Date().getFullYear()} / Shopify, Inc. Hydrogen is an MIT
        Licensed Open Source project.
        </p>
      </div>
    </Section>
    </>
  );
}
 
/**
 * @param {{item: ChildEnhancedMenuItem}}
 */
function FooterLink({item}) {
  if (item.to.startsWith('http')) {
    return (
      <a href={item.to} target={item.target} rel="noopener noreferrer">
        {item.title}
      </a>
    );
  }

  return (
    <Link to={item.to} target={item.target} prefetch="intent">
      {item.title}
    </Link>
  );
}

/**
 * @param {{menu?: EnhancedMenu}}
 */
function FooterMenu({menu}) {
  //console.log('footermenu', menu)
  const styles = {
    section: 'grid gap-4',
    nav: 'grid gap-2 pb-6',
  };

  return (
    <>
      <section>
        <Heading className="flex justify-between font-bold" size="lead" as="h3">
          Quik Link
        </Heading>
        <nav className={styles.nav}>
           {(menu?.items || []).map((item) => (
            <Link
              key={item.id}
              to={item.to}
              target={item.target}
              prefetch="intent"
            
            >
           {item.title}
              {item?.items?.length > 0 && (
                <span className="md:hidden">
                  <IconCaret direction={open ? 'up' : 'down'} />
                </span>
              )}
               {item.items.map((subItem) => (
                  <FooterLink key={subItem.id} item={subItem} />
                ))}
            </Link>
))}
        </nav>
      </section>
      <section>
        <Heading className="flex justify-between font-bold" size="lead" as="h3">
         Info
        </Heading>
        <nav className={styles.nav}>
           {(menu?.items || []).map((item) => (
            <Link
              key={item.id}
              to={item.to}
              target={item.target}
              prefetch="intent"
            
            >
           {item.title}
              {item?.items?.length > 0 && (
                <span className="md:hidden">
                  <IconCaret direction={open ? 'up' : 'down'} />
                </span>
              )}
               {item.items.map((subItem) => (
                  <FooterLink key={subItem.id} item={subItem} />
                ))}
            </Link>
))}
        </nav>
      </section>
      <section>
        <Heading className="flex justify-between font-bold" size="lead" as="h3">
         Our mission
        </Heading>
          <p>Share contact information, store details, and brand content with your customers.
          </p>
      </section>
  </>
    
  );
}

/**
 * @typedef {{
 *   children: React.ReactNode;
 *   layout?: LayoutQuery & {
 *     headerMenu?: EnhancedMenu | null;
 *     footerMenu?: EnhancedMenu | null;
 *   };
 * }} LayoutProps
 */

/** @typedef {import('storefrontapi.generated').LayoutQuery} LayoutQuery */
/** @typedef {import('~/lib/utils').EnhancedMenu} EnhancedMenu */
/** @typedef {import('~/lib/utils').ChildEnhancedMenuItem} ChildEnhancedMenuItem */

