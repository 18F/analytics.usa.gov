import d3 from "d3";

const DISPLAY_THRESHOLD = 0.1;
/**
 * listify an Object into its key/value pairs (entries) and sorting by
 * numeric value descending.
 *
 * @param {object} obj the object
 * @returns {object[]} the listified object keys
 */
function listify(obj) {
  return d3.entries(obj).sort((a, b) => d3.descending(+a.value, +b.value));
}

/**
 * Given an object list returns a list of the values in the values key
 * @param {object[]} list - a list of data listed as a proportion of the total
 * visits
 * @returns {string|number|boolean[]} a list of the values in the values key
 */
function extractArrayValue(list) {
  return list.map((item) => item.value);
}

/**
 * @param {object[]} list a list of objects with data values nested
 * @param {Function} valueExtractMethod the function to extract the data from
 * the list items
 * @returns {object[]} a list with the initial list keys and now a percentage of
 * what share the list item is of the total
 */
function findProportionsOfMetric(list, valueExtractMethod) {
  const values = valueExtractMethod(list);
  const total = d3.sum(values);
  const newList = [];
  values.forEach((x, i) => {
    newList.push(list[i]);
    newList[i].proportion = (x / total) * 100;
  });
  return newList;
}

/**
 * @param {object[]} list the list of objects with data values nested
 * @returns {object[]} a closure of findProportionsOfMetric with the valueExtract
 * method set to extractArrayValue
 */
function findProportionsOfMetricFromValue(list) {
  return findProportionsOfMetric(list, extractArrayValue);
}

/**
 * @param {object[]} proportionsList a list of data listed as a proportion of
 * the total visits
 * @param {number} threshold threshold below which we consolidate the value into
 * an 'Other"
 * @returns {object[]} a list of percentages above the threshold
 */
function consolidateSmallValues(proportionsList, threshold) {
  const consolidatedList = [];
  const other = { key: "Other", proportion: 0, children: [] };
  proportionsList.forEach((item) => {
    if (item.proportion >= threshold) {
      consolidatedList.push(item);
    } else {
      other.proportion += item.proportion;
    }
  });
  consolidatedList.push(other);
  return consolidatedList;
}

/**
 * @param {object[]} dataSet the data to be tranformed
 * @param {string} desiredKey the key that we are interested in
 * @returns {object[]} a closure of consolidated smaller date from the proportions
 */
function toTopPercents(dataSet, desiredKey) {
  const values = listify(dataSet.totals["by_" + desiredKey]);
  const proportions = findProportionsOfMetricFromValue(values);
  return consolidateSmallValues(proportions, DISPLAY_THRESHOLD);
}

/**
 * @param {object[]} dataSet the data to be tranformed
 * @param {string} desiredKey the key that we are interested in
 * @returns {object[]} a closure of proportions with values below the display threshold
 * removed
 */
function toTopPercentsWithoutConsolidation(dataSet, desiredKey) {
  if (dataSet.totals) {
    const values = listify(dataSet.totals["by_" + desiredKey]);
    const proportions = findProportionsOfMetricFromValue(values);
    const filteredValues = values.filter((value, index) => {
      return proportions[index].proportion >= DISPLAY_THRESHOLD;
    });
    return findProportionsOfMetricFromValue(filteredValues);
  } else {
    return dataSet;
  }
}

function toTopPercentsWithMaxItems(dataSet, desiredKey, maxItems) {
  if (dataSet.totals) {
    const values = listify(dataSet.totals["by_" + desiredKey]);
    const proportions = findProportionsOfMetricFromValue(values);
    return consolidateValuesAfterListLength({ values: proportions, maxItems });
  } else {
    return dataSet;
  }
}

/**
 * @param {object} param the method parameters
 * @param {object[]} param.values the list of objects with proportions and
 * labels.
 * @param {number} param.maxItems the maximum length of the values array after
 * consolidating.
 * @param {string} param.labelKey the key in the object which should be set to
 * "Other" when creating a consolidated object to add to the array.
 * @returns {object[]} the values array limited to the maxItems count and having
 * items consolidated into an "other" object at the end of the array.
 */
function consolidateValuesAfterListLength({
  values = [],
  maxItems,
  labelKey = "key",
}) {
  if (!maxItems || values.length < maxItems) {
    return values;
  }

  const topValues = values.slice(0, maxItems - 1);
  const other = {
    [labelKey]: "Other",
    proportion: 0,
  };
  values.slice(maxItems - 1, values.length).forEach((value) => {
    other.proportion = other.proportion + value.proportion;
  });

  if (other.proportion > 0) {
    topValues.push(other);
  }
  return topValues;
}

export default {
  listify,
  findProportionsOfMetric,
  findProportionsOfMetricFromValue,
  toTopPercents,
  toTopPercentsWithoutConsolidation,
  toTopPercentsWithMaxItems,
  extractArrayValue,
  consolidateSmallValues,
  consolidateValuesAfterListLength,
};
