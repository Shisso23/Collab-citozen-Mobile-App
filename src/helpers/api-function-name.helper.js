import storageService from '../services/sub-services/storage-service/storage.service';

export const apiFunctionWithUniqName = async (functionName) => {
  const email = await storageService.getEmail();
  return {
    taskID: 0,
    uniqName: `${functionName}`,
    InputValues: `<valRoot><val>${email}</val></valRoot>`,
  };
};
