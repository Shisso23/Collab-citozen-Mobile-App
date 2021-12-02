import appConfig from '../../../config';

const { apiUrl } = appConfig;

export default {
  getAccountMetersUrl: () => `${apiUrl}/function/getAccountMeters`,
  getWaterMeterReadingsUrl: () => `${apiUrl}/function/getMeterReadings/water`, // TODO
  getElectricityMeterReadingsUrl: () => `${apiUrl}/function/getMeterReadings/electricity`, // TODO
  submitMeterReadingsUrl: () => `${apiUrl}/Records/CreateUpdateRecord`,
  upLoadFile: () => `${apiUrl}/file/post`,
};
