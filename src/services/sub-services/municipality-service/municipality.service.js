import { mockRequest } from '../../../dummy-data/mock-api';
import { municipalities } from '../../../dummy-data/municipalities';
import { constructMunicipalityModels } from '../../../models';

const getMunicipalities = () => {
  return mockRequest(municipalities)
    .get()
    .then((apiResponse) => constructMunicipalityModels(apiResponse.data.Data));
};

export default {
  getMunicipalities,
};
