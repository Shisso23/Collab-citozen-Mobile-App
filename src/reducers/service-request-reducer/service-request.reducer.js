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
};

export const serviceRequestSelector = (reducers) => reducers.serviceRequestReducer;

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
    default:
      return state;
  }
}
