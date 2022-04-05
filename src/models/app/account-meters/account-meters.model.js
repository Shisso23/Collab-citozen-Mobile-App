import _ from 'lodash';

export const meterModel = (_apiMeterModel = {}) => ({
  objId: _.get(_apiMeterModel, 'obj_id', ''),
  type: _.get(_apiMeterModel, 'meter_type', ''),
  meterNumber: _.get(_apiMeterModel, 'meter_device_id', ''),
  lastReadingValue: _.get(_apiMeterModel, 'lastReadingValue', 231523), // TODO get this from endpoint
  lastReadingDate: _.get(_apiMeterModel, 'lastReadingDate', new Date()), // TODO get this from endpoint
  averageReading: _.get(_apiMeterModel, 'averageReading', ''), // TODO Calculate , get it from endpoint
});

export const constructMeterModels = (_apiMeters) => {
  return _apiMeters?.map((meter) => meterModel(meter));
};

export const meterReadingModel = (_apiMeterReadingModel = {}) => ({
  objId: _.get(_apiMeterReadingModel, 'obj_id', ''),
  type: _.get(_apiMeterReadingModel, 'type', ''),
  readingNumber: _.get(_apiMeterReadingModel, 'meter_reading', ''),
  date: _.get(_apiMeterReadingModel, 'date_created', ''),
});

export const constructMeterReadingsModels = (apiMeterReadingsModel) => {
  return {
    objectId: _.get(apiMeterReadingsModel, 'last_meter_reading', ''),
    lastMeterReading: _.get(apiMeterReadingsModel, 'last_meter_reading', ''),
    meterNumber: _.get(apiMeterReadingsModel, 'meter_device_id', ''),
    meterReadings: _.get(apiMeterReadingsModel, 'meter_readings', []).map((apiMeterReadingModel) =>
      meterReadingModel(apiMeterReadingModel),
    ),
  };
};
