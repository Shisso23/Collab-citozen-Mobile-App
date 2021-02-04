import { municipalityService } from '../../services';
import { setMunicipalitiesAction } from './municipalities.reducer';

export const getMunicipalitiesAction = () => async (dispatch) => {
  const municipalities = await municipalityService.getMunicipalities();
  dispatch(setMunicipalitiesAction(municipalities));
};
