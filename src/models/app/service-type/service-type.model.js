import _ from 'lodash';

export const serviceTypeModel = (_apiServiceTypeModel = {}) => ({
  id: _.get(_apiServiceTypeModel, 'obj_id', ''),
  name: _.get(_apiServiceTypeModel, 'name', ''),
  requirements: _.get(_apiServiceTypeModel, 'requirements', ''),
  aliases: _.get(_apiServiceTypeModel, 'aliases', ''),
});

export const constructServiceTypeModelsArr = (apiServiceTypes) =>
  apiServiceTypes.map((serviceType) => serviceTypeModel(serviceType));

export const constructServiceTypeModels = (apiServiceTypes) =>
  apiServiceTypes
    ? apiServiceTypes.reduce((acc, current) => {
        return {
          ...acc,
          [current.category]: constructServiceTypeModelsArr(
            apiServiceTypes.filter((item) => item.category === current.category),
          ),
        };
      }, {})
    : {};
