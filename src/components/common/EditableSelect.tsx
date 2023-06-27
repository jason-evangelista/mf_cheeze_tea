import clsx from 'clsx';
import {
  DetailedHTMLProps,
  InputHTMLAttributes,
  forwardRef,
  useRef,
  useState,
} from 'react';
import { useOnClickOutside } from 'usehooks-ts';
import Loading from './Loading';

export type OptionItem = {
  value: string;
  label: string;
  id?: string;
};

export type EditableSelectProps = DetailedHTMLProps<
  InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
> & {
  mainContainerClassName?: string;
  activeselecteditem: string;
  loading: boolean;
  label: string;
  data?: { value: string; label: string; id?: string }[];
  // eslint-disable-next-line no-unused-vars
  onItemClick: (value: OptionItem) => void;
  // eslint-disable-next-line no-unused-vars
};

const EditableSelect = forwardRef<HTMLInputElement, EditableSelectProps>(
  (
    {
      mainContainerClassName,
      className,
      data,
      onItemClick,
      loading,
      label,
      ...rest
    },
    ref
  ) => {
    const [isOptionOpen, setIsOptionOpen] = useState(false);
    const optionRef = useRef<HTMLDivElement>(null);

    const _inputClassName = clsx([
      'w-full border p-2 rounded-sm focus:outline-gray-600',
      className,
    ]);

    const _mainContainerClassName = clsx([
      'w-full relative',
      mainContainerClassName,
    ]);

    const optionClassname = clsx([
      'absolute top-13 left-0 right-0 py-2 shadow-md rounded-sm bg-white h-max overflow-hidden overflow-y-auto z-10',
      {
        'max-h-[12rem]': data?.length! > 10,
      },
    ]);

    const optionItemClassName = clsx([
      'py-2 px-3 hover:bg-gray-100 cursor-pointer',
    ]);

    useOnClickOutside(optionRef, () => {
      setIsOptionOpen(false);
    });

    return (
      <div className={_mainContainerClassName}>
        <label className="font-semibold text-sm">{label}</label>
        <input
          ref={ref}
          placeholder="Search for product"
          className={_inputClassName}
          onFocus={() => setIsOptionOpen(true)}
          {...rest}
        />
        {isOptionOpen && (
          <div className={optionClassname} ref={optionRef}>
            {!loading && !data?.length && (
              <p className="text-center">No result.</p>
            )}
            {loading && <Loading label="Fething product" />}
            {!loading &&
              data?.map((item) => {
                return (
                  <div
                    key={item?.id ?? item.value}
                    className={optionItemClassName}
                    onClick={() => {
                      setIsOptionOpen(false);
                      onItemClick(item);
                    }}
                  >
                    {item.label}
                  </div>
                );
              })}
          </div>
        )}
      </div>
    );
  }
);

EditableSelect.displayName = 'ProductSelect';

export default EditableSelect;
