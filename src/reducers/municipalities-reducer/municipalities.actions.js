import { municipalityService } from '../../services';
import { setMunicipalitiesAction } from './municipalities.reducer';

export const getMunicipalitiesAction = (longitude, latitude) => async (dispatch) => {
  const channles = await municipalityService.getServiceRequestChannlesByLocation(
    longitude,
    latitude,
  );
  dispatch(setMunicipalitiesAction(channles));
};
