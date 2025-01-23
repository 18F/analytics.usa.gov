import d3 from "d3";
// common parsing and formatting functions

/**
 * @param {string} str stringified number to format
 * @returns {string} the string with additional zeros removed
 */
function trimZeroes(str) {
  return str.replace(/\.0+$/, "");
}

/**
 * wrapper for the d3.format to put in commas
 */
const addCommas = d3.format(",");

function formatPrefix(suffixes) {
  if (!suffixes) return addCommas;
  return function (visits) {
    const prefix = d3.formatPrefix(visits);
    const suffix = suffixes[prefix.symbol];
    return prefix && suffix
      ? prefix.scale(visits).toFixed(suffix[1]).replace(/\.0+$/, "") + suffix[0]
      : addCommas(visits);
  };
}

function formatVisits() {
  return formatPrefix({
    k: ["k", 1], // thousands
    M: ["m", 1], // millions
    G: ["b", 2], // billions
  });
}

function readableBigNumber(total) {
  const formatter = formatPrefix({
    M: [" million", 1], // millions
    G: [" billion", 2], // billions
  });
  return formatter(total);
}

function floatToPercent(p) {
  return p >= 0.1 ? `${trimZeroes(p.toFixed(1))}%` : "< 0.1%";
}

function formatHour(hour) {
  const n = +hour;
  const suffix = n >= 12 ? "p" : "a";
  return (n % 12 || 12) + suffix;
}

/**
 * Returns an ISO Date (2023-12-17) in dd/mm format for time series chart
 * @param {string} isoDateString the date string to format
 * @returns {string} formatted date as "1/12" in dd/mm format
 */
function formatDate(isoDateString) {
  const realDate = isoDateString.split("-");
  const month = removeLeadingZero(realDate[1]);
  const day = removeLeadingZero(realDate[2]);
  return `${month}/${day}`;
}

/**
 * @param {string} dateField that is passed "01"
 * @returns {string} date string with leading zero removed
 */
function removeLeadingZero(dateField) {
  if (dateField.charAt(0) === "0") {
    dateField = dateField.slice(1);
  }
  return dateField;
}

function formatURL(url) {
  let index = 0;
  // find & remove protocol (http, ftp, etc.) and get domain
  if (url.indexOf("://") > -1) {
    index = 2;
  }
  // find & remove port number
  return url.split("/")[index].split(":")[0].replace(/%20/g, "");
}

/**
 * The page property from GA4 does not always contain the protocol, this will
 * cause jekyll to prepend the base url to the link, breaking it
 *
 * @param {string} page a url from a GA page metric
 * @returns {string|undefined} the url with protocol included
 */
function formatProtocol(page) {
  page = formatURL(page);
  if (page.indexOf("http") === 0) {
    return;
  }
  page = `https://${page}`;
  return page;
}

/**
 * If filepath is a full URL we want to return the pathname to be consistent
 * with the API top-downloads-yesterday.json sometimes returns a URL instead of
 * pathname for the file_name field
 *
 * @param {string} filepath the filepath
 * @returns {string} pathname which is consistent with file_name
 */
function formatFile(filepath) {
  try {
    const url = new URL(filepath);
    return url.pathname;
  } catch (e) {
    return filepath;
  }
}

/**
 * @param {number} paramSeconds a number of seconds (potentially a float) to
 * convert to readble time (e.g. 1 hour 43 min 16 sec)
 * @returns {string} the readable time
 */
function secondsToReadableTime(paramSeconds) {
  const secondsInAYear = 31536000;
  const secondsInADay = 86400;
  const secondsInAnHour = 3600;
  const secondsInAMinute = 60;

  const years = Math.floor(paramSeconds / secondsInAYear);
  const days = Math.floor((paramSeconds % secondsInAYear) / secondsInADay);
  const hours = Math.floor(
    ((paramSeconds % secondsInAYear) % secondsInADay) / secondsInAnHour,
  );
  const minutes = Math.floor(
    (((paramSeconds % secondsInAYear) % secondsInADay) % secondsInAnHour) /
      secondsInAMinute,
  );
  const seconds =
    (((paramSeconds % secondsInAYear) % secondsInADay) % secondsInAnHour) %
    secondsInAMinute;

  let formattedTime = "";
  if (years) {
    formattedTime = formattedTime + years + " years ";
  }
  if (days) {
    formattedTime = formattedTime + days + " days ";
  }
  if (hours) {
    formattedTime = formattedTime + hours + " hours ";
  }
  if (minutes) {
    formattedTime = formattedTime + minutes + " min ";
  }
  if (seconds) {
    formattedTime = formattedTime + Math.round(seconds) + " sec ";
  }
  return formattedTime.trim();
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
  formatProtocol,
  formatFile,
  secondsToReadableTime,
};
