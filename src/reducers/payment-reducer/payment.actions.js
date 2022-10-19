import { setPayAtTokenAction, setIsLoadingGetPayAtTokenAction } from './payment.reducer';
import { paymentService } from '../../services';

export const getNotificationsAction = async () => {
  return async (dispatch) => {
    dispatch(setIsLoadingGetPayAtTokenAction(true));
    return paymentService.getPayAtAuthToken
      .then((token) => dispatch(setPayAtTokenAction(token)))
      .finally(() => dispatch(setIsLoadingGetPayAtTokenAction(false)));
  };
};
