import { useDebouncedValue } from '@mantine/hooks';
import {
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  createContext,
  useState,
} from 'react';

export type TSearchContext = {
  searchKey: string;
  watchSearcKey: string;
  setSearchKey: Dispatch<SetStateAction<string>>;
};
export const SearchContext = createContext<TSearchContext>({
  searchKey: '',
  watchSearcKey: '',
  setSearchKey: () => {},
});

const SearchProvider = ({ children }: PropsWithChildren) => {
  const [searchKey, setSearchKey] = useState('');

  const [debounceSearchKey] = useDebouncedValue(searchKey, 600);

  return (
    <SearchContext.Provider
      value={{
        searchKey: debounceSearchKey,
        setSearchKey,
        watchSearcKey: searchKey,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};

export default SearchProvider;
