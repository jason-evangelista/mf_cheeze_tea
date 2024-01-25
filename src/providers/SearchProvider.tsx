import { useDebouncedValue } from '@mantine/hooks';
import {
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  createContext,
  useEffect,
  useState,
} from 'react';

export type TSearchContext = {
  searchKey: string;
  productType: string;
  orderDate: string;
  watchSearcKey: string;
  setSearchKey: Dispatch<SetStateAction<string>>;
  setProductType: Dispatch<SetStateAction<string>>;
  setOrderDate: Dispatch<SetStateAction<string>>;
};
export const SearchContext = createContext<TSearchContext>({
  searchKey: '',
  watchSearcKey: '',
  productType: '',
  orderDate: '',
  setSearchKey() {},
  setProductType() {},
  setOrderDate() {},
});

const SearchProvider = ({ children }: PropsWithChildren) => {
  const [searchKey, setSearchKey] = useState('');
  const [productType, setProductType] = useState('');
  const [orderDate, setOrderDate] = useState('');

  const [debounceSearchKey] = useDebouncedValue(searchKey, 600);

  useEffect(() => {
    console.log({ productType });
  }, [productType]);

  return (
    <SearchContext.Provider
      value={{
        searchKey: debounceSearchKey,
        watchSearcKey: searchKey,
        orderDate,
        productType,
        setSearchKey,
        setProductType,
        setOrderDate,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};

export default SearchProvider;
