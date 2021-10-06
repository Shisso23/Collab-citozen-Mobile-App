import _ from 'lodash';
import { flashService, serviceRequestService } from '../../services';
import {
  setIsLoadingServiceRequestsAction,
  setServiceRequestsAction,
  setImagesSourcesAction,
  setDeleteServiceRequestPreviewAction,
  setIsLoadingDeleteServiceRequestAction,
  setServiceRequestCommentsAction,
  setIsLoadingCommentsAction,
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

export const createServiceRequestAction =
  (newServiceRequestForm) => async (_dispatch, getState) => {
    const { user } = getState().userReducer;
    await serviceRequestService
      .createServiceRequest(newServiceRequestForm, user)
      .then(async (response) => {
        const objID = _.get(response.data.Data, 'ObjID');
        const fileAttachments = _.get(newServiceRequestForm, 'images');
        if (fileAttachments) {
          await _dispatch(uploadServiceRequestImages(objID, fileAttachments));
        }
      });
  };

export const uploadServiceRequestImages = (objId, fileAttachments) => async (dispatch) => {
  try {
    dispatch(setIsLoadingServiceRequestsAction(true));
    await fileAttachments.forEach(async (attachment) => {
      await serviceRequestService
        .uploadServiceRequestPhoto(objId, attachment)
        .then(() => dispatch(getServiceRequestsAction()));
    });
    flashService.success('Upload completed successfully');
  } catch (error) {
    flashService.error('Upload did not complete!');
  } finally {
    dispatch(setIsLoadingServiceRequestsAction(false));
  }
};

export const setImagesSources = (images) => async (dispatch) => {
  try {
    dispatch(setImagesSourcesAction(images));
  } catch (error) {
    console.warn('Could not set images');
  }
};

export const deleteServiceRequestAction = (channelId, serviceRequestId) => (dispatch) => {
  dispatch(setIsLoadingDeleteServiceRequestAction(true));
  return serviceRequestService
    .deleteServiceRequest(channelId, serviceRequestId)
    .then(async () => {
      dispatch(getServiceRequestsAction());
    })
    .finally(() => dispatch(setIsLoadingDeleteServiceRequestAction(false)));
};

export const getCommentsAction = (serviceRequestId) => (dispatch) => {
  dispatch(setIsLoadingCommentsAction(true));
  return serviceRequestService
    .getServiceRequestComments(serviceRequestId)
    .then(async (comments) => {
      dispatch(setServiceRequestCommentsAction(comments));
    })
    .finally(() => dispatch(setIsLoadingCommentsAction(false)));
};

export const previewDeleteServiceRequestAction = (shoudlPreview) => {
  return (dispatch) => dispatch(setDeleteServiceRequestPreviewAction(shoudlPreview));
};
