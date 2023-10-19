import { UserContext } from '@/providers/AuthProvider';
import { NavLink, ThemeIcon } from '@mantine/core';
import {
  IconCoin,
  IconReportAnalytics,
  IconShoppingCart,
  IconUserPlus,
} from '@tabler/icons-react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ReactNode, useContext } from 'react';

const SalesNavigation = () => {
  const user = useContext(UserContext);
  const isSuperUser = user?.account_type === 'SUPER';
  const router = useRouter();
  const SALES_NAVIGATION_LINKS: {
    link: string;
    label: string;
    icon: ReactNode;
  }[] = [
    {
      link: '/dashboard',
      label: 'Dashboard',
      icon: <IconReportAnalytics size={18} />,
    },
    {
      link: '/products/list',
      label: 'Products',
      icon: <IconShoppingCart size={18} />,
    },
    {
      link: '/orders',
      label: 'Orders',
      icon: <IconCoin size={18} />,
    },
    ...(isSuperUser
      ? [
          {
            link: '/manage-user',
            label: 'Manage User',
            icon: <IconUserPlus size={18} />,
          },
        ]
      : []),
  ];

  return (
    <nav className="flex flex-col gap-2">
      {SALES_NAVIGATION_LINKS.map((item) => (
        <Link key={item.label} legacyBehavior href={item.link} passHref>
          <NavLink
            active={router.pathname.includes(item.link)}
            icon={
              <ThemeIcon variant="light" radius="sm">
                {item.icon}
              </ThemeIcon>
            }
            label={item.label}
            className="font-semibold"
          />
        </Link>
      ))}
    </nav>
  );
};

export default SalesNavigation;
