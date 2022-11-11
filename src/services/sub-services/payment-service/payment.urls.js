import appConfig from '../../../config';

const { paymentBaseUrl } = appConfig;

export default {
  getUserTokenUrl: () => `${paymentBaseUrl}/MobileToken/GetTokenForUser`,
  getAccountDetailsUrl: () => `${paymentBaseUrl}/Payment/account`,
  initPaymentUrl: () => `${paymentBaseUrl}/Payment/initiate`,
  createUpdateRecordUrl: () => `${appConfig.apiUrl}/Records/CreateUpdateRecord`,
};
