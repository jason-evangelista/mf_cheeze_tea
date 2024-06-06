import { ProductType } from '@prisma/client';

export type TableProps = {
  currentPage: string;
  skip: string;
  showAll: string;
  searchKey: string;
  productType: ProductType;
  orderDate: string;
};
