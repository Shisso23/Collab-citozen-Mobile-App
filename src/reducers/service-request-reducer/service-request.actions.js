import { serviceRequestService } from '../../services';
import {
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

export const createServiceRequestAction = (newServiceRequestForm) => async (
  _dispatch,
  getState,
) => {
  const { user } = getState().userReducer;
  await serviceRequestService.createServiceRequest(newServiceRequestForm, user);
};
