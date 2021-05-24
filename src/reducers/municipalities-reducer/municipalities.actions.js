import { municipalityService } from '../../services';
import { setMunicipalitiesAction } from './municipalities.reducer';

export const getMunicipalitiesAction = () => async (dispatch) => {
  const channles = await municipalityService.getChannlesByLocation();
  dispatch(setMunicipalitiesAction(channles));
};
