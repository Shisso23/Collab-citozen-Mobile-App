import appConfig from '../../../config';

const { payAtBaseUrl } = appConfig;

export default {
  initPaymentUrl: () => `${payAtBaseUrl}/payment/initiate`,
};
