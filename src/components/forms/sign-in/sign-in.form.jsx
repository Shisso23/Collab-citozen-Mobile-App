import React, { useState } from 'react';
import { ViewPropTypes, View, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { TextInput, Button, HelperText } from 'react-native-paper';
import { Divider, Input } from 'react-native-elements';
import { emailSchema, passwordSchema } from '../form-validaton-schemas';
import { getFormError } from '../form-utils';
import useTheme from '../../../theme/hooks/useTheme';
import { Colors } from '../../../theme/Variables';

const SignInForm = ({ submitForm, onSuccess, containerStyle, initialValues }) => {
  const { Gutters, Common, Layout } = useTheme();
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
              <Input
                leftIcon={<TextInput.Icon name="account" />}
                value={values.email}
                onChangeText={handleChange('email')}
                placeholder="Email"
                onBlur={handleBlur('email')}
                leftIconContainerStyle={[Gutters.regularHMargin]}
                containerStyle={[Common.loginTextInput]}
                inputContainerStyle={styles.inputContainer}
              />
              <HelperText style={[Common.loginErrorStyle]} type={'error'} visible={error('email')}>
                {error('email')}
              </HelperText>
              <Divider />
              <Input
                leftIcon={<TextInput.Icon name="lock" />}
                rightIcon={
                  <TextInput.Icon
                    name={isPasswordHidden ? 'eye' : 'eye-off'}
                    onPress={() => setIsPasswordHidden(!isPasswordHidden)}
                  />
                }
                secureTextEntry={isPasswordHidden}
                value={values.password}
                onChangeText={handleChange('password')}
                placeholder="Password"
                onBlur={handleBlur('password')}
                rightIconContainerStyle={[Gutters.largeHMargin]}
                leftIconContainerStyle={[Gutters.regularHMargin]}
                containerStyle={[Common.loginTextInput]}
                inputContainerStyle={styles.inputContainer}
              />
              <HelperText
                style={[Common.loginErrorStyle]}
                type={'error'}
                visible={error('password')}
              >
                {error('password')}
              </HelperText>
              <Divider />
              <View style={[Layout.center]}>
                <Button
                  style={[Gutters.largeMargin, Layout.halfWidth]}
                  mode="contained"
                  onPress={handleSubmit}
                  loading={isSubmitting}
                  color={Colors.white}
                >
                  Login
                </Button>
              </View>
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
const styles = StyleSheet.create({
  inputContainer: {
    borderBottomWidth: 0,
  },
});
export default SignInForm;
