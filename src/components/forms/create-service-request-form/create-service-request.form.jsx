/* eslint-disable react/no-array-index-key */
import React, { useEffect, useState, useRef } from 'react';
import { ViewPropTypes, View, Keyboard, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { Button, HelperText, TextInput, List } from 'react-native-paper';
import { ListItem, Text } from 'react-native-elements';
import { useNavigation, useRoute } from '@react-navigation/native';
import _ from 'lodash';

import {
  selectChannelSchema,
  selectServiceTypeCategorySchema,
  selectServiceTypeSchema,
  descriptionSchema,
  locationSchema,
} from '../form-validaton-schemas';
import { getFormError } from '../form-utils';
import useTheme from '../../../theme/hooks/useTheme';
import UploadDocumentButton from '../../molecules/upload-document-button';
import { Colors } from '../../../theme/Variables';

navigator.geolocation = require('react-native-geolocation-service');

const CreateServiceRequestForm = ({
  submitForm,
  onSuccess,
  containerStyle,
  initialValues,
  municipalities,
  setThumbNailImages,
  thumbNailImages,
}) => {
  const { Common, Layout, Gutters, Fonts } = useTheme();
  const { params } = useRoute();
  const selectedCoordinates = params?.mapPosition;
  const addressSelected = params?.selectedAddress;
  const [searchValue, setSearchValue] = useState('');
  const navigation = useNavigation();
  const formikRef = useRef(null);
  const [accordionExpanded, setAccordionExpanded] = useState(true);
  const [selectedChannel, setSelectedChannel] = useState('');
  const [municipalitiesData, setMunicipalitiesData] = useState([]);
  const [selectedServiceType, setSelectedServiceType] = useState(null);

  useEffect(() => {
    setMunicipalitiesData(reformMunicipalitiesData());
  }, []);

  const reformMunicipalitiesData = () => {
    const municipalitiesList = Object.keys(municipalities).map((municipalityRef) => {
      const currentMucipalityData = municipalities[municipalityRef];
      const municipalityServiceTypes = Object.keys(currentMucipalityData.serviceTypes).map(
        (serviceTypeCategoryName) => {
          return {
            categorisedServiceTypes: currentMucipalityData.serviceTypes[serviceTypeCategoryName],
          };
        },
      );
      return {
        municipalityData: {
          id: currentMucipalityData.id,
          municipalityCode: currentMucipalityData.municipalityCode,
          name: currentMucipalityData.name,
          serviceTypes: municipalityServiceTypes,
        },
      };
    });
    return municipalitiesList;
  };

  useEffect(() => {
    formikRef.current.setFieldValue('images', thumbNailImages);
  }, [JSON.stringify(thumbNailImages)]);

  const validationSchema = Yup.object().shape({
    channel: selectChannelSchema,
    serviceTypeCategory: selectServiceTypeCategorySchema,
    serviceType: selectServiceTypeSchema,
    description: descriptionSchema,
    location: locationSchema,
  });

  const _handleFormSubmitError = (error, actions) => {
    actions.setSubmitting(false);
    actions.setFieldError('account', error.message);
  };

  const _handleSubmission = (formData, actions) => {
    submitForm(formData)
      .then(() => {
        actions.setSubmitting(false);
        onSuccess();
      })
      .catch((error) => _handleFormSubmitError(error, actions, formData));
  };

  const handleServiceTypeSelected = ({ serviceType, channel }) => {
    setAccordionExpanded(false);
    setSelectedChannel(channel);
    setSelectedServiceType(serviceType);
    formikRef.current.setFieldValue('channel', channel.name);
    formikRef.current.setFieldValue('serviceTypeCategory', serviceType.category);
    formikRef.current.setFieldValue('serviceType', serviceType);
    formikRef.current.setFieldValue('municipalityCode', channel.municipalityCode);
    formikRef.current.setFieldValue('channelRef', channel.id);
  };

  const handleChangeServiceTypePressed = () => {
    setSelectedServiceType(null);
    setAccordionExpanded(true);
  };

  useEffect(() => {
    if (searchValue && searchValue.length > 0) {
      handleServiceTypesSearch(searchValue);
    } else if (searchValue !== null && searchValue.length === 0) {
      setMunicipalitiesData(reformMunicipalitiesData());
    }
  }, [JSON.stringify(searchValue)]);

  const handleServiceTypesSearch = (searchKeyWord) => {
    if (searchKeyWord && searchKeyWord.length > 0) {
      const result = reformMunicipalitiesData().map((municipalityData) => {
        const municipalityResult = _.clone(municipalityData);
        municipalityResult.municipalityData.serviceTypes =
          municipalityData.municipalityData.serviceTypes.filter((serviceTypesByCategory) => {
            return serviceTypesByCategory.categorisedServiceTypes.some((serviceType) => {
              return (
                `${serviceType.aliases}`.toLowerCase().includes(searchKeyWord.toLowerCase()) ||
                `${serviceType.name}`.toLowerCase().includes(searchKeyWord.toLowerCase()) ||
                `${serviceType.category}`.toLowerCase().includes(searchKeyWord.toLowerCase())
              );
            });
          });
        return municipalityResult;
      });
      setMunicipalitiesData(result);
    }
  };

  return (
    <View style={containerStyle}>
      <Formik
        initialValues={initialValues}
        initialStatus={{ apiErrors: {} }}
        onSubmit={_handleSubmission}
        validationSchema={validationSchema}
        innerRef={formikRef}
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
          setFieldValue,
        }) => {
          const handleSubmissionFormik = (vals) => {
            setFieldValue('location', selectedCoordinates);
            vals.location = selectedCoordinates;
            setFieldValue('address', addressSelected);
            vals.address = addressSelected;
            handleSubmit();
          };

          const error = (name) => getFormError(name, { touched, status, errors });
          return (
            <>
              <TextInput
                value={addressSelected}
                label="Location Selected"
                underlineColor={Colors.transparent}
                onFocus={() =>
                  navigation.navigate('SelectLocationScreen', {
                    showSRPins: true,
                  })
                }
              />
              <HelperText />
              <View style={[styles.viewTextContainer]}>
                <Text style={[Fonts.textRegular, styles.textHeaderInstruction, Fonts.titleTiny]}>
                  Select a Service Type
                </Text>
              </View>
              {!selectedServiceType && (
                <TextInput
                  value={searchValue}
                  label="Search..."
                  underlineColor={Colors.transparent}
                  onChangeText={(searchText) => {
                    setSearchValue(searchText);
                  }}
                />
              )}
              <HelperText />
              {(accordionExpanded && (
                <View style={styles.viewItemsChannelContainer}>
                  {municipalitiesData.map((municipality, index) => {
                    const currentMunicipality = municipality.municipalityData;
                    return (
                      <ListItem.Accordion
                        key={`${currentMunicipality.id}-${index}`}
                        noIcon
                        underlayColor={Colors.transparent}
                        content={
                          (accordionExpanded && (
                            <View style={[styles.viewTextContainer]}>
                              <Text style={[Fonts.textRegular, styles.textHeaderChannel]}>
                                {currentMunicipality.name}
                              </Text>
                            </View>
                          )) || <View />
                        }
                        containerStyle={{ backgroundColor: Colors.transparent }}
                        isExpanded={accordionExpanded}
                      >
                        <View style={styles.viewItemsCategoryContainer}>
                          {currentMunicipality.serviceTypes?.map(
                            (serviceTypesByCategory, serviceTypesByCategoryIndex) => {
                              const currentCategoryServiceTypes =
                                serviceTypesByCategory.categorisedServiceTypes;
                              return (
                                <ListItem.Accordion
                                  key={`${serviceTypesByCategoryIndex}`}
                                  noIcon
                                  underlayColor={Colors.transparent}
                                  content={
                                    <View style={[styles.viewTextContainer]}>
                                      <Text style={[Fonts.textRegular, styles.textHeaderCategory]}>
                                        {currentCategoryServiceTypes[0].category}
                                      </Text>
                                    </View>
                                  }
                                  containerStyle={{ backgroundColor: Colors.transparent }}
                                  isExpanded={accordionExpanded}
                                >
                                  <View style={styles.viewItemsTypesContainer}>
                                    {currentCategoryServiceTypes.map(
                                      (serviceTypeObject, serviceTypeIndex) => {
                                        return (
                                          <View
                                            key={`${serviceTypeObject.name}-${serviceTypeIndex}`}
                                            style={[
                                              Common.textInputWithoutShadow,
                                              Gutters.smallBMargin,
                                              styles.listItem,
                                              styles.viewButton,
                                            ]}
                                          >
                                            <List.Item
                                              key={serviceTypeObject}
                                              style={Layout.fill}
                                              title={serviceTypeObject.name}
                                              titleNumberOfLines={3}
                                              onPress={() => {
                                                handleServiceTypeSelected({
                                                  serviceType: serviceTypeObject,
                                                  channel: currentMunicipality,
                                                });
                                              }}
                                              titleStyle={
                                                (Common.cardTitle, styles.listItemTitleStyle)
                                              }
                                            />
                                          </View>
                                        );
                                      },
                                    )}
                                  </View>
                                </ListItem.Accordion>
                              );
                            },
                          )}
                        </View>
                      </ListItem.Accordion>
                    );
                  })}
                </View>
              )) || <View />}
              {!accordionExpanded && (
                <>
                  <Button
                    mode="contained"
                    style={[Layout.fill, Gutters.regularBMargin]}
                    onPress={handleChangeServiceTypePressed}
                  >
                    Change Type
                  </Button>
                  {selectedServiceType && (
                    <View>
                      <Text style={[Fonts.textRegular, Gutters.smallBMargin]}>
                        Channel: {selectedChannel.name}
                      </Text>
                      <Text style={[Fonts.textRegular, Gutters.smallBMargin]}>
                        Channel Category: {selectedServiceType?.category}
                      </Text>

                      <Text style={[Fonts.textRegular, Gutters.smallBMargin]}>
                        Selected Type: {selectedServiceType.name}
                      </Text>

                      {(selectedServiceType.requirements.length !== 0 && (
                        <Text style={[Fonts.textRegular, Gutters.smallBMargin]}>
                          Requirements: {selectedServiceType.requirements}
                        </Text>
                      )) || <View />}
                    </View>
                  )}
                  <TextInput
                    label="Description"
                    value={values.description}
                    multiline
                    keyboardType="default"
                    onSubmitEditing={() => {
                      Keyboard.dismiss();
                    }}
                    blurOnSubmit
                    onBlur={handleBlur('description')}
                    onChangeText={handleChange('description')}
                    style={[Common.textInput]}
                    error={error('description')}
                  />
                  <HelperText style={Common.errorStyle} type="error" visible={error('description')}>
                    {error('description')}
                  </HelperText>
                  <View style={[Layout.row]}>
                    <UploadDocumentButton
                      title="Take Photo"
                      style={[Layout.fill, Gutters.tinyRMargin]}
                      disabled={isSubmitting}
                      onImageSelect={(images) => {
                        const uniqueImages = [...new Set([...values.images, ...images])];
                        setThumbNailImages(uniqueImages);
                      }}
                    />

                    <Button
                      mode="contained"
                      style={[Layout.fill, Gutters.tinyLMargin]}
                      onPress={() => handleSubmissionFormik(values)}
                      loading={isSubmitting}
                      disabled={isSubmitting}
                    >
                      Submit
                    </Button>
                  </View>
                </>
              )}
            </>
          );
        }}
      </Formik>
    </View>
  );
};

