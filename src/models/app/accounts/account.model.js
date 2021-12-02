import _ from 'lodash';
import { constructMeterModels } from '../account-meters/account-meters.model';

export const accountModel = (_apiAccountModel = {}) => ({
  objectId: _.get(_apiAccountModel, 'obj_id', ''),
  accountNumber: _.get(_apiAccountModel, 'account_number', ''),
  accountName: _.get(_apiAccountModel, 'account_name', ''),
  status: _.get(_apiAccountModel, 'status', ''),
  statements: _.get(_apiAccountModel, 'statements', []),
  statusText: _.get(_apiAccountModel, 'status_text', ''),
  meters: constructMeterModels(_.get(_apiAccountModel, 'meters', [])),
});

export const constructAccountModels = (apiAccounts) =>
  apiAccounts.map((account) => accountModel(account));
