import * as yup from 'yup';

export const generateAccountSchema = yup.object().shape({
  username: yup.string().required('Username is required'),
  password: yup.string().required('Password is required'),
});

export const signInSchema = yup.object().shape({
  username: yup.string().required('Username is required'),
  password: yup.string().required('Password is required'),
});

export const productSchema = yup.object().shape({
  product_name: yup.string().required('Product name is required'),
  product_type: yup.string().required('Product type is required'),

  large_size_amount: yup.number().when('product_type', {
    is: (value: string) => value === 'SERRADURA',
    then: () =>
      yup
        .number()
        .transform((value) => (isNaN(value) ? 0 : value))
        .max(
          0,
          'Large amount does not need on Serradura type, Please remove the value'
        ),
    otherwise: () =>
      yup
        .number()
        .transform((value) => (isNaN(value) ? 0 : value))
        .moreThan(
          yup.ref('regular_size_amount'),
          'Large amount must be greater than regular size amount'
        ),
  }),
  regular_size_amount: yup.number().when('product_type', {
    is: (value: string) => value === 'SERRADURA',
    then: () =>
      yup
        .number()
        .transform((value) => (isNaN(value) ? 0 : value))
        .max(
          0,
          'Regular amount does not need on Serradura type, Please remove the value'
        ),

    otherwise: () =>
      yup
        .number()
        .transform((value) => (isNaN(value) ? 0 : value))
        .lessThan(
          yup.ref('large_size_amount'),
          'Regular size amount must be less than large size amount'
        ),
  }),
  fixed_amount: yup
    .number()
    .transform((value) => (isNaN(value) ? 0 : value))
    .when('large_size_amount', {
      is: (value: string[]) => !value,
      then: () =>
        yup
          .string()
          .required(
            'Must have fixed amount if no large or regular amount specified'
          ),
    })
    .when('regular_size_amount', {
      is: (value: string[]) => !value,
      then: () =>
        yup
          .number()
          .transform((value) => (isNaN(value) ? 0 : value))
          .required(
            'Must have fixed amount if no large or regular amount specified'
          ),
    })
    .when('product_type', {
      is: (value: string) => value === 'SERRADURA',
      then: () =>
        yup
          .number()
          .transform((value) => (isNaN(value) ? 0 : value))
          .required('Required amount for Serradura type'),
    }),
});

export type GenerateAccountSchema = yup.InferType<typeof generateAccountSchema>;
export type SignInSchema = yup.InferType<typeof signInSchema>;
export type ProductSchema = yup.InferType<typeof productSchema>;
