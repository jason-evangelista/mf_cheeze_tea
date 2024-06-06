import ProductListPage from '@/components/ProductsPage/ProductListPage';
import SeoContainer from '@/components/common/SeoContainer';
import SearchProvider from '@/providers/SearchProvider';

function ProductList() {
  return (
    <SeoContainer title="Product List">
      <SearchProvider>
        <ProductListPage />
      </SearchProvider>
    </SeoContainer>
  );
}

export default ProductList;
