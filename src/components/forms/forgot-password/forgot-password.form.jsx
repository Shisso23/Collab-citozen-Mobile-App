import React from 'react';
import _ from 'lodash';
import { ViewPropTypes, View, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import { Formik } from 'formik';
import * as Yup from 'yup';

import { Divider, Input } from 'react-native-elements';
import { HelperText, TextInput, Button } from 'react-native-paper';
import { emailSchema } from '../form-validaton-schemas';
import { getFormError } from '../form-utils';
import { flashService } from '../../../services';
import useTheme from '../../../theme/hooks/useTheme';

const ForgotPasswordForm = ({ submitForm, onSuccess, initialValues, containerStyle }) => {
  const { Common, Gutters, Layout, Colors } = useTheme();
  const validationSchema = Yup.object().shape({
    email: emailSchema,
  });
  const _handleSubmission = (formData, actions) => {
    submitForm({ formData })
      .then(() => {
        actions.setSubmitting(false);
        flashService.success(
          'Instructions to reset your password will be sent to your email address',
        );
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
                leftIcon={<TextInput.Icon name="email" />}
                leftIconContainerStyle={[Gutters.regularHMargin]}
                value={values.email}
                onChangeText={handleChange('email')}
                onBlur={handleBlur('email')}
                placeholder="Email"
                containerStyle={[Common.loginTextInput]}
                inputContainerStyle={styles.inputContainer}
              />
              <HelperText style={[Common.loginErrorStyle]} type={'error'} visible={error('email')}>
                {error('email')}
              </HelperText>
              <Divider />
              <View style={[Layout.center]}>
                <Button
                  style={[Gutters.largeHMargin, Layout.halfWidth]}
                  mode="contained"
                  title="Submit"
                  onPress={handleSubmit}
                  loading={isSubmitting}
                  color={Colors.white}
                >
                  Submit
                </Button>
              </View>
              <Divider />
            </>
          );
        }}
      </Formik>
    </View>
  );
};

ForgotPasswordForm.propTypes = {
  submitForm: PropTypes.func.isRequired,
  onSuccess: PropTypes.func,
  containerStyle: ViewPropTypes.style,
  initialValues: PropTypes.object.isRequired,
};

ForgotPasswordForm.defaultProps = {
  onSuccess: () => null,
  containerStyle: {},
};
const styles = StyleSheet.create({
  inputContainer: {
    borderBottomWidth: 0,
  },
});
export default ForgotPasswordForm;
