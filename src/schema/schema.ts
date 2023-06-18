import * as yup from 'yup';

export const generateAccountSchema = yup.object().shape({
  username: yup.string().required('Username is required'),
  password: yup.string().required('Password is required'),
});

export const signInSchema = yup.object().shape({
  username: yup.string().required('Username is required'),
  password: yup.string().required('Password is required'),
});

export type GenerateAccountSchema = yup.InferType<typeof generateAccountSchema>;
export type SignInSchema = yup.InferType<typeof signInSchema>;
