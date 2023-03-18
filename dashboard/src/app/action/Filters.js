export const ON_FILTER = "ON_FILTER";
export const ON_CLEAR_FILTERS = "ON_CLEAR_FILTERS";

export const onFilter = (payload) => {
  return {
    type: ON_FILTER,
    payload,
  };
};

export const onClearFilters = () => {
  return {
    type: ON_CLEAR_FILTERS,
  };
};
