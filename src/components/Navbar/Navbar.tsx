import { UserContext } from '@/providers/AuthProvider';
import { Avatar, Menu, Text } from '@mantine/core';
import { IconLogout } from '@tabler/icons-react';
import jsCookie from 'js-cookie';
import { useContext } from 'react';

const Navbar = () => {
  const user = useContext(UserContext);

  const handleLogout = () => {
    jsCookie.remove(process.env.NEXT_PUBLIC_COOKIE_NAME ?? '');
    window.location.reload();
  };

  return (
    <nav className="flex-1 flex items-center justify-between px-4 text-white bg-orange-500">
      <div aria-label="logo">
        <h1 className="font-bold text-xl">Mf Cheeze Tea</h1>
      </div>
      <div aria-label="user-option-menu">
        <Menu position="left-start">
          <Menu.Target>
            <div className="flex items-center gap-2 cursor-pointer">
              <Avatar src={null} radius="xl" />
              <Text>{user?.username}</Text>
            </div>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Item
              icon={<IconLogout size={20} />}
              onClick={handleLogout}
              component="button"
            >
              Logout
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </div>
    </nav>
  );
};

export default Navbar;
