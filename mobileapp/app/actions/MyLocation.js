export const ON_SET_LOCATION = 'ON_SET_LOCATION';

export const onSetLocation = payload => {
  return {
    type: ON_SET_LOCATION,
    payload,
  };
};
