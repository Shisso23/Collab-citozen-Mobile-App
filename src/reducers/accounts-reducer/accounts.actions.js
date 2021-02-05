import accountsService from '../../services/sub-services/accounts-service/accounts.service';
import { setAccountsAction, setIsLoadingAccountsRequestAction } from './accounts.reducer';

export const getAccountsAction = () => (dispatch) => {
  dispatch(setIsLoadingAccountsRequestAction(true));
  return accountsService
    .getAccounts()
    .then((accounts) => {
      dispatch(setAccountsAction(accounts));
    })
    .finally(() => dispatch(setIsLoadingAccountsRequestAction(false)));
};
