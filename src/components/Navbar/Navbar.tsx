import useToggleContainer from '@/hooks/useToggleContainer';
import { UserContext } from '@/providers/AuthProvider';
import { IconUser } from '@tabler/icons-react';
import jsCookie from 'js-cookie';
import { useContext } from 'react';
import Button from '../common/Button';
import Menu from '../common/Menu';
const Navbar = () => {
  const user = useContext(UserContext);

  const { handleToggle, isOpen } = useToggleContainer();

  const handleLogout = () => {
    jsCookie.remove(process.env.NEXT_PUBLIC_COOKIE_NAME ?? '');
    window.location.reload();
  };

  return (
    <nav className="flex-1 flex items-center justify-between px-4 text-white">
      <div aria-label="logo">
        <h1 className="font-bold text-xl">Mf Cheeze Tea</h1>
      </div>
      <div aria-label="user-option-menu" className="flex items-center gap-2">
        <div
          className="bg-gray-700 rounded-full w-8 h-8 relative flex items-center justify-center cursor-pointer"
          onClick={handleToggle}
        >
          <IconUser color="white" />
          <Menu isOpen={isOpen} key="user-option-menu">
            <div className="text-sm flex flex-col">
              <Button
                btnTitle="Settings"
                className="!text-black hover:bg-gray-200 px-4"
              />
              <Button
                btnTitle="Log out"
                className="!text-black hover:bg-gray-200 px-4"
                onClick={handleLogout}
              />
            </div>
          </Menu>
        </div>
        <p>{user?.username}</p>
      </div>
    </nav>
  );
};

export default Navbar;
