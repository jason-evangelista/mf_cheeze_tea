import { Admin } from '@/pages/types/Admin';
import jwt from 'jsonwebtoken';

type JwtGenerator = {
  secret: string;
  payload: object;
};

type JwtDecode = {
  token: string;
  secret: string;
};

const jwtGenerate = async ({ payload, secret }: JwtGenerator) => {
  const result = await new Promise<string>((resolve) => {
    const generate = jwt.sign(payload, secret, { expiresIn: '365 days' });
    if (generate) {
      resolve(generate);
    }
  });

  return result;
};
const jwtDecode = async ({ secret, token }: JwtDecode) => {
  const result = await new Promise<Admin | null>((resolve, reject) => {
    jwt.verify(
      token,
      secret,
      {
        ignoreExpiration: true,
      },
      async (err, result) => {
        if (err) return reject('Unauthorized');
        return resolve(result as Admin);
      }
    );
  });
  return result;
};

export { jwtDecode, jwtGenerate };
