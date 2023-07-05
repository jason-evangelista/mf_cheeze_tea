import clsx from 'clsx';
import { DetailedHTMLProps, HTMLAttributes, forwardRef } from 'react';

type CardProps = DetailedHTMLProps<
  HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>;

const Card = forwardRef<HTMLInputElement, CardProps>(
  ({ className, children, ...rest }, ref) => {
    const cardClassName = clsx([
      'p-2 rounded-sm bg-green-600 text-white text-center capitalize',
      className,
    ]);

    return (
      <div ref={ref} className={cardClassName} {...rest}>
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

export default Card;
