import CreateAction from '../action-utilities/action-creator';

const reducerName = 'appTour';

const setTourNumber = CreateAction(reducerName, 'SET_TOUR_NUMBER');
export const setTourNumberAction = setTourNumber.action;

const setTourStep = CreateAction(reducerName, 'SET_TOUR-STEP');
export const setTourStepAction = setTourStep.action;

const initialState = {
  tourNumber: 1,
  tourStep: 1,
};

export const appTourSelector = (reducers) => reducers.appTourReducer;

export default function appTourReducer(state = initialState, action) {
  switch (action.type) {
    case setTourNumber.actionType:
      return {
        ...state,
        tourNumber: action.payload,
      };
    case setTourStep.actionType:
      return {
        ...state,
        tourStep: action.payload,
      };
    default:
      return state;
  }
}
