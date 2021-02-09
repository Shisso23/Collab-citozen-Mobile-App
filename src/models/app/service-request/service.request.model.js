import _ from 'lodash';

const constructAddress = (_apiServiceRequestModel) => {
  const streetName = _.get(_apiServiceRequestModel, 'street_name', '');
  const streetNumber = _.get(_apiServiceRequestModel, 'street_number', '');
  const suburb = _.get(_apiServiceRequestModel, 'suburb', '');
  return `${streetNumber} ${streetName}, ${suburb}`;
};

export const serviceRequestModel = (_apiServiceRequestModel = {}) => ({
  id: _.get(_apiServiceRequestModel, 'obj_id', ''),
  serviceType: _.get(_apiServiceRequestModel, 'service_type_id', ''),
  serviceDescription: _.get(_apiServiceRequestModel, 'description', ''),
  address: constructAddress(_apiServiceRequestModel),
  requestedDate: _.get(_apiServiceRequestModel, 'request_date', ''),
  referenceNumber: _.get(_apiServiceRequestModel, 'on_premises_ref', ''),
  avatarUrl: `https://loremflickr.com/320/240/landscape?random=${_.random(1000)}`,
});

export const constructServiceRequestModels = (apiServiceRequests) =>
  apiServiceRequests.map((serviceRequest) => serviceRequestModel(serviceRequest));
