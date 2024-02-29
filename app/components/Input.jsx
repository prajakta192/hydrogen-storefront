import clsx from 'clsx';

/**
 * @param {{
 *   className?: string;
 *   type?: string;
 *   variant: 'search' | 'minisearch';
 *   [key: string]: any;
 * }}
 */
export function Input({className = '', type, variant, ...props}) {
  const variants = {
    minisearch:
      'bg-transparent  border transition  -mb-px appearance-none px-2 py-2 focus:ring-primary/50 placeholder:opacity-20 placeholder:text-inherit',
  };

  const styles = clsx(variants[variant], className);

  return <input type={type} {...props} className={styles} />;
}

/*
    minisearch:
      'bg-transparent hidden md:inline-block text-left lg:text-right border-b transition border-transparent -mb-px border-x-0 border-t-0 appearance-none px-0 py-1 focus:ring-transparent placeholder:opacity-20 placeholder:text-inherit',
*/