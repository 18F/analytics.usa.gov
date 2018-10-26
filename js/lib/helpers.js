import d3 from 'd3';
// common parsing and formatting functions

function trimZeroes(str) {
  return str.replace(/\.0+$/, '');
}

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

/*
 * listify an Object into its key/value pairs (entries) and sorting by
 * numeric value descending.
 */
function listify(obj) {
  return d3.entries(obj)
    .sort((a, b) => d3.descending(+a.value, +b.value));
}

function addShares(list, value) {
  if (!value) value = function (d) { return d.value; };
  const total = d3.sum(list.map(value));
  list.forEach((d) => {
    d.share = value(d) / total;
  });

  return list;
}

function collapseOther(list, threshold) {
  const modifiedList = list;
  let otherPresent = false;
  const other = { key: 'Other', value: 0, children: [] };

  let last = modifiedList.length - 1;
  while (last > 0 && modifiedList[last].value < threshold) {
    other.value += modifiedList[last].value;
    other.children.push(modifiedList[last]);
    modifiedList.splice(last, 1);
    last -= 1;
  }
  for (let i = 0; i < modifiedList.length; i += 1) {
    if (modifiedList[i].key === 'Other') {
      otherPresent = true;
      modifiedList[i].value += other.value;
    }
  }
  if (!otherPresent) {
    modifiedList.push(other);
  }
  return modifiedList;
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
  listify,
  addShares,
  collapseOther,
};
