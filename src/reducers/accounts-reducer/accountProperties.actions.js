import accountPropertyService from '../../services/sub-services/accounts-service/accounts.property.service';
import { setAccountsAction, setIsLoadingAccountsRequestAction } from './accountProperties.reducer';

export const getAccountsAction = () => (dispatch) => {
  dispatch(setIsLoadingAccountsRequestAction(true));
  return accountPropertyService
    .getAccounts()
    .then((accounts) => {
      dispatch(setAccountsAction(accounts));
    })
    .finally(() => dispatch(setIsLoadingAccountsRequestAction(false)));
};
