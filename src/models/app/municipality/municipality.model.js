import _ from 'lodash';
import { constructServiceTypeModels } from '../service-type/service-type.model';

export const municipalityModel = (_apiMunicipalityModel = {}) => ({
  id: _.get(_apiMunicipalityModel, 'obj_id', ''),
  municipalityCode: _.get(_apiMunicipalityModel, 'code', ''),
  name: _.get(_apiMunicipalityModel, 'name', ''),
  accountNoApplicable: _.get(_apiMunicipalityModel, 'account_no_applicable', ''),
  serviceTypes: constructServiceTypeModels(_.get(_apiMunicipalityModel, 'service_types', [])),
});

export const constructMunicipalityModelsArr = (apiMunicipalitys) =>
  apiMunicipalitys.map((municipality) => municipalityModel(municipality));

export const constructMunicipalityModels = (apiMunicipalityModel) =>
  apiMunicipalityModel.reduce((acc, current) => {
    return {
      ...acc,
      [current.code]: municipalityModel(current),
    };
  }, {});
