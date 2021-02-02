import accountsService from '../../services/sub-services/accounts-service/accounts.service';
import { setAccountsAction } from './accounts.reducer';

export const getAccountsAction = () => (dispatch) => {
  return accountsService.getAccounts().then((accounts) => {
    dispatch(setAccountsAction(accounts));
  });
};
