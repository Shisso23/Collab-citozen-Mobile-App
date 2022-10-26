import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, Text, ImageBackground } from 'react-native';
import PropTypes from 'prop-types';
import { Formik } from 'formik';
import { Button, HelperText, TextInput } from 'react-native-paper';

import useTheme from '../../../theme/hooks/useTheme';
import { Colors } from '../../../theme/Variables';
import CheckBoxTick from '../../atoms/check-box';
import ScreenContainer from '../../containers/screen-container/screen.container';

const AccountPaymentForm = ({ initialValues, onSuccess, submitForm }) => {
  const { Gutters, Common, Layout, Images } = useTheme();
  const [paymentAmount, setPaymentAmount] = useState('');
  const formikRef = useRef(null);
  const [paymentAmountError, setPaymentAmountError] = useState('');
  const [creditCard, setCreditCard] = useState();

  const _handleFormSubmitError = (error, actions) => {
    actions.setSubmitting(false);
  };

  const _handleSubmission = (formData, actions) => {
    console.warn(formData);
    submitForm(formData)
      .then(() => {
        actions.setSubmitting(false);
        // onSuccess();
      })
      .catch((error) => _handleFormSubmitError(error, actions, formData));
  };

  useEffect(() => {
    if (formikRef.current && creditCard) {
      formikRef.current.setFieldValue('creditCard', creditCard);
      formikRef.current.setFieldValue('eft', !creditCard);
    } else if (formikRef.current && !creditCard) {
      formikRef.current.setFieldValue('creditCard', creditCard);
      formikRef.current.setFieldValue('eft', !creditCard);
    }
  }, [creditCard]);

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
        >
          {({ handleSubmit, isSubmitting, item, setFieldValue }) => {
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
                        selectedItem={item}
                        checkedIcon="check-circle"
                        uncheckedIcon="circle-o"
                        hitSlop={{ right: 200 }}
                        checkedColor={Colors.softBlue}
                        size={20}
                        checked={!creditCard}
                        onPress={() => setCreditCard(false)}
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
                        selectedItem={item}
                        checkedIcon="check-circle"
                        uncheckedIcon="circle-o"
                        hitSlop={{ right: 200 }}
                        setItem={item}
                        checkedColor={Colors.softBlue}
                        size={20}
                        checked={creditCard}
                        onPress={() => setCreditCard(true)}
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
                            labelStyle={Layout.alignItemsCenter}
                            placeholder="Amount"
                            style={[Common.textInput, styles.accountInput]}
                            onChangeText={(value) => {
                              setFieldValue('amount', value);
                              setPaymentAmount(value);
                              if (`${paymentAmount}`.length > 0) setPaymentAmountError('');
                              else {
                                setPaymentAmountError('No amount value entered!');
                              }
                            }}
                            value={paymentAmount}
                            multiline={false}
                            error={`${paymentAmountError}`.length > 0}
                            onEndEditing={() => {
                              if (`${paymentAmount}`.length === 0) {
                                setPaymentAmountError('No amount value entered!');
                              }
                            }}
                            textAlign="center"
                            keyboardType="numeric"
                          />
                          <HelperText
                            type="error"
                            style={styles.errorStyle}
                            visible={`${paymentAmountError}`.length > 0}
                          >
                            {paymentAmountError}
                          </HelperText>
                          <View>
                            <Text style={styles.lastReadingInfo}>Minimum Amount of R1 500</Text>
                          </View>
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
  errorStyle: {
    color: Colors.danger,
    marginHorizontal: '12%',
  },
  lastReadingInfo: {
    color: Colors.darkgray,
    fontSize: 14,
    textAlign: 'center',
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
