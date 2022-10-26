import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, Text, ImageBackground } from 'react-native';
import PropTypes from 'prop-types';
import { Formik, ErrorMessage } from 'formik';
import { Button, TextInput } from 'react-native-paper';
import * as Yup from 'yup';
import _, { values } from 'lodash';

import { getFormError } from '../form-utils';
import useTheme from '../../../theme/hooks/useTheme';
import { Colors } from '../../../theme/Variables';
import CheckBoxTick from '../../atoms/check-box';
import ScreenContainer from '../../containers/screen-container/screen.container';

const AccountPaymentForm = ({ initialValues, onSuccess, submitForm }) => {
  const { Gutters, Common, Layout, Images } = useTheme();
  const formikRef = useRef(null);
  const [paymentType, setPaymentType] = useState();

  const validationSchema = Yup.object().shape({
    amount: Yup.number().required('Payment Amount is required.'),

    eft: Yup.bool,
    creditCard: Yup.bool,
  });

  const _handleFormSubmitError = (error, actions) => {
    actions.setSubmitting(false);
    actions.setFieldError('amount', _.get(error, 'message', ''));
  };

  const _handleSubmission = (formData, actions) => {
    submitForm(formData)
      .then(() => {
        actions.setSubmitting(false);
        // onSuccess();
      })
      .catch((error) => _handleFormSubmitError(error, actions, formData));
  };

  useEffect(() => {
    if (formikRef.current && paymentType) {
      formikRef.current.setFieldValue('paymentType', paymentType);
      formikRef.current.setFieldValue('eft', !paymentType);
    } else if (formikRef.current && !paymentType) {
      formikRef.current.setFieldValue('paymentType', paymentType);
      formikRef.current.setFieldValue('eft', !paymentType);
    }
  }, [paymentType]);

  return (
    <ImageBackground
      source={Images.serviceRequest}
      style={[Layout.fullSize, Layout.fill]}
      resizeMode="cover"
    >
      <View>
        <Formik
          innerRef={formikRef}
          initialValues={initialValues}
          initialStatus={{ apiErrors: {} }}
          onSubmit={_handleSubmission}
          onSuccess={onSuccess}
          validationSchema={validationSchema}
        >
          {({ handleSubmit, isSubmitting, item, setFieldValue, errors, touched, status }) => {
            const error = (name) => getFormError(name, { touched, status, errors });

            return (
              <ScreenContainer>
                <View style={(Layout.fill, Layout.fullSize)}>
                  <View style={[Gutters.largeHMargin, Gutters.largeVMargin]}>
                    <Text style={styles.title}>Payment</Text>
                  </View>
                  <View style={Layout.center}>
                    <View style={Gutters.regularTMargin}>
                      <Text style={styles.subTitle}>Select Payment Method</Text>
                    </View>
                  </View>
                  <View style={[Gutters.xlLargeHMargin, Gutters.largeTMargin]}>
                    <View style={[Layout.row, Layout.alignItemsCenter, styles.container]}>
                      <CheckBoxTick
                        name="eft"
                        selectedItem={item}
                        checkedIcon="check-circle"
                        uncheckedIcon="circle-o"
                        hitSlop={{ right: 200 }}
                        checkedColor={Colors.softBlue}
                        size={20}
                        checked={!paymentType}
                        onPress={() => setPaymentType(false)}
                      />
                      <Text style={[styles.placeHolder, Gutters.largeHMargin]}>EFT</Text>
                    </View>
                    <View
                      style={[
                        Layout.row,
                        Layout.alignItemsCenter,
                        styles.container,
                        Gutters.regularTMargin,
                      ]}
                    >
                      <CheckBoxTick
                        name="creditCard"
                        selectedItem={item}
                        checkedIcon="check-circle"
                        uncheckedIcon="circle-o"
                        hitSlop={{ right: 200 }}
                        setItem={item}
                        checkedColor={Colors.softBlue}
                        size={20}
                        checked={paymentType}
                        onPress={() => setPaymentType(true)}
                      />
                      <Text style={[styles.placeHolder, Gutters.largeHMargin]}>Credit Card</Text>
                    </View>
                  </View>
                  <View style={Layout.fill}>
                    <View style={(Layout.fill, Layout.center)}>
                      <View style={Gutters.xlLargeTMargin}>
                        <View style={Gutters.xlLargeHMargin}>
                          <View style={Gutters.xlLargeTMargin}>
                            <Text style={styles.subTitle}>Please enter your desired amount</Text>
                          </View>
                          <TextInput
                            name="amount"
                            labelStyle={Layout.alignItemsCenter}
                            placeholder="Amount"
                            style={[Common.textInput, styles.accountInput]}
                            onChangeText={(value) => {
                              setFieldValue('amount', value);
                            }}
                            value={values.amount}
                            multiline={false}
                            textAlign="center"
                            keyboardType="numeric"
                            error={error('amount')}
                            type="number"
                          />
                          {errors.amount && touched.amount ? <div>{errors.amount}</div> : null}
                          <ErrorMessage name="amount" />
                        </View>
                      </View>
                    </View>
                  </View>
                  <View style={[Layout.center, Layout.fill]}>
                    <View>
                      <Button
                        style={[Gutters.regularVMargin, styles.border]}
                        contentStyle={[styles.submitButton]}
                        labelStyle={[...[{ color: Colors.white }]]}
                        mode="contained"
                        onPress={handleSubmit} // TODO add in the url to rediret to pay@
                        loading={isSubmitting}
                        color={Colors.primary}
                      >
                        PAY NOW
                      </Button>
                    </View>
                  </View>
                </View>
              </ScreenContainer>
            );
          }}
        </Formik>
      </View>
    </ImageBackground>
  );
};

AccountPaymentForm.propTypes = {
  submitForm: PropTypes.func.isRequired,
  initialValues: PropTypes.object.isRequired,
  onSuccess: PropTypes.func.isRequired,
};

const styles = StyleSheet.create({
  accountInput: {
    borderColor: Colors.gray,
    textAlign: 'center',
  },
  border: {
    borderRadius: 15,
  },
  container: {
    borderColor: Colors.gray,
    borderRadius: 20,
    borderWidth: 1,
  },
  placeHolder: {
    color: Colors.darkgray,
  },
  // eslint-disable-next-line react-native/no-color-literals
  subTitle: { color: '#39609C', fontSize: 14 },
  submitButton: {
    backgroundColor: Colors.primary,
    marginLeft: '15%',
    marginRight: '15%',
  },
  title: { fontSize: 18, fontWeight: '500' },
});

export default AccountPaymentForm;
