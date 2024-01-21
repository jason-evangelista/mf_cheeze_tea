import useToggleContainer from '@/hooks/useToggleContainer';
import { SearchContext } from '@/providers/SearchProvider';
import { Button, Modal, Paper, Tabs, Text, TextInput } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconPlus, IconSearch } from '@tabler/icons-react';
import Link from 'next/link';
import { useContext, useState } from 'react';
import OrderForm from './OrderForm';
import OrderListTable from './OrderListTable';
import OrderSnapshotListTable from './OrderSnapshotListTable';

type TabOrder = 'group-order' | 'single-order';

const OrderPage = () => {
  const { setSearchKey, watchSearcKey, searchKey } = useContext(SearchContext);

  const [isProductSelected, setIsProductSelected] = useState(false);
  const { isOpen, handleToggle } = useToggleContainer();
  const [opened, { close }] = useDisclosure(false);

  const [tabOrder, setTabOrder] = useState<TabOrder>('group-order');

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
      <div className="flex justify-between">
        <TextInput
          value={watchSearcKey}
          icon={<IconSearch size={16} />}
          placeholder={`Search ${
            tabOrder === 'group-order' ? 'customer' : 'product'
          } name`}
          w={300}
          onChange={(e) => setSearchKey(e.currentTarget.value)}
        />

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
      <Tabs
        value={tabOrder}
        onTabChange={(e) => {
          setTabOrder(e as TabOrder);
          setSearchKey('');
        }}
      >
        <Tabs.List>
          <Tabs.Tab value="group-order">
            <Text fw="bold">Group Order</Text>
          </Tabs.Tab>
          <Tabs.Tab value="single-order">
            <Text fw="bold">Order Product</Text>
          </Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="group-order">
          {tabOrder === 'group-order' && (
            <OrderSnapshotListTable searchKey={searchKey} />
          )}
        </Tabs.Panel>
        <Tabs.Panel value="single-order">
          {tabOrder === 'single-order' && (
            <OrderListTable searchKey={searchKey} />
          )}
        </Tabs.Panel>
      </Tabs>
    </Paper>
  );
};

export default OrderPage;
