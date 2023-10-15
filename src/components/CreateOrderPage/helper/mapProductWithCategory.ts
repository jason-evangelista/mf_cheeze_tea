import { Product, ProductCategory } from '@prisma/client';

export type ProductWithCategory = {
  products: Product[];
  category: ProductCategory;
};

const mapProductWithCategory = (
  products: Product[],
  category: ProductCategory[]
): ProductWithCategory[] => {
  return category.map((item) => ({
    category: item,
    products: products.filter((product) => product.type.match(item.code)),
  }));
};

export default mapProductWithCategory;
