import _ from 'lodash';
import { flashService, serviceRequestService } from '../../services';
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
  await serviceRequestService
    .createServiceRequest(newServiceRequestForm, user)
    .then(async (response) => {
      const objID = _.get(response.data.Data, 'ObjID');
      const fileAttachment = _.get(newServiceRequestForm, 'imageUri');
      if (fileAttachment) {
        await _dispatch(uploadServiceRequestImage(objID, fileAttachment));
      }
    });
};

export const uploadServiceRequestImage = (objId, fileAttachment) => async (dispatch) => {
  dispatch(setIsLoadingServiceRequestsAction(true));
  await serviceRequestService
    .uploadServiceRequestPhoto(objId, fileAttachment)
    .then(() => dispatch(getServiceRequestsAction()))
    .finally(() => dispatch(setIsLoadingServiceRequestsAction(false)));
};
