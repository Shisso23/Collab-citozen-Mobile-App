import appConfig from '../../../config';

const { hostUrl, apiUrl } = appConfig;
export default {
  tokenUrl: () => `${apiUrl}/MobileToken/GetTokenForUser`,
  registerUrl: () => `${hostUrl}/users`,
  forgotPasswordUrl: () => `${apiUrl}/Account/ResetPassword`,
};
