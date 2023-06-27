import clsx from 'clsx';
import { DetailedHTMLProps, HTMLAttributes, forwardRef } from 'react';

export type MenuProps = {
  isOpen: boolean;
} & DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>;

const Menu = forwardRef<HTMLDivElement, MenuProps>(
  ({ children, isOpen, className }: MenuProps, ref) => {
    const menuClassName = clsx([
      'absolute top-8 left-0 right-0 bg-white shadow-lg rounded-sm w-max p-1 z-10',
      className,
    ]);

    return (
      <>
        {isOpen && (
          <div
            ref={ref}
            className={menuClassName}
            onClick={(e) => e.stopPropagation()}
          >
            {children}
          </div>
        )}
      </>
    );
  }
);

Menu.displayName = 'Menu';

export default Menu;
