import CreateAction from '../action-utilities/action-creator';

const reducerName = 'municipalities';

const setMunicipalities = CreateAction(reducerName, 'SET_MUNICIPALITIES');
export const setMunicipalitiesAction = setMunicipalities.action;

const initialState = {
  municipalities: [],
};

export const municipalitiesSelector = (reducers) => reducers.municipalitiesReducer;

export default function municipalitiesReducer(state = initialState, action) {
  switch (action.type) {
    case setMunicipalities.actionType:
      console.log({ payLoad: action.payload });
      return {
        ...state,
        municipalities: action.payload,
      };
    default:
      return state;
  }
}
