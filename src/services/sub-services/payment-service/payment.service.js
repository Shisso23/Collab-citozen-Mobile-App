import globalServiceUrls from '../global/global.service.urls';
import { dataInitiatePayment } from '../../../helpers/api-function-name.helper';
import authNetworkService from '../auth-network-service/auth-network.service';

const initiatePayment = ({ accountNumber, amount }) => {
  const url = globalServiceUrls.createUpdateRecordUrl();
  const requestData = dataInitiatePayment('inititalPayment', accountNumber, amount);

  return authNetworkService.post(url, requestData).then((response) => {
    return response;
  });
};
export default {
  initiatePayment,
};
