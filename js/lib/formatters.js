import d3 from 'd3';
// common parsing and formatting functions

const DISPLAY_THRESHOLD = 1;

/*
 * @function trimZeros
 * removes additional zeros from big number
 */
function trimZeroes(str) {
  return str.replace(/\.0+$/, '');
}


/*
 * @function formatCommas
 * wrapper for the d3.format to put in commas
 */
const formatCommas = d3.format(',');

function formatPrefix(suffixes) {
  if (!suffixes) return formatCommas;
  return function (visits) {
    const prefix = d3.formatPrefix(visits);
    const suffix = suffixes[prefix.symbol];
    return prefix && suffix
      ? prefix.scale(visits)
        .toFixed(suffix[1])
        .replace(/\.0+$/, '') + suffix[0] : formatCommas(visits);
  };
}

function formatVisits() {
  return formatPrefix({
    k: ['k', 1], // thousands
    M: ['m', 1], // millions
    G: ['b', 2], // billions
  });
}

function formatBigNumber(total) {
  const formatter = formatPrefix({
    M: [' million', 1], // millions
    G: [' billion', 2], // billions
  });
  return formatter(total);
}

function formatPercent(p) {
  return p >= 0.1
    ? `${trimZeroes(p.toFixed(1))}%`
    : '< 0.1%';
}

function formatHour(hour) {
  const n = +hour;
  const suffix = n >= 12 ? 'p' : 'a';
  return (n % 12 || 12) + suffix;
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
    .replace(new RegExp('%20', 'g'), ' ');
}

function formatFile(url) {
  const splitUrls = url.split('/');
  const domain = splitUrls[splitUrls.length - 1];
  return domain.replace(new RegExp('%20', 'g'), ' ');
}


export default {
  trimZeroes,
  formatCommas,
  formatVisits,
  formatBigNumber,
  formatHour,
  formatPercent,
  formatURL,
  formatFile,
};
