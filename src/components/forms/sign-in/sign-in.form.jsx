import React, { useState } from 'react';
import { ViewPropTypes, View } from 'react-native';
import PropTypes from 'prop-types';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { TextInput, Button, HelperText } from 'react-native-paper';
import { Divider } from 'react-native-elements';
import { emailSchema, passwordSchema } from '../form-validaton-schemas';
import { getFormError } from '../form-utils';
import useTheme from '../../../theme/hooks/useTheme';

const SignInForm = ({ submitForm, onSuccess, containerStyle, initialValues }) => {
  const { Gutters, Common } = useTheme();
  const [isPasswordHidden, setIsPasswordHidden] = useState(true);
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
              <TextInput
                left={<TextInput.Icon name="account" />}
                value={values.email}
                onChangeText={handleChange('email')}
                label="Email"
                onBlur={handleBlur('email')}
                mode="outlined"
              />
              <HelperText style={[Common.errorStyle]} type={'error'} visible={error('email')}>
                {error('email')}
              </HelperText>
              <Divider />
              <TextInput
                value={values.password}
                onChangeText={handleChange('password')}
                label="Password"
                onBlur={handleBlur('password')}
                secureTextEntry={isPasswordHidden}
                mode="outlined"
                left={<TextInput.Icon name="lock" />}
                right={
                  <TextInput.Icon
                    name="eye"
                    onPress={() => setIsPasswordHidden(!isPasswordHidden)}
                  />
                }
              />
              <HelperText style={[Common.errorStyle]} type={'error'} visible={error('password')}>
                {error('password')}
              </HelperText>
              <Divider />
              <Button
                style={[Gutters.largeMargin]}
                mode="contained"
                onPress={handleSubmit}
                loading={isSubmitting}
              >
                Login
              </Button>
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
