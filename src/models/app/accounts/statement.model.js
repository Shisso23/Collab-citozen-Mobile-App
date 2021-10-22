import _ from 'lodash';
import async from 'async';

import accountsUrls from '../../../services/sub-services/accounts-service/accounts.urls';
import storageService from '../../../services/sub-services/storage-service/storage.service';

const viewPdfUrl = (_apiModel, token) => {
  const fileId = _.get(_apiModel, 'file_id', null);
  const objId = _.get(_apiModel, 'obj_id', null);
  if (!fileId || fileId.length === 0) {
    return null;
  }
  const uri = accountsUrls.viewPdfUrl(fileId, objId);

  return {
    uri,
    timeout: 20000,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: true,
  };
};

export const statementModel = (_apiStatementModel, accessToken) => {
  return {
    statementPdf: viewPdfUrl(_apiStatementModel, accessToken),
    year: _.get(_apiStatementModel, 'year', null),
    month: _.get(_apiStatementModel, 'month', null),
    objectId: _.get(_apiStatementModel, 'obj_id', null),
    fileId: _.get(_apiStatementModel, 'file_id', null),
    outstandingBalance: _.get(_apiStatementModel, 'outstanding_balance', null),
  };
};

export const constructStatementModels = async (apiStatements) => {
  const token = await storageService.getAccessToken();
  return async.map(apiStatements, async (statement, done) => {
    const model = statementModel(statement, token);
    done(null, model);
  });
};
