import { UserContext } from '@/providers/AuthProvider';
import {
  useCreateUserMutation,
  useDeleteUserMutation,
  useGetAllUserQuery,
  useRequestPasswordResetMutation,
  useUpdateUserMutation,
} from '@/services/managerUserService';
import { Badge, Box, Button, Modal, Paper, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { Account } from '@prisma/client';
import { IconUserPlus } from '@tabler/icons-react';
import { format } from 'date-fns';
import { useContext, useEffect, useState } from 'react';
import UserForm from './UserForm';

export type UserFormCredProps = Pick<
  Account,
  'account_type' | 'email' | 'password' | 'username'
> & {
  id?: string;
};

const ManageUserPage = () => {
  const user = useContext(UserContext);

  const isSuperUser = user?.account_type === 'SUPER';
  const [opened, { close, open }] = useDisclosure(false);
  const allUsers = useGetAllUserQuery();
  const [createUserFn, createUserState] = useCreateUserMutation();
  const [updateUserFn, updateUserState] = useUpdateUserMutation();
  const [requestPassResetFn, requestPassResetState] =
    useRequestPasswordResetMutation();
  const [deleteUserFn, deleteUserState] = useDeleteUserMutation();

  const [userCred, setUserCred] = useState<UserFormCredProps>();
  const [userId, setUserId] = useState('');

  const handleEditAccount = (data: UserFormCredProps) => {
    setUserId(data?.id ?? '');
    setUserCred(data);
  };

  const handleDeleteAccount = async (_id: string) => {
    await deleteUserFn({
      id: _id,
    });
  };

  const handleSubmit = async (data: UserFormCredProps) => {
    // Update
    if (userId) {
      await updateUserFn({ ...data, id: userId });
      return;
    }

    await createUserFn(data);
  };

  const handleRequestPassReset = async () => {
    await requestPassResetFn({ email: userCred?.email ?? '' });
  };

  // Send Password Request
  useEffect(() => {
    if (requestPassResetState?.isSuccess) {
      close();
      notifications.show({
        message: requestPassResetState?.data?.message,
        color: 'green',
      });
      allUsers?.refetch();
    }

    if (requestPassResetState?.isError) {
      close();
      notifications.show({
        // @ts-ignore
        message: requestPassResetState?.error?.data?.message,
        color: 'red',
      });
    }
  }, [requestPassResetState?.isSuccess, requestPassResetState?.isError]);

  useEffect(() => {
    if (userCred || userCred) return open();
  }, [userId, userCred]);

  // Create User
  useEffect(() => {
    if (createUserState?.isSuccess) {
      close();
      notifications.show({
        message: createUserState?.data?.message,
        color: 'green',
      });
      allUsers?.refetch();
    }

    if (createUserState?.isError) {
      close();
      notifications.show({
        // @ts-ignore
        message: createUserState?.error?.data?.message,
        color: 'red',
      });
    }
  }, [createUserState?.isSuccess, createUserState?.isError]);

  //Update User
  useEffect(() => {
    if (updateUserState?.isSuccess) {
      close();
      notifications.show({
        message: updateUserState?.data?.message,
        color: 'green',
      });
      allUsers?.refetch();
    }

    if (updateUserState?.isError) {
      close();
      notifications.show({
        // @ts-ignore
        message: updateUserState?.error?.data?.message,
        color: 'red',
      });
    }
  }, [updateUserState?.isSuccess, updateUserState?.isError]);

  // Delete user
  useEffect(() => {
    if (deleteUserState?.isSuccess) {
      close();
      notifications.show({
        message: deleteUserState?.data?.message,
        color: 'green',
      });
      allUsers?.refetch();
    }

    if (deleteUserState?.isError) {
      close();
      notifications.show({
        // @ts-ignore
        message: deleteUserState?.error?.data?.message,
        color: 'red',
      });
    }
  }, [deleteUserState?.isSuccess, deleteUserState?.isError]);

  if (!isSuperUser)
    return (
      <Paper>
        <div className="flex items-center justify-center">
          <Text>
            You dont&apos;t have access to this page, Contact your admin
          </Text>
        </div>
      </Paper>
    );

  return (
    <>
      <Modal
        opened={opened}
        onClose={() => {
          setUserCred(undefined);
          setUserId('');
          close();
        }}
        title={<Text fw="bold">Manage User</Text>}
      >
        <form>
          <UserForm
            id={userId}
            existAccount={userCred}
            handleSubmit={handleSubmit}
            loading={createUserState?.isLoading || updateUserState?.isLoading}
            handleRequestPassReset={handleRequestPassReset}
            passResetLoading={requestPassResetState?.isLoading}
            handleDeleteUse={handleDeleteAccount}
            deleteUserLoading={deleteUserState?.isLoading}
          />
        </form>
      </Modal>
      <Paper p="sm">
        <div className="flex justify-end">
          <Button leftIcon={<IconUserPlus />} onClick={open}>
            Add User
          </Button>
        </div>
        <div className="flex items-center flex-wrap gap-3 mt-4">
          {allUsers?.data?.data?.users.length ? (
            <>
              {allUsers?.data?.data?.users?.map((item) => (
                <Paper
                  key={item.id}
                  shadow="sm"
                  p="sm"
                  withBorder
                  className="cursor-pointer hover:bg-gray-50/50"
                  onClick={() => handleEditAccount(item)}
                >
                  <div className="flex items-center">
                    <Badge>Username</Badge>&nbsp;
                    <Text fz="sm" fw={500}>
                      {item.username}
                    </Text>
                  </div>
                  <div className="flex items-center mt-2">
                    <Badge>Email</Badge>&nbsp;
                    <Text fz="sm" fw={500}>
                      {item.email ?? '-'}
                    </Text>
                  </div>
                  <div className="flex items-center mt-2">
                    <Badge>User type</Badge>&nbsp;
                    <Text fz="sm" fw={500}>
                      {item.account_type}
                    </Text>
                  </div>
                  <div className="flex items-center mt-2">
                    <Badge>User created</Badge>&nbsp;
                    <Text fz="sm" fw={500}>
                      {format(new Date(item?.created_at), 'dd, MMMM yyyy')}
                    </Text>
                  </div>
                </Paper>
              ))}
            </>
          ) : (
            <Box p="md">
              <Text>Failed to load users. Please reload the page</Text>
            </Box>
          )}
        </div>
      </Paper>
    </>
  );
};

export default ManageUserPage;
