import * as Yup from 'yup';

export const emailSchema = Yup.string().email('Invalid Email').trim().required('Email is required');
export const passwordSchema = Yup.string().required('Password is required');
export const phoneSchema = Yup.string()
  .matches(/^(\+27|0|27)[6-8][0-9]{8}$/, 'Error: Invalid mobile number')
  .required('Mobile number is required');
export const selectAccountSchema = Yup.object().typeError('Error: Account is required');
export const selectServiceTypeSchema = Yup.object().typeError('Error: ServiceType is required');
export const selectServiceTypeCategorySchema = Yup.string().required(
  'Error: ServiceType category is required',
);
export const locationSchema = Yup.object().typeError('Error: Location is required');
export const descriptionSchema = Yup.string().required('Error: Description is required');

export const registerPasswordSchema = (edit) => {
  return !edit
    ? Yup.string()
        .min(6, 'Minimum of 6 characters needed for password')
        .required('Password is required')
    : Yup.string().notRequired();
};

export const confirmPasswordSchema = (edit) => {
  return !edit
    ? Yup.string()
        .oneOf([Yup.ref('password'), null], 'Passwords must match')
        .required('Confirm password is required')
    : Yup.string().notRequired();
};

export const termsAndConditionsSchema = (edit) => {
  return !edit ? Yup.bool().oneOf([true]) : Yup.string().notRequired();
};
