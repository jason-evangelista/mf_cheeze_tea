import Link from 'next/link';
import { useRouter } from 'next/router';

const SalesNavigation = () => {
  const router = useRouter();
  const SALES_NAVIGATION_LINKS: {
    link: string;
    label: string;
  }[] = [
    {
      link: '/dashboard',
      label: 'Dashboard',
    },
    {
      link: '/products/list',
      label: 'Products',
    },
    {
      link: '/orders',
      label: 'Orders',
    },
    {
      link: '/sales-report',
      label: 'Sales Report',
    },
  ];

  return (
    <nav className="flex flex-col gap-2">
      {SALES_NAVIGATION_LINKS.map((item) => (
        <Link key={item.label} legacyBehavior href={item.link}>
          <div
            className={`bg-gray-200 w-32 py-1 px-2 text-sm rounded-sm cursor-pointer relative ${
              router.pathname.includes(item.link)
                ? '!bg-blue-300 transition-all'
                : ''
            } ${
              router.pathname.includes('/products/performance') &&
              item.link === '/products/list'
                ? '!bg-blue-300 transition-all'
                : ''
            }`}
          >
            <p className="text-center z-20">{item.label}</p>
          </div>
        </Link>
      ))}
    </nav>
  );
};

export default SalesNavigation;
