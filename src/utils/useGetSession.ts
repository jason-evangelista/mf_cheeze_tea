import { Admin } from '@/types/Admin';
import jsCookie from 'js-cookie';

type UseGetSessionParams = {
  type: 'CLIENT' | 'SERVER';
  serverCookie?: string;
};

export const useGetSession = async ({
  serverCookie,
  type,
}: UseGetSessionParams): Promise<
  { user: Admin } | { user: null } | undefined
> => {
  const setToken = {
    ['CLIENT']: jsCookie.get(process.env.NEXT_PUBLIC_COOKIE_NAME ?? '') ?? '',
    ['SERVER']: serverCookie ?? '',
  };

  const request = await fetch(`${process.env.NEXT_PUBLIC_SERVICE_API}/user`, {
    headers: {
      Authorization: setToken[type],
    },
  });

  if (type === 'CLIENT') {
    const getMainCookie = jsCookie.get(
      process.env.NEXT_PUBLIC_COOKIE_NAME ?? ''
    );
    if (!getMainCookie) return { user: null };
    const data = (await request.json()) as { user: Admin };
    return data;
  }

  if (type === 'SERVER') {
    const data = (await request.json()) as { user: Admin };
    return data;
  }
};
