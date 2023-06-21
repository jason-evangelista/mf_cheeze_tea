import Link from 'next/link';
import { useRouter } from 'next/router';

const PRODUCTS_TABS: { link: string; label: string }[] = [
  {
    label: 'Product List',
    link: '/products/list',
  },
  {
    label: 'Product Performance',
    link: '/products/performance',
  },
];

const ProductTabs = () => {
  const router = useRouter();

  return (
    <nav className="flex items-center gap-4 mb-2">
      {PRODUCTS_TABS.map((item) => (
        <Link key={item.label} legacyBehavior href={item.link}>
          <div className="relative cursor-pointer hover:bg-gray-100 p-1 rounded-sm transition-all">
            <div
              className={`h-[4px] text-sm rounded-sm cursor-pointer absolute -bottom-[2px] w-full left-0 right-0 ${
                router.pathname.includes(item.link)
                  ? '!bg-blue-300 transition-all'
                  : ''
              }`}
            ></div>
            <p className="text-center z-20 text-sm">{item.label}</p>
          </div>
        </Link>
      ))}
    </nav>
  );
};

export default ProductTabs;
