import _ from 'lodash';

const formatCoordinate = ({ location }) => `Point(${location.latitude},${location.longitude})`;

export const createServiceRequestModel = (_initialValues = {}) => ({
  account: _.get(_initialValues, 'account', null),
  serviceTypeCategory: _.get(_initialValues, 'serviceTypeCategory', ''),
  serviceType: _.get(_initialValues, 'serviceType', null),
  description: _.get(_initialValues, 'description', ''),
  location: _.get(_initialValues, 'location', null),
  imageUri: _.get(_initialValues, 'imageUri', ''),
});

export const apiCreateServiceRequestModel = (_serviceRequestForm = {}, _userInformation = {}) => ({
  TemplateId: 9,
  BPID: 3,
  PercentComplete: 100,
  Comments: 'Feedback done from OpenUp',
  FormFields: [
    { FieldID: 'F1', FieldValue: _.get(_serviceRequestForm, 'serviceType.name', '') }, // Service Request Type
    { FieldID: 'F2', FieldValue: _.get(_userInformation, 'firstName', '') }, // firstName
    { FieldID: 'F3', FieldValue: _.get(_userInformation, 'lastName', '') }, // lastName
    { FieldID: 'F4', FieldValue: _.get(_userInformation, 'mobileNumber', '') }, // User mobile
    { FieldID: 'F5', FieldValue: _.get(_userInformation, 'email', '') }, // User email
    { FieldID: 'F7', FieldValue: _.get(_serviceRequestForm, 'account.streetName', '') }, //  Street name
    { FieldID: 'F8', FieldValue: _.get(_serviceRequestForm, 'account.streetNumber', '') }, // Street number
    { FieldID: 'F9', FieldValue: _.get(_serviceRequestForm, 'account.suburb', '') }, // Suburb
    { FieldID: 'F10', FieldValue: _.get(_serviceRequestForm, 'description', '') }, // Description
    { FieldID: 'F11', FieldValue: formatCoordinate(_serviceRequestForm) }, // GPS position
    { FieldID: 'F12', FieldValue: new Date() }, // Date
    { FieldID: 'F13', FieldValue: '12345' }, // mobile referece
    { FieldID: 'F20', FieldValue: _.get(_serviceRequestForm, 'account.municipalityCode', '') }, // municipalityCode
  ],
});
