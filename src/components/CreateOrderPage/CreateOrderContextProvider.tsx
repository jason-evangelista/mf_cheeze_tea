import { Product } from '@prisma/client';
import {
  PropsWithChildren,
  createContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

type CreateOrderProviderProps = PropsWithChildren;

export type OrderCart = {
  orderProduct: Product;
  regularSizeQuantity?: number;
  largeSizeQuantity?: number;
  fixedPriceQuantity: number;
};
export type CreateOrderContextProps = {
  orderCart: OrderCart[];
  overAllTotal: number;
  // eslint-disable-next-line no-unused-vars
  addToOrderCart: (order: OrderCart) => void;
  // eslint-disable-next-line no-unused-vars
  removeToOrderCart: (productId: string) => void;
  // eslint-disable-next-line no-unused-vars
  handleToggleRegularQuantity: (id: string, quantity: number) => void;
  // eslint-disable-next-line no-unused-vars
  handleToggleLargeQuantity: (id: string, quantity: number) => void;
  // eslint-disable-next-line no-unused-vars
  handleToggleFixedQuantity: (id: string, quantity: number) => void;
};

export type QuantityActionType = 'Increment' | 'Decrement';

export const CreateOrderContext = createContext<
  Partial<CreateOrderContextProps>
>({});

const CreateOrderContextProvider = ({ children }: CreateOrderProviderProps) => {
  const [orderCart, setOrderCart] = useState<OrderCart[]>([]);
  const [overAllTotal, setOverAllTotal] = useState(0);

  const handleAddToCart = (order: OrderCart) => {
    setOrderCart([...orderCart, order]);
  };

  const handleRemoveToCart = (id: string) => {
    const filteredPreOrder = orderCart.filter(
      (product) => !product.orderProduct.id.match(id)
    );

    setOrderCart([...filteredPreOrder]);
  };

  const handleToggleRegularQuantity = (id: string, quantity: number) => {
    const orderRegularQuantity = orderCart.map((item) => {
      if (item.orderProduct.id.match(id)) {
        return {
          ...item,
          regularSizeQuantity: quantity,
        };
      }
      return item;
    });
    setOrderCart([...orderRegularQuantity]);
  };

  const handleToggleLargeQuantity = (id: string, quantity: number) => {
    const orderLargeQuantity = orderCart.map((item) => {
      if (item.orderProduct.id.match(id)) {
        return {
          ...item,
          largeSizeQuantity: quantity,
        };
      }
      return item;
    });
    setOrderCart([...orderLargeQuantity]);
  };

  const handleToggleFixedQuantity = (id: string, quantity: number) => {
    const orderFixedQuantity = orderCart.map((item) => {
      if (item.orderProduct.id.match(id)) {
        return {
          ...item,
          fixedPriceQuantity: quantity,
        };
      }
      return item;
    });
    setOrderCart([...orderFixedQuantity]);
  };

  const cachedOrderCart = useMemo(() => {
    if (!orderCart) return [];
    return orderCart;
  }, [orderCart]);

  useEffect(() => {
    if (!orderCart.length) return;
    const calcoverAllTotal = orderCart.reduce((prev, cur) => {
      let holdValue = 0;
      if (cur?.largeSizeQuantity && cur?.orderProduct?.large_size_amount) {
        holdValue +=
          cur?.orderProduct?.large_size_amount * cur?.largeSizeQuantity;
      }

      if (cur?.regularSizeQuantity && cur?.orderProduct?.regular_size_amount) {
        holdValue +=
          cur?.orderProduct?.regular_size_amount * cur?.regularSizeQuantity;
      }

      if (cur?.fixedPriceQuantity && cur?.orderProduct?.fixed_amount) {
        holdValue = cur?.orderProduct?.fixed_amount * cur?.fixedPriceQuantity;
      }

      return prev + holdValue;
    }, 0);
    setOverAllTotal(calcoverAllTotal);
  }, [orderCart]);

  return (
    <CreateOrderContext.Provider
      value={{
        orderCart: cachedOrderCart,
        addToOrderCart: handleAddToCart,
        removeToOrderCart: handleRemoveToCart,
        handleToggleLargeQuantity,
        handleToggleRegularQuantity,
        handleToggleFixedQuantity,
        overAllTotal,
      }}
    >
      {children}
    </CreateOrderContext.Provider>
  );
};

export default CreateOrderContextProvider;
