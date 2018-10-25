import d3 from 'd3';
// common parsing and formatting functions

function formatPrefix(suffixes) {
  if (!suffixes) return this.formatCommas;
  return (visits) => {
    const prefix = d3.formatPrefix(visits);

    const suffix = suffixes[prefix.symbol];
    return prefix && suffix
      ? prefix.scale(visits)
        .toFixed(suffix[1])
        .replace(/\.0+$/, '') + suffix[0]
      : this.formatCommas(visits);
  };
}

function trimZeroes(str) {
  return str.replace(/\.0+$/, '');
}

export default {
  formatCommas: d3.format(','),
  formatVisits() {
    return formatPrefix({
      k: ['k', 1], // thousands
      M: ['m', 1], // millions
      G: ['b', 2], // billions
    });
  },

  formatBigNumber() {
    return formatPrefix({
      M: [' million', 1], // millions
      G: [' billion', 2], // billions
    });
  },

  formatPercent(p) {
    return p >= 0.1
      ? `${trimZeroes(p.toFixed(1))}%`
      : '< 0.1%';
  },

  formatHour(hour) {
    const n = +hour;
    const suffix = n >= 12 ? 'p' : 'a';
    return (n % 12 || 12) + suffix;
  },

  formatURL(url) {
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
  },

  formatFile(url) {
    const splitUrls = url.split('/');
    const domain = splitUrls[splitUrls.length - 1];
    return domain.replace(new RegExp('%20', 'g'), ' ');
  },

  /*
   * listify an Object into its key/value pairs (entries) and sorting by
   * numeric value descending.
   */
  listify(obj) {
    return d3.entries(obj)
      .sort((a, b) => d3.descending(+a.value, +b.value));
  },

  addShares(list, value) {
    if (!value) value = function (d) { return d.value; };
    const total = d3.sum(list.map(value));
    list.forEach((d) => {
      d.share = value(d) / total;
    });

    return list;
  },

  collapseOther(list, threshold) {
    let otherPresent = false;
    const other = { key: 'Other', value: 0, children: [] };

    let last = list.length - 1;
    while (last > 0 && list[last].value < threshold) {
      other.value += list[last].value;
      other.children.push(list[last]);
      list.splice(last, 1);
      last -= 1;
    }
    for (let i = 0; i < list.length; i += 1) {
      if (list[i].key === 'Other') {
        otherPresent = true;
        list[i].value += other.value;
      }
    }
    if (!otherPresent) {
      list.push(other);
    }
    return list;
  },
};
