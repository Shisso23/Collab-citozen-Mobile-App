import _ from 'lodash';
import { constructServiceTypeModelsArr } from '../service-type/service-type.model';

const setRNElementsIconName = (name) => {
  switch (name) {
    case 'FontAwesome5':
      return 'font-awesome-5';
    case 'MaterialCommunityIcons':
      return 'material-community';
    case 'FontAwesome':
      return 'font-awesome';
    case 'MaterialIcons':
      return 'material';
    case 'Ionicons':
      return 'ionicon';
    case 'Entypo':
      return 'entypo';
    case 'Fontisto':
      return 'fontisto';
    case 'Feather':
      return 'feather';
    default:
      return 'font-awesome';
  }
};

export const municipalityModel = (_apiMunicipalityModel = {}) => ({
  id: _.get(_apiMunicipalityModel, 'obj_id', ''),
  municipalityCode: _.get(_apiMunicipalityModel, 'code', ''),
  name: _.get(_apiMunicipalityModel, 'name', ''),
  accountApplicable: _.get(_apiMunicipalityModel, 'account_no_applicable', null) === 'Yes',
  categories: constructServiceRequestCategoryModels(
    _.get(_apiMunicipalityModel, 'service_categories', []),
  ),
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

export const categoryModel = (_apiCategoryModel = {}) => ({
  id: _.get(_apiCategoryModel, 'obj_id', ''),
  iconSet: setRNElementsIconName(_.get(_apiCategoryModel, 'icon_set', 'font-awesome')),
  iconName: _.get(_apiCategoryModel, 'icon_name', 'home'),
  name: _.get(_apiCategoryModel, 'name', ''),
  favourite: _.get(_apiCategoryModel, 'favourite', null) === 'Yes',
  serviceTypes: constructServiceTypeModelsArr(_.get(_apiCategoryModel, 'service_types', [])),
});

export const constructServiceRequestCategoryModels = (apiCategoryModels) =>
  apiCategoryModels.map((category) => {
    return categoryModel(category);
  });
