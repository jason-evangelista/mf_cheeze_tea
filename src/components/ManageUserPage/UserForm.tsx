import { Button, PasswordInput, Select, Stack, TextInput } from '@mantine/core';
import { AccountType } from '@prisma/client';
import { useState } from 'react';
import { UserFormCredProps } from './ManageUserPage';

type UserFormProps = {
  id?: string;
  existAccount?: UserFormCredProps;
  // eslint-disable-next-line no-unused-vars
  handleSubmit: (_: UserFormCredProps) => void;
  loading: boolean;
  handleRequestPassReset: VoidFunction;
  passResetLoading?: boolean;
};

const UserForm = ({
  id,
  existAccount,
  handleSubmit,
  loading,
  handleRequestPassReset,
  passResetLoading,
}: UserFormProps) => {
  const isUpdate = !!id;

  const [emailAddress, setEmailAddress] = useState(existAccount?.email ?? '');
  const [username, setUserame] = useState(existAccount?.username ?? '');
  const [password, setPassword] = useState('');
  const [userType, setUsertype] = useState(
    existAccount?.account_type ?? 'MEMBER'
  );

  return (
    <Stack spacing="sm">
      <TextInput
        label="Email Address"
        placeholder="Enter Email address"
        value={emailAddress}
        onChange={(v) => setEmailAddress(v?.currentTarget?.value)}
        required
      />
      <TextInput
        label="Username"
        placeholder="Enter Username"
        required
        value={username}
        onChange={(v) => setUserame(v?.currentTarget?.value)}
      />
      {!isUpdate && (
        <PasswordInput
          label={isUpdate ? 'Change Password' : 'Password'}
          placeholder={isUpdate ? 'Enter New Password' : 'Password'}
          value={password}
          onChange={(v) => setPassword(v?.currentTarget?.value)}
          required
        />
      )}

      <Select
        data={['SUPER', 'MEMBER']}
        value={userType}
        defaultValue="MEMBER"
        label="Access Type"
        onChange={(e) => setUsertype(e as AccountType)}
      />
      {isUpdate ? (
        <>
          <Button
            loading={loading}
            disabled={loading}
            mt="sm"
            onClick={() =>
              handleSubmit({
                account_type: userType as AccountType,
                email: emailAddress,
                password,
                username,
              })
            }
          >
            {isUpdate ? 'Update User' : 'Create User'}
          </Button>
          <Button
            color="red"
            variant="light"
            onClick={handleRequestPassReset}
            loading={passResetLoading}
          >
            Send Reset Password
          </Button>
        </>
      ) : (
        <Button
          loading={loading}
          disabled={loading || !emailAddress || !username || !password}
          mt="sm"
          onClick={() =>
            handleSubmit({
              account_type: userType as AccountType,
              email: emailAddress,
              password,
              username,
            })
          }
        >
          {isUpdate ? 'Update User' : 'Create User'}
        </Button>
      )}
    </Stack>
  );
};

export default UserForm;
