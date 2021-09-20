import CreateAction from '../action-utilities/action-creator';

const reducerName = 'serviceRequest';

const setServiceRequests = CreateAction(reducerName, 'SET_SERVICE_REQUESTS');
export const setServiceRequestsAction = setServiceRequests.action;

const setIsLoadingServiceRequests = CreateAction(reducerName, 'SET_IS_LOADING_SERVICE_REQUESTS');
export const setIsLoadingServiceRequestsAction = setIsLoadingServiceRequests.action;

const prependServiceRequest = CreateAction(reducerName, 'PREPEND_SERVICE_REQUEST');
export const prependServiceRequestAction = prependServiceRequest.action;

const setImagesSources = CreateAction(reducerName, 'SET_IMAGES_SOURCES');
export const setImagesSourcesAction = setImagesSources.action;

const initialState = {
  serviceRequests: [],
  isLoadingServiceRequests: false,
  imagesSources: [],
  isLoadingDeleteServiceRequest: false,
  deleteServiceRequestPreview: true,
};

export const serviceRequestSelector = (reducers) => reducers.serviceRequestReducer;

const setDeleteServiceRequest = CreateAction(reducerName, 'SET_DELETE_SERVICE_REQUEST');
export const setDeleteServiceRequestAction = setDeleteServiceRequest.action;

const setIsLoadingDeleteServiceRequest = CreateAction(
  reducerName,
  'SET_IS_LOADING_DELETE_SERVICE-REQUEST',
);
export const setIsLoadingDeleteServiceRequestAction = setIsLoadingDeleteServiceRequest.action;

const setDeleteServiceRequestPreview = CreateAction(
  reducerName,
  'SET_DELETE_SERVICE_REQUEST_PREVIEW',
);
export const setDeleteServiceRequestPreviewAction = setDeleteServiceRequestPreview.action;

export default function serviceRequestReducer(state = initialState, action) {
  switch (action.type) {
    case setServiceRequests.actionType:
      return {
        ...state,
        serviceRequests: action.payload,
      };
    case setIsLoadingServiceRequests.actionType:
      return {
        ...state,
        isLoadingServiceRequests: action.payload,
      };
    case prependServiceRequest.actionType:
      return {
        ...state,
        serviceRequests: [action.payload, ...state.serviceRequests],
      };
    case setImagesSources.actionType:
      return {
        ...state,
        imagesSources: action.payload,
      };
    case setDeleteServiceRequestPreview.actionType:
      return {
        ...state,
        deleteServiceRequestPreview: action.payload,
      };
    case setIsLoadingDeleteServiceRequest.actionType:
      return {
        ...state,
        isLoadingDeleteServiceRequest: action.payload,
      };
    default:
      return state;
  }
}
