import { serviceRequestService } from '../../services';
import {
  prependServiceRequestAction,
  setIsLoadingServiceRequestsAction,
  setServiceRequestsAction,
} from './service-request.reducer';

export const getServiceRequestsAction = () => (dispatch) => {
  dispatch(setIsLoadingServiceRequestsAction(true));
  return serviceRequestService
    .getServiceRequests()
    .then((serviceRequests) => {
      dispatch(setServiceRequestsAction(serviceRequests));
    })
    .finally(() => {
      dispatch(setIsLoadingServiceRequestsAction(false));
    });
};

export const createServiceRequestAction = (newServiceRequestForm) => (dispatch) => {
  return serviceRequestService
    .createServiceRequest(newServiceRequestForm)
    .then((newServiceRequest) => {
      dispatch(prependServiceRequestAction(newServiceRequest));
    });
};
