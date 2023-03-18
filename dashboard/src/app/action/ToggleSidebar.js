export const ON_TOGGLE = "ON_TOGGLE";

export const onToggle = (payload) => {
  return {
    type: ON_TOGGLE,
    payload,
  };
};
