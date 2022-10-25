import { setTourNumberAction, setTourStepAction } from './app-tour.reducer';

export const setAppTourAction =
  ({ tourNumber, step }) =>
  (dispatch) => {
    dispatch(setTourNumberAction(tourNumber));
    dispatch(setTourStepAction(step));
  };
