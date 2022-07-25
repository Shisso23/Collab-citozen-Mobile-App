export const removeCountryFromAddress = (address) => address?.split(',').slice(0, 3).join(',');
