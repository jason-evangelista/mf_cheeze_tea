import { Account } from '@prisma/client';

const userSelectedValue: Partial<Record<keyof Account, boolean>> = {
  id: true,
  created_at: true,
  email: true,
  updated_at: true,
  username: true,
};
export default userSelectedValue;
