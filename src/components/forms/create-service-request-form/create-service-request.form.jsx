import React, { useEffect, useState, useRef } from 'react';
import { ViewPropTypes, View, Keyboard, StyleSheet, Switch } from 'react-native';
import PropTypes from 'prop-types';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { Button, HelperText, TextInput } from 'react-native-paper';
import { Text } from 'react-native-elements';
import { useNavigation, useRoute } from '@react-navigation/native';
import _ from 'lodash';
import { useDispatch } from 'react-redux';

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
import Categories from '../../molecules/service-request-categories/categories';
import { Colors } from '../../../theme/Variables';
import CategoriesListView from '../../molecules/service-request-categories/categories-list-view';
import { setImagesSources } from '../../../reducers/service-request-reducer/service-request.actions';

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
  const dispatch = useDispatch();
  const { params } = useRoute();
  const selectedCoordinates = params?.mapPosition;
  const addressSelected = params?.selectedAddress;
  const [searchValue, setSearchValue] = useState('');
  const navigation = useNavigation();
  const formikRef = useRef(null);
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [switchEnabled, setSwitchEnabled] = useState(false);
  const [selectedServiceType, setSelectedServiceType] = useState(null);
  const [municipalitiesSearchResult, setMunicipalitiesSearchResult] = useState(municipalities);

  useEffect(() => {
    if (searchValue.length > 0) {
      setMunicipalitiesSearchResult(handleServiceTypesSearch(searchValue));
      if (!switchEnabled) {
        setSwitchEnabled(true);
      }
      if (!showAllCategories) {
        setShowAllCategories(true);
      }
      if (selectedChannel) {
        resetMunicipalityTypeSelected();
      }
    } else {
      setMunicipalitiesSearchResult(municipalities);
    }
  }, [searchValue]);

  useEffect(() => {
    formikRef.current.setFieldValue('channel', _.get(selectedChannel, 'name', null));
    formikRef.current.setFieldValue('serviceTypeCategory', _.get(selectedCategory, 'name', null));
    formikRef.current.setFieldValue('channelRef', _.get(selectedChannel, 'id', null));
    formikRef.current.setFieldValue(
      'municipalityCode',
      _.get(selectedChannel, 'municipalityCode', null),
    );
    formikRef.current.setFieldValue('serviceType', selectedServiceType);
  }, [JSON.stringify(selectedServiceType)]);

  const onCategoryPress = (category) => {
    setSelectedCategory(category);
    setShowAllCategories(true);
    setMunicipalitiesSearchResult(filterToSingleCategory(category.id));
    setSwitchEnabled(true);
  };
  const setChannel = (channel) => {
    setSelectedChannel(channel);
  };

  const filterToSingleCategory = (categoryId) => {
    const result = municipalities
      .map((municipality) => {
        const municipalityResult = _.clone(municipality);
        municipalityResult.categories = municipality.categories.filter((category) => {
          return category.id === categoryId;
        });

        return municipalityResult;
      })
      .filter((municipalityResult_) => municipalityResult_.categories.length !== 0);
    return result;
  };

  const toggleSwitch = (value) => {
    setSwitchEnabled(value);
    if (value === false) {
      resetMunicipalityTypeSelected();
      setMunicipalitiesSearchResult(municipalities);

      if (showAllCategories) {
        setShowAllCategories(false);
      }
    } else {
      setShowAllCategories(true);
    }
  };

  const resetMunicipalityTypeSelected = () => {
    setSelectedServiceType(null);
    setSelectedCategory(null);
    setSelectedChannel(null);
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
    actions.setFieldError('account', _.get(error, 'message', ''));
  };

  const _handleSubmission = (formData, actions) => {
    submitForm(formData)
      .then(() => {
        actions.setSubmitting(false);
        onSuccess();
      })
      .catch((error) => _handleFormSubmitError(error, actions, formData));
  };

  const handleServiceTypeSelected = (serviceType) => {
    setSelectedServiceType(serviceType);
    if (showAllCategories) {
      setShowAllCategories(false);
    }
  };

  const handleCategorySelected = (category) => {
    setSelectedCategory(category);
  };

  const handleChangeServiceTypePressed = () => {
    resetMunicipalityTypeSelected();
    setShowAllCategories(true);
    setMunicipalitiesSearchResult(municipalities);
    setThumbNailImages([]);
    formikRef.current.setFieldValue('images', []);
    dispatch(setImagesSources([]));
  };

  const handleServiceTypesSearch = (searchKeyWord) => {
    if (searchKeyWord.length > 0) {
      const result = municipalities
        .map((municipality) => {
          const municipalityResult = _.clone(municipality);
          municipalityResult.categories = municipality.categories
            .map((category) => {
              const categoryResult = _.clone(category);
              const serviceTypes = categoryResult.serviceTypes.filter((serviceType) => {
                return (
                  `${serviceType.aliases}`.toLowerCase().includes(searchKeyWord.toLowerCase()) ||
                  `${serviceType.name}`.toLowerCase().includes(searchKeyWord.toLowerCase())
                );
              });
              categoryResult.serviceTypes = serviceTypes;
              return categoryResult;
            })
            .filter((category) => {
              return category.serviceTypes.length !== 0;
            });

          return municipalityResult;
        })
        .filter((municipalityResult_) => municipalityResult_.categories.length !== 0);
      return result;
    }
    return municipalities;
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
              {!selectedServiceType && (
                <View style={[styles.viewTextContainer]}>
                  <Text style={[Fonts.textRegular, styles.textHeaderInstruction, Fonts.titleTiny]}>
                    Select a Service Type
                  </Text>
                </View>
              )}
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
              {selectedServiceType === null && (
                <View style={[styles.switchView, Layout.rowBetween, Gutters.smallBMargin]}>
                  <Text style={[Fonts.textRegular, ...[{ fontSize: 15 }]]}>Change View</Text>
                  <Switch onValueChange={toggleSwitch} value={switchEnabled} />
                </View>
              )}
              {!switchEnabled && (
                <Categories
                  municipalities={municipalitiesSearchResult}
                  onCategoryPress={onCategoryPress}
                  setSelectedChanne={setChannel}
                />
              )}
              {showAllCategories && (
                <CategoriesListView
                  municipalities={municipalitiesSearchResult}
                  onCategorySelected={handleCategorySelected}
                  setSelectedChanne={setChannel}
                  onServiceTypeSelected={handleServiceTypeSelected}
                />
              )}
              {selectedServiceType && (
                <>
                  <Button
                    mode="contained"
                    style={[Layout.fill, Gutters.regularBMargin]}
                    onPress={handleChangeServiceTypePressed}
                  >
                    Change Type
                  </Button>

                  <View>
                    <Text style={[Fonts.textRegular, Gutters.smallBMargin]}>
                      Channel: {selectedChannel.name}
                    </Text>
                    <Text style={[Fonts.textRegular, Gutters.smallBMargin]}>
                      Channel Category: {selectedCategory.name}
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
  municipalities: PropTypes.array.isRequired,
  setThumbNailImages: PropTypes.func.isRequired,
  thumbNailImages: PropTypes.array,
};

CreateServiceRequestForm.defaultProps = {
  onSuccess: () => null,
  containerStyle: {},
  thumbNailImages: [],
};

const styles = StyleSheet.create({
  switchView: {
    width: '100%',
  },
  textHeaderInstruction: {
    fontSize: 16,
    paddingBottom: 20,
    textAlign: 'center',
  },
  viewTextContainer: {
    flex: 1,
    justifyContent: 'center',
  },
});

export default CreateServiceRequestForm;
