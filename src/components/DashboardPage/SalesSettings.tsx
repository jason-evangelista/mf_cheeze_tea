import { useRef } from 'react';
import { useOnClickOutside } from 'usehooks-ts';
import Input from '../common/Input';
import Menu from '../common/Menu';

export type SalesSettingsProps = {
  isOpen: boolean;
  handleClose: VoidFunction;
};

const SalesSettings = ({ isOpen, handleClose }: SalesSettingsProps) => {
  const menuRef = useRef<HTMLDivElement>(null);

  useOnClickOutside(menuRef, () => {
    handleClose();
  });

  return (
    <>
      {isOpen && (
        <Menu isOpen={isOpen} ref={menuRef} className="p-3 left-0">
          <h3 className="text-sm font-semibold text-left">Option</h3>
          <Input placeholder="Sales Target" className="text-sm" />
        </Menu>
      )}
    </>
  );
};

export default SalesSettings;
