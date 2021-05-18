import React, { useState } from 'react';
import { ViewPropTypes, View } from 'react-native';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { TextInput, HelperText, Button } from 'react-native-paper';

import {
  firstNameSchema,
  lastNameSchema,
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

const RegisterForm = ({ edit, submitForm, onSuccess, initialValues, containerStyle }) => {
  const { Common, Gutters, Layout, Colors } = useTheme();
  const [isPasswordHidden, setIsPasswordHidden] = useState(true);
  const [isConfirmPasswordHidden, setIsConfirmPasswordHidden] = useState(true);

  const validationSchema = Yup.object().shape({
    email: emailSchema,
    firstName: firstNameSchema,
    lastName: lastNameSchema,
    mobileNumber: phoneSchema,
    password: registerPasswordSchema(edit),
    confirmPassword: confirmPasswordSchema(edit),
    termsAndConditions: termsAndConditionsSchema(edit),
  });

  const _showPasswordShort = () => {
    setTimeout(() => {
      setIsPasswordHidden(true);
    }, 3000);
    setIsPasswordHidden(false);
  };

  const _showConfirmPasswordShort = () => {
    setTimeout(() => {
      setIsConfirmPasswordHidden(true);
    }, 3000);
    setIsConfirmPasswordHidden(false);
  };

  const _handleSubmission = (formData, actions) => {
    submitForm(formData)
      .then(() => {
        actions.setSubmitting(false);
        flashService.success('You Have Successfully Registered');
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
    <View style={containerStyle}>
      <Formik
        initialValues={initialValues}
        initialStatus={{ apiErrors: {} }}
        onSubmit={_handleSubmission}
        validationSchema={validationSchema}
        enableReinitialize
      >
        {({
          handleChange,
          values,
          errors,
          handleBlur,
          touched,
          status,
          setFieldValue,
          isSubmitting,
          handleSubmit,
        }) => {
          const error = (name) => getFormError(name, { touched, status, errors });
          return (
            <>
              <TextInput
                value={values.firstName}
                onChangeText={handleChange('firstName')}
                onBlur={handleBlur('firstName')}
                label="First Name"
                underlineColor={Colors.transparent}
                style={[Common.registerTextInputWithShadow]}
              />

              <HelperText
                style={[Common.registerErrorStyle]}
                type="error"
                visible={error('firstName')}
              >
                {error('firstName')}
              </HelperText>

              <TextInput
                value={values.lastName}
                onChangeText={handleChange('lastName')}
                onBlur={handleBlur('lastName')}
                label="Surname"
                underlineColor={Colors.transparent}
                style={[Common.registerTextInputWithShadow]}
              />

              <HelperText
                style={[Common.registerErrorStyle]}
                type="error"
                visible={error('lastName')}
              >
                {error('lastName')}
              </HelperText>

              <TextInput
                value={values.mobileNumber}
                onChangeText={handleChange('mobileNumber')}
                onBlur={handleBlur('mobileNumber')}
                label="Number"
                keyboardType="numeric"
                underlineColor={Colors.transparent}
                style={[Common.registerTextInputWithShadow]}
              />

              <HelperText
                style={[Common.registerErrorStyle]}
                type="error"
                visible={error('mobileNumber')}
              >
                {error('mobileNumber')}
              </HelperText>

              <TextInput
                value={values.email}
                onChangeText={handleChange('email')}
                onBlur={handleBlur('email')}
                label="Email"
                keyboardType="email-address"
                autoCapitalize="none"
                underlineColor={Colors.transparent}
                style={[Common.registerTextInputWithShadow]}
              />

              <HelperText style={[Common.registerErrorStyle]} type="error" visible={error('email')}>
                {error('email')}
              </HelperText>

              {!edit && (
                <>
                  <TextInput
                    value={values.password}
                    onChangeText={handleChange('password')}
                    label="Password"
                    onBlur={handleBlur('password')}
                    errorMessage={error('password')}
                    underlineColor={Colors.transparent}
                    style={[Common.registerTextInputWithShadow]}
                    right={
                      <TextInput.Icon
                        name={isPasswordHidden ? 'eye' : 'eye-off'}
                        onPress={_showPasswordShort}
                      />
                    }
                    secureTextEntry={isPasswordHidden}
                  />
                  <HelperText
                    style={[Common.registerErrorStyle]}
                    type="error"
                    visible={error('password')}
                  >
                    {error('password')}
                  </HelperText>

                  <TextInput
                    value={values.confirmPassword}
                    onChangeText={handleChange('confirmPassword')}
                    label="Confirm Password"
                    onBlur={handleBlur('confirmPassword')}
                    errorMessage={error('confirmPassword')}
                    underlineColor={Colors.transparent}
                    style={[Common.registerTextInputWithShadow]}
                    right={
                      <TextInput.Icon
                        name={isConfirmPasswordHidden ? 'eye' : 'eye-off'}
                        onPress={_showConfirmPasswordShort}
                      />
                    }
                    secureTextEntry={isConfirmPasswordHidden}
                  />
                  <HelperText
                    style={[Common.registerErrorStyle]}
                    type="error"
                    visible={error('confirmPassword')}
                  >
                    {error('confirmPassword')}
                  </HelperText>
                </>
              )}

              {!edit && (
                <>
                  <TermsAndConditions
                    checked={values.termsAndConditions}
                    onPress={() => setFieldValue('termsAndConditions', !values.termsAndConditions)}
                  />
                  <HelperText
                    style={[Common.registerErrorStyle]}
                    type="error"
                    visible={error('termsAndConditions')}
                  >
                    {error('termsAndConditions')}
                  </HelperText>
                </>
              )}

              <View style={[Layout.center]}>
                <Button
                  style={[Gutters.largeMargin, Layout.halfWidth]}
                  mode="contained"
                  onPress={handleSubmit}
                  loading={isSubmitting}
                  color={Colors.white}
                >
                  Register
                </Button>
              </View>
            </>
          );
        }}
      </Formik>
    </View>
  );
};

RegisterForm.propTypes = {
  submitForm: PropTypes.func.isRequired,
  initialValues: PropTypes.object.isRequired,
  onSuccess: PropTypes.func,
  edit: PropTypes.bool,
  containerStyle: ViewPropTypes.style,
};

RegisterForm.defaultProps = {
  onSuccess: () => null,
  edit: false,
  containerStyle: {},
};

export default RegisterForm;