CreateServiceRequestForm.propTypes = {
  submitForm: PropTypes.func.isRequired,
  initialValues: PropTypes.object.isRequired,
  onSuccess: PropTypes.func,
  containerStyle: ViewPropTypes.style,
  municipalities: PropTypes.object.isRequired,
  setThumbNailImages: PropTypes.func.isRequired,
  thumbNailImages: PropTypes.array,
};

CreateServiceRequestForm.defaultProps = {
  onSuccess: () => null,
  containerStyle: {},
  thumbNailImages: [],
};

const styles = StyleSheet.create({
  listItem: {
    backgroundColor: Colors.lightgray,
    marginLeft: 10,
    marginRight: 10,
    textAlign: 'center',
  },
  listItemTitleStyle: {
    textAlign: 'center',
  },

  textHeaderCategory: {
    fontWeight: 'bold',
    textAlign: 'center',
  },
  textHeaderChannel: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  textHeaderInstruction: {
    fontSize: 16,
    paddingBottom: 20,
    textAlign: 'center',
  },
  viewButton: {
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 0.16,
  },
  viewItemsCategoryContainer: {
    borderBottomWidth: 0,
    borderColor: Colors.lightMediumGray,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderWidth: 1,
  },
  viewItemsChannelContainer: {
    borderBottomWidth: 0,
    borderColor: Colors.lightMediumGray,
    borderWidth: 1,
  },
  viewItemsTypesContainer: {
    borderColor: Colors.lightMediumGray,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
    borderWidth: 1,
    padding: 10,
  },
  viewTextContainer: {
    flex: 1,
    justifyContent: 'center',
  },
});

export default CreateServiceRequestForm;
