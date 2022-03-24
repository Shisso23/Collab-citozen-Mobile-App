import CreateAction from '../action-utilities/action-creator';

const reducerName = 'myChannels';

const setMyChannels = CreateAction(reducerName, 'SET_MY_CHANNELS');
export const setMyChannelsAction = setMyChannels.action;

const setIsLoadingMyChannels = CreateAction(reducerName, 'SET_IS_LOADING_MY_CHANNELS');
export const setIsLoadingMyChannelsAction = setIsLoadingMyChannels.action;

const setLoadedBannerImages = CreateAction(reducerName, 'SET_LOADED_BANNER_IMAGES');
export const setLoadedBannerImagesAction = setLoadedBannerImages.action;

const setImportedBannerImagesChannels = CreateAction(reducerName, 'SET_IMPORTED_BANNER_IMAGES');
export const setImportedBannerImagesChannelsAction = setImportedBannerImagesChannels.action;

const initialState = {
  myChannels: [],
  isLoadingMyChannels: false,
  loadedBannerImages: false,
  importedBannerImagesChannels: [],
};

export const myChannelsSelector = (reducers) => reducers.myChannelsReducer;

export default function newsFeedsReducer(state = initialState, action) {
  switch (action.type) {
    case setMyChannels.actionType:
      return {
        ...state,
        myChannels: action.payload,
      };
    case setIsLoadingMyChannels.actionType:
      return {
        ...state,
        isLoadingMyChannels: action.payload,
      };
    case setLoadedBannerImages.actionType:
      return {
        ...state,
        loadedBannerImages: action.payload,
      };
    case setImportedBannerImagesChannels.actionType:
      return {
        ...state,
        importedBannerImagesChannels: action.payload,
      };
    default:
      return state;
  }
}
