import _ from 'lodash';

const constructAddress = (_apiServiceRequestModel) => {
  const streetName = _.get(_apiServiceRequestModel, 'F7', '');
  const streetNumber = _.get(_apiServiceRequestModel, 'F8', '');
  const suburb = _.get(_apiServiceRequestModel, 'F9', '');
  return `${streetNumber} ${streetName}, ${suburb}`;
};

export const serviceRequestModel = (_apiServiceRequestModel = {}) => ({
  id: _.get(_apiServiceRequestModel, 'obj_id', ''),
  compliantType: _.get(_apiServiceRequestModel, 'F1', ''),
  compliant: _.get(_apiServiceRequestModel, 'F10', ''),
  address: constructAddress(_apiServiceRequestModel),
  complaintDate: _.get(_apiServiceRequestModel, 'F12', ''),
  referenceNumber: _.get(_apiServiceRequestModel, 'F13', ''),
  avatarUrl: `https://loremflickr.com/320/240/landscape?random=${_.random(1000)}`,
});

export const constructServiceRequestModels = (apiServiceRequests) =>
  apiServiceRequests.map((serviceRequest) => serviceRequestModel(serviceRequest));
