import clsx from 'clsx';
import {
  ButtonHTMLAttributes,
  DetailedHTMLProps,
  ReactNode,
  forwardRef,
} from 'react';

type ButtonProps = DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
> & {
  btnTitle: ReactNode;
  loading?: boolean;
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, btnTitle, loading, ...rest }, ref) => {
    const buttonClassName = clsx([
      className,
      'text-white p-2 rounded-sm',
      {
        'disabled:brightness-75 flex items-center justify-center': loading,
      },
    ]);
    return (
      <button
        ref={ref}
        className={buttonClassName}
        {...rest}
        disabled={loading}
      >
        {loading ? (
          <div className="border-white border-2 rounded-full border-t-transparent w-4 h-4 animate-spin " />
        ) : (
          btnTitle
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
