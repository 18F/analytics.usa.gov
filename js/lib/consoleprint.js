/* eslint no-underscore-dangle: "off" */

// friendly console message
export default function (window) {
  // plain text for IE
  if (window._ie) {
    console.log("Hi! Please poke around to your heart's content.");
    console.log('');
    console.log('If you find a bug or something, please report it at https://github.com/GSA/analytics.usa.gov/issues');
    console.log('Like it, but want a different front-end? The data reporting is its own tool: https://github.com/18f/analytics-reporter');
    console.log('This is an open source, public domain project, and your contributions are very welcome.');
  } else { // otherwise, let's get fancy
    const styles = {
      big: 'font-size: 24pt; font-weight: bold;',
      medium: 'font-size: 10pt',
      medium_bold: 'font-size: 10pt; font-weight: bold',
      medium_link: 'font-size: 10pt; font-weight: bold; color: #18f',
    };
    console.log("%cHi! Please poke around to your heart's content.", styles.big);
    console.log(' ');
    console.log('%cIf you find a bug or something, please report it over at %chttps://github.com/GSA/analytics.usa.gov/issues', styles.medium, styles.medium_link);
    console.log('%cLike it, but want a different front-end? The data reporting is its own tool: %chttps://github.com/18f/analytics-reporter', styles.medium, styles.medium_link);
    console.log('%cThis is an open source, public domain project, and your contributions are very welcome.', styles.medium);
  }
}
