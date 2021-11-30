import appConfig from '../../../config';

const { apiUrl } = appConfig;

export default {
  getAccountMetersUrl: () => `${apiUrl}/function/getAccountMeters`,
  getWaterMeterReadingsUrl: () => `${apiUrl}/function/getMeterReadings/water`,
  getElectricityMeterReadingsUrl: () => `${apiUrl}/function/getMeterReadings/electricity`,
  submitMeterReadingsUrl: () => `${apiUrl}/Records/CreateUpdateRecord/submitReading`,
};
