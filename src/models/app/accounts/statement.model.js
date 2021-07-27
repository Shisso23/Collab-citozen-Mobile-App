import _ from 'lodash';
import async from 'async';

import accountsUrls from '../../../services/sub-services/accounts-service/accounts.urls';
import storageService from '../../../services/sub-services/storage-service/storage.service';

const viewPdfUrl = (_apiModel, token) => {
  const fileId = _.get(_apiModel, 'file_id');
  const objId = _.get(_apiModel, 'obj_id');
  if (!fileId) {
    return null;
  }
  const uri = accountsUrls.viewPdfUrl(fileId, objId);

  return {
    uri,
    timeout: 20000,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const statementModel = (_apiStatementModel, accessToken) => ({
  statementPdf: viewPdfUrl(_apiStatementModel, accessToken),
});

export const constructStatementModels = async (apiStatements) => {
  const token = await storageService.getAccessToken();
  console.log({ st: apiStatements });
  return async.map(apiStatements, async (statement, done) => {
    const model = statementModel(statement, token);
    done(null, model);
  });
};
