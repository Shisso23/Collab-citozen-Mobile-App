export const apiFunctionWithUniqName = async (functionName) => {
  return {
    taskID: 0,
    uniqName: `${functionName}`,
    InputValues: ``,
  };
};

export const apiFunctionWithUniqNameChannels = async (functionName) => {
  return {
    taskID: 0,
    uniqName: `${functionName}`,
    InputValues: `<valRoot><val> long,lat  </val></valRoot>`,
  };
};
