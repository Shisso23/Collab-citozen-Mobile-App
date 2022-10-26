import { setPayAtTokenAction, setIsLoadingGetPayAtTokenAction } from './payment.reducer';
import { paymentService } from '../../services';

export const getUserTokenAction = async () => {
  return async (dispatch) => {
    dispatch(setIsLoadingGetPayAtTokenAction(true));
    return paymentService
      .getUserToken()
      .then((token) => dispatch(setPayAtTokenAction(token)))
      .finally(() => dispatch(setIsLoadingGetPayAtTokenAction(false)));
  };
};
