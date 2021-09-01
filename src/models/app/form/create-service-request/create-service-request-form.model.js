import _ from 'lodash';
import { apiFormatTime } from '../../../../helpers/time.helper';

const formatCoordinate = ({ location }) => `Point(${location.longitude} ${location.latitude})`;

export const createServiceRequestModel = (_initialValues = {}) => ({
  channel: _.get(_initialValues, 'channels', ''),
  serviceTypeCategory: _.get(_initialValues, 'serviceTypeCategory', ''),
  serviceType: _.get(_initialValues, 'serviceType', null),
  description: _.get(_initialValues, 'description', ''),
  location: _.get(_initialValues, 'location', null),
  images: _.get(_initialValues, 'images', ''),
  municipalityCode: _.get(_initialValues, 'municipalityCode', ''),
  address: _.get(_initialValues, 'address', ''),
  channelRef: _.get(_initialValues, 'channelRef', ''),
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
    { FieldID: 'F10', FieldValue: _.get(_serviceRequestForm, 'description', '') }, // Description
    { FieldID: 'F11', FieldValue: formatCoordinate(_serviceRequestForm) }, // GPS position
    { FieldID: 'F12', FieldValue: apiFormatTime(new Date()) }, // Date
    { FieldID: 'F13', FieldValue: '12345' }, // mobile referece
    { FieldID: 'F20', FieldValue: _.get(_serviceRequestForm, 'municipalityCode', '') }, // municipalityCode
    { FieldID: 'F24', FieldValue: _.get(_serviceRequestForm, 'address', '') }, // Address: Street Number + Street Name + suburb
    { FieldID: 'F27', FieldValue: _.get(_serviceRequestForm, 'channelRef', '') }, // Channel id
    { FieldID: 'F32', FieldValue: _.get(_serviceRequestForm, 'serviceType.id', '') }, // Service Request Type ObjId
  ],
});
