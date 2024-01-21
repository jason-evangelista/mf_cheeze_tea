import { UserContext } from '@/providers/AuthProvider';
import Logo from '@/styles/assets/logo.png';
import { NavLink, ThemeIcon } from '@mantine/core';
import {
  IconCoin,
  IconReportAnalytics,
  IconShoppingCart,
  IconUserPlus,
} from '@tabler/icons-react';
import Image from 'next/image';
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
    ...(isSuperUser
      ? [
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
          {
            link: '/manage-user',
            label: 'Manage User',
            icon: <IconUserPlus size={18} />,
          },
        ]
      : [
          {
            link: '/orders',
            label: 'Orders',
            icon: <IconCoin size={18} />,
          },
        ]),
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
      <div className="flex justify-center mt-4">
        <Image
          src={Logo}
          alt="Macee Float Cheeze Tea"
          width={120}
          style={{ objectFit: 'cover' }}
          priority
        />
      </div>
    </nav>
  );
};

export default SalesNavigation;
