const US_AND_TERRITORIES = [
  'United States',
  'Puerto Rico',
  'Guam',
  'U.S. Virgin Islands',
  'American Samoa',
  'Northern Mariana Islands',
];

const isPartOfUnitedStates = function (name) {
  return new RegExp(name).test(US_AND_TERRITORIES.join('|'));
};

export {
  US_AND_TERRITORIES,
  isPartOfUnitedStates,
};
