import { Account } from '@prisma/client';

export type Admin = Omit<Account, 'password'>;
