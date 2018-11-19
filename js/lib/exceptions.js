// some hardcoded exceptions for consistently high-traffic
// infrastructure. we will not add exceptions for any site
// that happens to have trouble keeping permalinks.
export const exceptions = {
  // for the Now tab
  'applicationmanager.gov/application.aspx': 'https://applicationmanager.gov',
  'forecast.weather.gov/mapclick.php': 'http://www.weather.gov/',
  'egov.uscis.gov/casestatus/mycasestatus.do': 'https://egov.uscis.gov/casestatus/',
  'ebenefits.va.gov/ebenefits-portal/ebenefits.portal': 'https://www.ebenefits.va.gov/ebenefits-portal/ebenefits.portal',
  'ebenefits.va.gov/ebenefits/homepage': 'https://www.ebenefits.va.gov/ebenefits/homepage',

  // USPS is afflicted with a bad case of sensitivity :(
  'm.usps.com/m/trackconfirmaction': 'https://m.usps.com/m/TrackConfirmAction',
  'tools.usps.com/go/trackconfirmaction_input': 'https://tools.usps.com/go/TrackConfirmAction!input',
  'm.usps.com/m/home': 'https://m.usps.com/m/Home',
  'reg.usps.com/entreg/loginaction_input?appurl=https://cns.usps.com/labelinformation.shtml': 'https://reg.usps.com/entreg/LoginAction!input?appurl=https://cns.usps.com/labelinformation.shtml',
  'tools.usps.com/go/ziplookupaction!input.action': 'https://tools.usps.com/go/ZipLookupAction!input.action',
  'cns.usps.com/labelinformation.shtml': 'https://cns.usps.com/labelInformation.shtml',

  // for 7/30 days tabs
  'egov.uscis.gov': 'https://egov.uscis.gov/casestatus/',
  'wrh.noaa.gov': 'http://www.wrh.noaa.gov',
};

export const titleExceptions = {
  'forecast.weather.gov/mapclick.php': 'National Weather Service - Forecasts by Region',
};
