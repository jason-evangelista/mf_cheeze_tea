import useToggleContainer from '@/hooks/useToggleContainer';
import { Button, Modal, Paper } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconPlus } from '@tabler/icons-react';
import Link from 'next/link';
import { useState } from 'react';
import OrderForm from './OrderForm';
import OrderListTable from './OrderListTable';

const OrderPage = () => {
  const [isProductSelected, setIsProductSelected] = useState(false);
  const { isOpen, handleToggle } = useToggleContainer();
  const [opened, { close }] = useDisclosure(false);

  const handleIsProductSelected = () => {
    setIsProductSelected(true);
  };

  const handleCloseModal = () => {
    close();
    setIsProductSelected(false);
  };

  return (
    <Paper radius="md" className="p-4">
      <Modal
        classNames={{
          content: isProductSelected ? '' : 'overflow-y-visible',
        }}
        title={<span className="font-semibold">Order</span>}
        opened={opened}
        onClose={handleCloseModal}
      >
        <OrderForm
          isOpen={isOpen}
          handleToggle={handleToggle}
          handleClose={handleCloseModal}
          handleisProductSelected={handleIsProductSelected}
        />
      </Modal>
      <div className="flex justify-end">
        {/* <Button
          size="xs"
          color="green"
          className=" my-2"
          onClick={open}
          leftIcon={<IconPlus />}
        >
          Add Order
        </Button> */}
        <Link href="/create-order">
          <Button
            size="xs"
            color="green"
            className=" my-2"
            leftIcon={<IconPlus />}
          >
            Add Order
          </Button>
        </Link>
      </div>
      <OrderListTable />
    </Paper>
  );
};

export default OrderPage;
