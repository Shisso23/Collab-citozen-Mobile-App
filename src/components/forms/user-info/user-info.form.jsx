import React from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { Button } from 'react-native-paper';
import {
  emailSchema,
  registerPasswordSchema,
  confirmPasswordSchema,
  termsAndConditionsSchema,
  saIdNumberSchema,
} from '../form-validaton-schemas';
import CustomInput from '../../molecules/custom-input';
import { getFormError } from '../form-utils';
import { TermsAndConditions } from '../../atoms';
import { flashService } from '../../../services';
import useTheme from '../../../theme/hooks/useTheme';

const UserInfoForm = ({ edit, submitForm, onSuccess, initialValues }) => {
  const { Gutters, Layout } = useTheme();
  const validationSchema = Yup.object().shape({
    email: emailSchema,
    firstName: Yup.string().required('First Name is required'),
    lastName: Yup.string().required('Surname is required'),
    mobileNumber: Yup.string().required('Mobile number is required'),
    telNumber: Yup.string(),
    idNumber: saIdNumberSchema,
    password: registerPasswordSchema(edit),
    confirmPassword: confirmPasswordSchema(edit),
    termsAndConditions: termsAndConditionsSchema(edit),
  });
  const _handleSubmission = (formData, actions) => {
    submitForm({ formData })
      .then(() => {
        actions.setSubmitting(false);
        flashService.success('Successfully Updated Profile');
        onSuccess();
      })
      .catch((error) => {
        actions.setSubmitting(false);
        if (_.get(error, 'statusCode') === 422) {
          const apiErrors = error.errors;
          flashService.error('Form Submission Error');
          actions.resetForm({ values: formData, status: { apiErrors } });
        }
      });
  };

  return (
    <Formik
      initialValues={initialValues}
      initialStatus={{ apiErrors: {} }}
      onSubmit={_handleSubmission}
      validationSchema={validationSchema}
      enableReinitialize
    >
      {({
        handleChange,
        handleSubmit,
        isSubmitting,
        values,
        errors,
        handleBlur,
        touched,
        status,
        setFieldValue,
      }) => {
        const error = (name) => getFormError(name, { touched, status, errors });

        return (
          <>
            <CustomInput
              value={values.firstName}
              onChangeText={handleChange('firstName')}
              onBlur={handleBlur('firstName')}
              label="First Name"
              errorMessage={error('firstName')}
            />
            <CustomInput
              value={values.lastName}
              onChangeText={handleChange('lastName')}
              onBlur={handleBlur('lastName')}
              label="Surname"
              errorMessage={error('lastName')}
            />
            <CustomInput
              value={values.mobileNumber}
              onChangeText={handleChange('mobileNumber')}
              onBlur={handleBlur('mobileNumber')}
              label="Mobile Number"
              keyboardType="phone-pad"
              errorMessage={error('mobileNumber')}
            />
            <CustomInput
              value={values.telNumber}
              onChangeText={handleChange('telNumber')}
              onBlur={handleBlur('telNumber')}
              label="Telephone Number"
              keyboardType="phone-pad"
              errorMessage={error('telNumber')}
            />
            <CustomInput
              value={values.idNumber}
              onChangeText={handleChange('idNumber')}
              onBlur={handleBlur('idNumber')}
              label="ID Number"
              errorMessage={error('idNumber')}
            />
            <CustomInput
              value={values.email}
              onChangeText={handleChange('email')}
              onBlur={handleBlur('email')}
              label="Email"
              disabled
              errorMessage={error('email')}
            />
            {!edit && (
              <>
                <CustomInput
                  value={values.password}
                  onChangeText={handleChange('password')}
                  label="Password"
                  secureTextEntry
                  onBlur={handleBlur('password')}
                  errorMessage={error('password')}
                />
                <CustomInput
                  value={values.confirmPassword}
                  onChangeText={handleChange('confirmPassword')}
                  label="Confirm Password"
                  secureTextEntry
                  onBlur={handleBlur('confirmPassword')}
                  errorMessage={error('confirmPassword')}
                />
              </>
            )}
            {!edit && (
              <TermsAndConditions
                checked={values.termsAndConditions}
                onPress={() => setFieldValue('termsAndConditions', !values.termsAndConditions)}
              />
            )}
            <Button
              mode="contained"
              style={[Layout.fill, Gutters.tinyLMargin]}
              onPress={handleSubmit}
              loading={isSubmitting}
              disabled={isSubmitting}
            >
              UPDATE
            </Button>
          </>
        );
      }}
    </Formik>
  );
};

UserInfoForm.propTypes = {
  submitForm: PropTypes.func.isRequired,
  initialValues: PropTypes.object.isRequired,
  onSuccess: PropTypes.func,
  edit: PropTypes.bool,
};

UserInfoForm.defaultProps = {
  onSuccess: () => null,
  edit: false,
};

export default UserInfoForm;
