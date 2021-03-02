import { flashService, serviceRequestService } from '../../services';
import {
  setIsLoadingServiceRequestsAction,
  setServiceRequestImageAction,
  setServiceRequestsAction,
} from './service-request.reducer';

export const getServiceRequestsAction = () => (dispatch) => {
  dispatch(setIsLoadingServiceRequestsAction(true));
  return serviceRequestService
    .getServiceRequests()
    .then((serviceRequests) => {
      dispatch(setServiceRequestsAction(serviceRequests));
    })
    .catch((error) => flashService.error(error.message))
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

export const getServiceRequestImageAction = () => (dispatch) => {
  return serviceRequestService
    .getServiceRequestImage()
    .then((response) => dispatch(setServiceRequestImageAction(response)))
    .catch(() => flashService.error('Could not fetch image'));
};
