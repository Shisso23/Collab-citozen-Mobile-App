import React, { useEffect, useState, useRef } from 'react';
import { ViewPropTypes, View, Keyboard } from 'react-native';
import PropTypes from 'prop-types';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { Button, HelperText, TextInput } from 'react-native-paper';
import { ListItem, Text } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
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
import { locationSelector } from '../../../reducers/location-reducer/location.reducer';
import UploadDocumentButton from '../../molecules/upload-document-button';

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
  const { Common, Layout, Gutters, Colors, Fonts } = useTheme();
  const { selectedAddress, region } = useSelector(locationSelector);
  const [address, setAddress] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const navigation = useNavigation();
  const formikRef = useRef(null);
  const [typeSelected, setTypeSelected] = useState(false);
  const [isExpandedState, setIsExpandedState] = useState(true);
  const [noIconState] = useState(true);
  const [channelChosenName, setChannelChosenName] = useState('');
  const [categoryChosenName, setCategoryChosenName] = useState('');
  const [typeChosenName, setTypeChosenName] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [allTypesStore, setAllTypesStore] = useState([]);

  useEffect(() => {
    _.map(Object.keys(municipalities), (municipalityRef) =>
      Object.keys(municipalities[`${municipalityRef}`].serviceTypes)?.map((categoryName) =>
        municipalities[`${municipalityRef}`].serviceTypes[`${categoryName}`].map(
          (serviceTypeObject) => {
            setAllTypesStore((allTypeStore) => [...allTypeStore, serviceTypeObject]);
            return null;
          },
        ),
      ),
    );
  }, []);

  useEffect(() => {
    formikRef.current.setFieldValue('images', thumbNailImages);
  }, [JSON.stringify(thumbNailImages)]);

  useEffect(() => {
    setAddress(selectedAddress);
  }, [selectedAddress]);

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

  const typeChosen = (channelName, categoryName, typeName) => {
    setTypeSelected(true);
    setIsExpandedState(false);
    setChannelChosenName(channelName);
    setCategoryChosenName(categoryName);
    setTypeChosenName(typeName);
  };

  const changeTypeButtonFunction = () => {
    setTypeSelected(false);
    setIsExpandedState(true);
  };

  const toggleisSearching = () => {
    setIsSearching(!isSearching);
  };

  const searchTypes = () => {
    const newList = [];
    for (let i = 0; i < allTypesStore.length; i += 1) {
      if (
        allTypesStore[i].name.includes(searchValue) ||
        allTypesStore[i].aliases.indexOf(searchValue.toLowerCase()) >= 0 ||
        allTypesStore[i].aliases.indexOf(searchValue) >= 0
      ) {
        newList.push(allTypesStore[i]);
      }
    }
    return newList;
  };

  const endSearchFunction = (channelName, categoryName, typeName) => {
    toggleisSearching();
    typeChosen(channelName, categoryName, typeName);
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
          const memoizedChannels = Object.keys(municipalities);
          const channelNames = [];

          for (let i = 0; i < Object.keys(municipalities).length; i += 1) {
            const municipalitiesData = municipalities[memoizedChannels[i]].name;
            channelNames.push(municipalitiesData);
          }

          useEffect(() => {
            if (channelNames.length === 1) {
              const [first] = channelNames;
              initialValues.channel = first;
            }
          }, [channelNames]);

          const getChannelFromSelectedServiceType = ({ selectedServiceType }) => {
            return Object.keys(municipalities).find((municipalityRef) =>
              municipalities[municipalityRef]?.serviceTypes[selectedServiceType.category]?.find(
                (serviceType) => serviceType.id === selectedServiceType.id,
              ),
            );
          };

          const setFormFields = ({ selectedChannel, selectedServiceType }) => {
            formikRef.current.setFieldValue('channel', selectedChannel.name);
            formikRef.current.setFieldValue('serviceTypeCategory', selectedServiceType.category);
            formikRef.current.setFieldValue('serviceType', selectedServiceType);
            formikRef.current.setFieldValue('municipalityCode', selectedChannel.municipalityCode);
            formikRef.current.setFieldValue('channelRef', selectedChannel.id);
          };

          const handleSubmissionFormik = (vals) => {
            setFieldValue('location', region);
            vals.location = region;
            setFieldValue('address', selectedAddress);
            vals.address = selectedAddress;
            handleSubmit();
          };

          const error = (name) => getFormError(name, { touched, status, errors });
          return (
            <>
              <TextInput
                value={address}
                label="Location Selected"
                underlineColor={Colors.transparent}
                onFocus={() => navigation.navigate('SelectLocationScreen')}
              />
              <HelperText />

              {!typeSelected && (
                <TextInput
                  value={searchValue}
                  label="Search..."
                  underlineColor={Colors.transparent}
                  onChangeText={(searchText) => {
                    setSearchValue(searchText);
                  }}
                  onChange={searchTypes}
                  onFocus={toggleisSearching}
                  onBlur={toggleisSearching}
                />
              )}
              <HelperText />

              {!typeSelected && !isSearching && (
                <>
                  {Object.keys(municipalities)?.map((municipalityRef) => (
                    <ListItem.Accordion
                      key={municipalityRef}
                      noIcon={noIconState}
                      underlayColor={Colors.transparent}
                      content={
                        <Text style={[Fonts.textRegular]}>
                          {municipalities[`${municipalityRef}`].name}
                        </Text>
                      }
                      containerStyle={{ backgroundColor: Colors.transparent }}
                      isExpanded={isExpandedState}
                    >
                      {Object.keys(municipalities[`${municipalityRef}`].serviceTypes)?.map(
                        (categoryName) => (
                          <ListItem.Accordion
                            key={categoryName}
                            noIcon={noIconState}
                            underlayColor={Colors.transparent}
                            content={
                              <Text style={[Fonts.textRegular]}>
                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{categoryName}
                              </Text>
                            }
                            containerStyle={{ backgroundColor: Colors.transparent }}
                            isExpanded={isExpandedState}
                          >
                            {municipalities[`${municipalityRef}`].serviceTypes[
                              `${categoryName}`
                            ].map((serviceTypeObject) => {
                              return (
                                <Button
                                  key={serviceTypeObject}
                                  mode="contained"
                                  style={[Layout.fill, Gutters.regularBMargin]}
                                  onPress={() => {
                                    typeChosen(
                                      municipalities[`${municipalityRef}`].name,
                                      categoryName,
                                      serviceTypeObject.name,
                                    );
                                    setFormFields({
                                      selectedChannel: municipalities[municipalityRef],
                                      selectedServiceType: serviceTypeObject,
                                    });
                                  }}
                                >
                                  {serviceTypeObject.name}
                                </Button>
                              );
                            })}
                          </ListItem.Accordion>
                        ),
                      )}
                    </ListItem.Accordion>
                  ))}
                </>
              )}

              {typeSelected && !isSearching && (
                <Button
                  mode="contained"
                  style={[Layout.fill, Gutters.regularBMargin]}
                  onPress={changeTypeButtonFunction}
                >
                  Change Type
                </Button>
              )}

              {typeSelected && !isSearching && (
                <Text style={[Fonts.textRegular]}>
                  Channel: {channelChosenName} {'\n'}
                  Channel Category: {categoryChosenName} {'\n'}
                  Selected Type: {typeChosenName} {'\n'}
                </Text>
              )}

              {typeSelected && !isSearching && (
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
              )}

              {isSearching &&
                searchTypes().map((item) => {
                  const itemChannelGetter = getChannelFromSelectedServiceType({
                    selectedServiceType: item,
                  });
                  return (
                    <View key={item}>
                      <Text style={[Fonts.textRegular, Gutters.smallBMargin]}>
                        {municipalities[itemChannelGetter].name} | {item.category}
                      </Text>
                      <Button
                        mode="contained"
                        style={[Layout.fill, Gutters.regularBMargin]}
                        onPress={() => {
                          const municipality = getChannelFromSelectedServiceType({
                            selectedServiceType: item,
                          });
                          endSearchFunction(
                            municipalities[municipality].name,
                            item.category,
                            item.name,
                          );
                          setFormFields({
                            selectedChannel: municipalities[municipality],
                            selectedServiceType: item,
                          });
                        }}
                      >
                        {item.name}
                      </Button>
                    </View>
                  );
                })}

              <HelperText style={Common.errorStyle} type="error" visible={error('description')}>
                {error('description')}
              </HelperText>

              {typeSelected && !isSearching && (
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

export default CreateServiceRequestForm;
