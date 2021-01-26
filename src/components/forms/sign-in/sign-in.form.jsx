import React from 'react';
import _ from 'lodash';
import { ViewPropTypes, View } from 'react-native';
import PropTypes from 'prop-types';
import { Formik } from 'formik';
import * as Yup from 'yup';

import { Button, Input } from 'react-native-elements';
import { emailSchema, passwordSchema } from '../form-validaton-schemas';
import { getFormError } from '../form-utils';

const SignInForm = ({ submitForm, onSuccess, containerStyle, initialValues }) => {
  const validationSchema = Yup.object().shape({
    email: emailSchema,
    password: passwordSchema,
  });

  const _handleFormSubmitError = (error, actions) => {
    actions.setSubmitting(false);
    actions.setFieldError('email', error.message);
  };

  const _handleSubmission = (formData, actions) => {
    submitForm({ formData })
      .then(() => {
        actions.setSubmitting(false);
        onSuccess();
      })
      .catch((error) => _handleFormSubmitError(error, actions, formData));
  };

  return (
    <View style={containerStyle}>
      <Formik
        initialValues={initialValues}
        initialStatus={{ apiErrors: {} }}
        onSubmit={_handleSubmission}
        validationSchema={validationSchema}
      >
        {({
          handleChange,
          handleSubmit,
          values,
          errors,
          isSubmitting,
          handleBlur,
          touched,
          status,
        }) => {
          const error = (name) => getFormError(name, { touched, status, errors });
          return (
            <>
              <Input
                value={values.email}
                onChangeText={handleChange('email')}
                label="Email"
                onBlur={handleBlur('email')}
                errorMessage={error('email')}
              />
              <Input
                value={values.password}
                onChangeText={handleChange('password')}
                label="Password"
                onBlur={handleBlur('password')}
                secureTextEntry
                errorMessage={error('password')}
              />
              <Button title="Login" onPress={handleSubmit} loading={isSubmitting} />
            </>
          );
        }}
      </Formik>
    </View>
  );
};

SignInForm.propTypes = {
  submitForm: PropTypes.func.isRequired,
  initialValues: PropTypes.object.isRequired,
  onSuccess: PropTypes.func,
  containerStyle: ViewPropTypes.style,
};

SignInForm.defaultProps = {
  onSuccess: () => null,
  containerStyle: {},
};

export default SignInForm;
