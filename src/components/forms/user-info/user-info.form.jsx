import React from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { TextInput, HelperText } from 'react-native-paper';
import {
  emailSchema,
  phoneSchema,
  registerPasswordSchema,
  confirmPasswordSchema,
  termsAndConditionsSchema,
} from '../form-validaton-schemas';
import { getFormError } from '../form-utils';
import { TermsAndConditions } from '../../atoms';
import { flashService } from '../../../services';
import useTheme from '../../../theme/hooks/useTheme';

const UserInfoForm = ({ edit, submitForm, onSuccess, initialValues }) => {
  const { Common } = useTheme();
  const validationSchema = Yup.object().shape({
    email: emailSchema,
    firstName: Yup.string().required('First Name is required'),
    lastName: Yup.string().required('Surname is required'),
    mobileNumber: phoneSchema,
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
      {({ handleChange, values, errors, handleBlur, touched, status, setFieldValue }) => {
        const error = (name) => getFormError(name, { touched, status, errors });
        return (
          <>
            <TextInput
              value={values.firstName}
              onChangeText={handleChange('firstName')}
              onBlur={handleBlur('firstName')}
              label="First Name"
              disabled={true}
              style={[Common.textInputWithShadow]}
            />
            <HelperText style={[Common.errorStyle]} type={'error'} visible={error('firstName')}>
              {error('firstName')}
            </HelperText>
            <TextInput
              value={values.lastName}
              onChangeText={handleChange('lastName')}
              onBlur={handleBlur('lastName')}
              label="Surname"
              disabled={true}
              style={[Common.textInputWithShadow]}
            />
            <HelperText style={[Common.errorStyle]} type={'error'} visible={error('lastName')}>
              {error('lastName')}
            </HelperText>
            <TextInput
              value={values.mobileNumber}
              onChangeText={handleChange('mobileNumber')}
              onBlur={handleBlur('mobileNumber')}
              label="Number"
              disabled={true}
              style={[Common.textInputWithShadow]}
            />
            <HelperText style={[Common.errorStyle]} type={'error'} visible={error('mobileNumber')}>
              {error('mobileNumber')}
            </HelperText>
            <TextInput
              value={values.email}
              onChangeText={handleChange('email')}
              onBlur={handleBlur('email')}
              label="Email"
              disabled={true}
              style={[Common.textInputWithShadow]}
            />
            <HelperText style={[Common.errorStyle]} type={'error'} visible={error('email')}>
              {error('email')}
            </HelperText>
            {!edit && (
              <>
                <TextInput
                  value={values.password}
                  onChangeText={handleChange('password')}
                  label="Password"
                  secureTextEntry
                  onBlur={handleBlur('password')}
                  errorMessage={error('password')}
                />
                <TextInput
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
