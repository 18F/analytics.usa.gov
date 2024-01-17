import d3 from 'd3';
// common parsing and formatting functions

/*
 * @function trimZeros
 * removes additional zeros from big number
 */
function trimZeroes(str) {
  return str.replace(/\.0+$/, '');
}

/*
 * @function addCommas
 * wrapper for the d3.format to put in commas
 */
const addCommas = d3.format(',');

function formatPrefix(suffixes) {
  if (!suffixes) return addCommas;
  return function (visits) {
    const prefix = d3.formatPrefix(visits);
    const suffix = suffixes[prefix.symbol];
    return prefix && suffix
      ? prefix.scale(visits)
        .toFixed(suffix[1])
        .replace(/\.0+$/, '') + suffix[0] : addCommas(visits);
  };
}

function formatVisits() {
  return formatPrefix({
    k: ['k', 1], // thousands
    M: ['m', 1], // millions
    G: ['b', 2], // billions
  });
}

function readableBigNumber(total) {
  const formatter = formatPrefix({
    M: [' million', 1], // millions
    G: [' billion', 2], // billions
  });
  return formatter(total);
}

function floatToPercent(p) {
  return p >= 0.1
    ? `${trimZeroes(p.toFixed(1))}%`
    : '< 0.1%';
}

function formatHour(hour) {
  const n = +hour;
  const suffix = n >= 12 ? 'p' : 'a';
  return (n % 12 || 12) + suffix;
}

/**
 * Returns an ISO Date (2023-12-17) in dd/mm format for time series chart
 * @param {ISO Date} - date
 */
function formatDate(isoDateString) {
  const date = new Date(isoDateString);
  const day = date.getDate();
  const month = date.getMonth() + 1;

  // display 01-09 until 10
  // if (day < 10) day = `0${day}`;
  // if (month < 10) month = `0${month}`;

  return `${day}/${month}`;
}

function formatURL(url) {
  let index = 0;
  // find & remove protocol (http, ftp, etc.) and get domain
  if (url.indexOf('://') > -1) {
    index = 2;
  }
  // find & remove port number
  return url
    .split('/')[index]
    .split(':')[0]
    .replace(/%20/g, ' ');
}

function formatFile(url) {
  const splitUrls = url.split('/');
  const domain = splitUrls[splitUrls.length - 1];
  return domain.replace(/%20/g, ' ');
}

export default {
  trimZeroes,
  addCommas,
  formatVisits,
  readableBigNumber,
  formatHour,
  formatDate,
  floatToPercent,
  formatURL,
  formatFile,
};
