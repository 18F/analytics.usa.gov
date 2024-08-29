const US_AND_TERRITORIES = [
  "United States",
  "Puerto Rico",
  "Guam",
  "U.S. Virgin Islands",
  "American Samoa",
  "Northern Mariana Islands",
];

/**
 * @param {string} name a name of a location
 * @returns {boolean} true if the name is US or a US territory
 */
const isPartOfUnitedStates = (name) => {
  return US_AND_TERRITORIES.includes(name);
};

export { US_AND_TERRITORIES, isPartOfUnitedStates };
