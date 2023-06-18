import clsx from 'clsx';
import {
  DetailedHTMLProps,
  InputHTMLAttributes,
  ReactNode,
  forwardRef,
} from 'react';

type InputProps = DetailedHTMLProps<
  InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
> & {
  labelTitle?: ReactNode;
  errorMessage?: ReactNode;
};

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ labelTitle, errorMessage, ...rest }, ref) => {
    const inputClassName = clsx([
      'border p-2 rounded-sm focus:outline-gray-600',
      {
        'border-red-500 focus:outline-red-500': errorMessage,
      },
    ]);
    return (
      <div className="my-2">
        <label className="font-semibold text-sm block">{labelTitle}</label>
        <input ref={ref} className={inputClassName} {...rest} />
        {errorMessage && (
          <span
            aria-label="error-message"
            className="text-red-600 block text-xs"
          >
            {errorMessage}
          </span>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
