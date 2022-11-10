/* eslint-disable react-native/no-inline-styles */
import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, ImageBackground, Pressable } from 'react-native';
import PropTypes from 'prop-types';
import { Formik } from 'formik';
import { Button, HelperText, TextInput } from 'react-native-paper';
import * as Yup from 'yup';
import _ from 'lodash';
import { Text } from 'react-native-elements';

import FormScreenContainer from '../../containers/form-screen-container/form-screen.container';
import { getFormError } from '../form-utils';
import useTheme from '../../../theme/hooks/useTheme';
import { Colors } from '../../../theme/Variables';
import CheckBoxTick from '../../atoms/check-box';

const AccountPaymentForm = ({ initialValues, onSuccess, submitForm, maxAmount, minAmount }) => {
  const { Gutters, Common, Layout, Images, Fonts } = useTheme();
  const formikRef = useRef(null);
  const [isEft, setIsEft] = useState();

  const validationSchema = Yup.object().shape({
    amount: Yup.number()
      .required('Payment Amount is required.')
      .min(minAmount, `Amount should be minimum R ${minAmount.toFixed(2)}`)
      .max(maxAmount, `Amount should be maximum R ${maxAmount.toFixed(2)}`)
      .required('Payment Amount is required.'),
    eft: Yup.bool().required(),
    creditCard: Yup.bool().required(),
  });

  const _handleFormSubmitError = (error, actions) => {
    actions.setSubmitting(false);
    actions.setFieldError('amount', _.get(error, 'message', ''));
  };

  const _handleSubmission = (formData, actions) => {
    submitForm(formData)
      .then((response) => {
        actions.setSubmitting(false);
        onSuccess(response.paymentLink, formData.amount);
      })
      .catch((error) => _handleFormSubmitError(error, actions, formData));
  };

  useEffect(() => {
    if (formikRef.current && isEft) {
      formikRef.current.setFieldValue('eft', true);
      formikRef.current.setFieldValue('creditCard', false);
    } else if (formikRef.current && !isEft) {
      formikRef.current.setFieldValue('eft', false);
      formikRef.current.setFieldValue('creditCard', true);
    }
  }, [isEft]);

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
          {({ handleSubmit, isSubmitting, setFieldValue, errors, touched, status, values }) => {
            const error = (name) => getFormError(name, { touched, status, errors });
            return (
              <FormScreenContainer>
                <View style={(Layout.fill, Layout.fullSize)}>
                  <View style={Layout.center}>
                    <View style={Gutters.regularTMargin}>
                      <Text style={[Common.cardDescription, styles.subTitle]}>
                        Select Payment Method
                      </Text>
                    </View>
                  </View>
                  <View style={[Gutters.xlLargeHMargin, Gutters.largeTMargin]}>
                    <Pressable onPress={() => setIsEft(true)} hitSlop={{ left: 1000 }}>
                      {() => (
                        <View style={[Layout.row, Layout.alignItemsCenter, styles.container]}>
                          <CheckBoxTick
                            name="eft"
                            checkedIcon="check-circle"
                            uncheckedIcon="circle-o"
                            checkedColor={Colors.softBlue}
                            size={20}
                            checked={isEft}
                            onPress={() => setIsEft(true)}
                          />
                          <Text style={[styles.placeHolder, Gutters.largeHMargin]}>EFT</Text>
                        </View>
                      )}
                    </Pressable>

                    <Pressable onPress={() => setIsEft(false)} hitSlop={{ left: 300 }}>
                      {() => (
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
                            checkedIcon="check-circle"
                            uncheckedIcon="circle-o"
                            checkedColor={Colors.softBlue}
                            size={20}
                            checked={!isEft}
                            onPress={() => setIsEft(false)}
                          />
                          <Text style={[styles.placeHolder, Gutters.largeHMargin]}>
                            Credit Card
                          </Text>
                        </View>
                      )}
                    </Pressable>
                  </View>
                  <View style={Layout.fill}>
                    <View style={(Layout.fill, Layout.center)}>
                      <View style={Gutters.xlLargeTMargin}>
                        <View style={Gutters.xlLargeHMargin}>
                          <View style={Gutters.xlLargeTMargin}>
                            <Text
                              style={[
                                Common.cardDescription,
                                styles.subTitle,
                                { textAlign: 'center' },
                              ]}
                            >
                              Please enter your desired amount
                            </Text>
                          </View>
                          <View
                            style={[
                              Layout.rowBetween,
                              ...[
                                {
                                  width: 120,
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  alignSelf: 'center',
                                },
                              ],
                            ]}
                          >
                            <Text
                              style={[Fonts.textLarge, { marginRight: -10, textAlign: 'center' }]}
                            >
                              R
                            </Text>
                            <TextInput
                              name="amount"
                              labelStyle={Layout.alignItemsCenter}
                              placeholder="Amount"
                              style={[Common.textInput, styles.accountInput]}
                              onChangeText={(value) => {
                                setFieldValue('amount', value);
                              }}
                              value={
                                values.amount ? `${parseInt(values.amount, 10)}` : values.amount
                              }
                              multiline={false}
                              textAlign="left"
                              keyboardType="numeric"
                              error={error('amount')}
                              type="number"
                              maxLength={8}
                            />
                          </View>

                          {errors.amount && touched.amount ? (
                            <HelperText
                              style={{ textAlign: 'center' }}
                              type="error"
                              visible={error('amount')}
                            >
                              {error('amount')}
                            </HelperText>
                          ) : (
                            <></>
                          )}
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
                        onPress={handleSubmit}
                        loading={isSubmitting}
                        color={Colors.primary}
                      >
                        PAY NOW
                      </Button>
                    </View>
                  </View>
                </View>
              </FormScreenContainer>
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
  maxAmount: PropTypes.number.isRequired,
  minAmount: PropTypes.number.isRequired,
};

const styles = StyleSheet.create({
  accountInput: {
    borderColor: Colors.gray,
    textAlign: 'center',
    width: '100%',
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
  subTitle: { color: Colors.mainBlue, fontSize: 14 },
  submitButton: {
    backgroundColor: Colors.primary,
    marginLeft: '15%',
    marginRight: '15%',
  },
});

export default AccountPaymentForm;
