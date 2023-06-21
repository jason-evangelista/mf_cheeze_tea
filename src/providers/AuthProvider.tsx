import { Admin } from '@/types/Admin';
import { useGetSession as getSession } from '@/utils/useGetSession';
import { PropsWithChildren, createContext, useEffect, useState } from 'react';

type AuthProviderProps = PropsWithChildren;

export const UserContext = createContext<Admin | null>(null);

const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<Admin | null>(null);

  useEffect(() => {
    (async () => {
      const session = await getSession({
        type: 'CLIENT',
      });
      if (session?.user) return setUser(session?.user);
    })();
  }, []);

  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
};

export default AuthProvider;
