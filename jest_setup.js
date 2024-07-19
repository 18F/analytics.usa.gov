global.IS_REACT_ACT_ENVIRONMENT = true;

// Define the fetch method because without this we get the error 'fetch is not
// defined' in the tests.  TODO: figure out why node's native fetch doesn't
// show as defined in the tests.
window.fetch = jest.fn(() => {
  // Return a fake fetch Response object and a skeleton JSON report to avoid
  // errors in components that expect some keys to exist in the data.
  return {
    json: jest.fn(() => {
      return {
        data: [],
        meta: {},
        totals: {},
      };
    }),
  };
});
