import d3 from 'd3';

const DISPLAY_THRESHOLD = 1;
/*
 * listify an Object into its key/value pairs (entries) and sorting by
 * numeric value descending.
 */
function listify(obj) {
  return d3.entries(obj)
    .sort((a, b) => d3.descending(+a.value, +b.value));
}

/*
 * @function extractArrayValue - given an object list returns a list of the values in the values key
 * @parameter list - a list of data listed as a proportion of the total visits
 * @return a list of the values in the values key
 */
function extractArrayValue(list) {
  return list.map((item) => item.value);
}

/*
 * @function findProportionsOfMetric
 * @parameter list -  a list of objects with data values nested
 * @parameter valueExtractMethod - the function to attract the data from the list items
 * @return a list with the initial list keys and now a percentage of what share the list item is
 * of the total
 */
function findProportionsOfMetric(list, valueExtractMethod) {
  const values = valueExtractMethod(list);
  const total = d3.sum(values);
  const newList = [];
  values.forEach((x, i) => {
    newList.push(list[i]);
    newList[i].proportion = ((x / total) * 100);
  });
  return newList;
}

/*
 * @function findProportionsOfMetricFromValue
 * @parameter list
 * @return a closure of findProportionsOfMetric with the valueExtract method
 * set to extractArrayValue
 */
function findProportionsOfMetricFromValue(list) {
  return findProportionsOfMetric(list, extractArrayValue);
}

/*
 * @function consolidateSmallValues
 * @parameter proportionsList - a list of data listed as a proportion of the total visits
 * @parameter threshold - threshold below which we consolidate the value into an 'Other"
 * @return a list of percentages above the threshold
 */
function consolidateSmallValues(proportionsList, threshold) {
  const consolidatedList = [];
  const other = { key: 'Other', proportion: 0, children: [] };
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

/*
 * @function toTopPercents
 * @parameter dataSet - the data to be tranformed
 * @parameter desiredKey - the key that we are interested
 * @return a closure of consolidated smaller date from the proportions
 */
function toTopPercents(dataSet, desiredKey) {
  console.warn(dataSet);
  const values = listify(dataSet.totals[desiredKey]);
  const proportions = findProportionsOfMetricFromValue(values);
  return consolidateSmallValues(proportions, DISPLAY_THRESHOLD);
}

export default {
  listify,
  findProportionsOfMetric,
  findProportionsOfMetricFromValue,
  toTopPercents,
  extractArrayValue,
  consolidateSmallValues,
};
