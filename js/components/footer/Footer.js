import { useEffect, React } from "react";
import PropTypes from "prop-types";

/**
 * Creates the site footer.
 *
 * This component is using USWDS grid classes.
 *
 * @param {object} props the properties for the component
 * @param {string} props.siteDomain the domain for the site.
 * @returns {import('react').ReactElement} The rendered element
 */
function Footer({ siteDomain }) {
  useEffect(() => {
    //require("../../lib/touchpoints_feedback_modal");
  });

  return (
    <>
      <footer id="analytics-footer">
        <div className="github-section">
          <div className="github-section__body grid-container-widescreen">
            <div className="grid-row">
              <div className="tablet:grid-col">
                <div className="usa-media-block margin-y-1">
                  <div className="usa-media-block__img circle-7 bg-light-blue display-flex flex-row flex-align-center flex-justify-center text-white">
                    <svg
                      className="usa-icon usa-icon--size-4"
                      aria-hidden="true"
                      role="img"
                      focusable="false"
                    >
                      <use xlinkHref="/assets/uswds/img/sprite.svg#help"></use>
                    </svg>
                  </div>
                  <div className="usa-media-block__body">
                    <h3 className="margin-0 text-normal">
                      Have an idea or issue?
                    </h3>
                    <p className="margin-top-1 margin-bottom-0 text--semibold font-sans-md">
                      <a
                        href="https://github.com/18F/analytics.usa.gov/issues"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Reach out on GitHub
                      </a>
                    </p>
                  </div>
                </div>
              </div>
              <div className="tablet:grid-col">
                <div className="usa-media-block margin-y-1">
                  <div className="usa-media-block__img circle-7 bg-light-blue display-flex flex-row flex-align-center flex-justify-center text-white">
                    <svg
                      className="usa-icon usa-icon--size-4"
                      aria-hidden="true"
                      role="img"
                      focusable="false"
                    >
                      <use xlinkHref="/assets/uswds/img/sprite.svg#github"></use>
                    </svg>
                  </div>
                  <div className="usa-media-block__body">
                    <h3 className="margin-0 text-normal">
                      View code on GitHub
                    </h3>
                    <p className="margin-top-1 margin-bottom-0 text--semibold font-sans-md">
                      <a
                        href="https://github.com/18F/analytics-reporter"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Code for the data
                      </a>
                    </p>
                    <p className="margin-top-1 margin-bottom-0 text--semibold font-sans-md">
                      <a
                        href="https://github.com/18F/analytics.usa.gov"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Code for the application
                      </a>
                    </p>
                  </div>
                </div>
              </div>
              <div className="tablet:grid-col">
                <div className="usa-media-block margin-y-1">
                  <div className="usa-media-block__img circle-7 bg-light-blue display-flex flex-row flex-align-center flex-justify-center text-white">
                    <svg
                      className="usa-icon usa-icon--size-4"
                      aria-hidden="true"
                      role="img"
                      focusable="false"
                    >
                      <use xlinkHref="/assets/uswds/img/sprite.svg#mail"></use>
                    </svg>
                  </div>
                  <div className="usa-media-block__body">
                    <h3 className="margin-0 text-normal">
                      Questions or website feedback
                    </h3>
                    <p className="margin-top-1 margin-bottom-0 text--semibold font-sans-md">
                      <a href="mailto:analytics.usa.gov@gsa.gov">
                        Get in touch
                      </a>
                    </p>
                  </div>
                </div>
              </div>
              <div className="tablet:grid-col">
                <div className="usa-media-block margin-y-1">
                  <div className="usa-media-block__img circle-7 bg-light-blue display-flex flex-row flex-align-center flex-justify-center text-white">
                    <svg
                      className="usa-icon usa-icon--size-4"
                      aria-hidden="true"
                      role="img"
                      focusable="false"
                    >
                      <use xlinkHref="/assets/uswds/img/sprite.svg#support"></use>
                    </svg>
                  </div>
                  <div className="usa-media-block__body">
                    <h3 className="margin-0 text-normal">
                      Add an agency website to DAP
                    </h3>
                    <p className="margin-top-1 margin-bottom-0 text--semibold font-sans-md">
                      <a href="mailto:dap@gsa.gov">Email the DAP help desk</a>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>

      <div className="usa-identifier">
        <section
          className="usa-identifier__section usa-identifier__section--masthead"
          aria-label="Agency identifier,"
        >
          <div className="usa-identifier__container">
            <div className="usa-identifier__logos">
              <a href="/" className="usa-identifier__logo">
                <img
                  className="usa-identifier__logo-img"
                  src={`${siteDomain}/images/gsa-logo.svg`}
                  alt="GSA logo"
                />
              </a>
            </div>
            <section
              className="usa-identifier__identity"
              aria-label="Agency description,"
            >
              <p className="usa-identifier__identity-domain">
                analytics.usa.gov
              </p>
              <p className="usa-identifier__identity-disclaimer">
                Analytics.usa.gov is a product of GSA&apos;s{" "}
                <a href="https://digital.gov/guides/dap/">
                  Digital Analytics Program
                </a>
                .
              </p>
            </section>
          </div>
        </section>
        <nav
          className="usa-identifier__section usa-identifier__section--required-links"
          aria-label="Important links,"
        >
          <div className="usa-identifier__container">
            <ul className="usa-identifier__required-links-list">
              <li className="usa-identifier__required-links-item">
                <a
                  href="https://www.gsa.gov/about-us"
                  className="usa-identifier__required-link usa-link"
                >
                  About GSA
                </a>
              </li>
              <li className="usa-identifier__required-links-item">
                <a
                  href="https://www.gsa.gov/website-information/accessibility-statement"
                  className="usa-identifier__required-link usa-link"
                >
                  Accessibility statement
                </a>
              </li>
              <li className="usa-identifier__required-links-item">
                <a
                  href="https://www.gsa.gov/reference/freedom-of-information-act-foia"
                  className="usa-identifier__required-link usa-link"
                >
                  FOIA requests
                </a>
              </li>
              <li className="usa-identifier__required-links-item">
                <a
                  href="https://www.gsa.gov/reference/civil-rights-programs/the-no-fear-act"
                  className="usa-identifier__required-link usa-link"
                >
                  No FEAR Act data
                </a>
              </li>
              <li className="usa-identifier__required-links-item">
                <a
                  href="https://www.gsaig.gov/"
                  className="usa-identifier__required-link usa-link"
                >
                  Office of the Inspector General
                </a>
              </li>
              <li className="usa-identifier__required-links-item">
                <a
                  href="https://www.gsa.gov/reference/reports/budget-performance"
                  className="usa-identifier__required-link usa-link"
                >
                  Performance reports
                </a>
              </li>
              <li className="usa-identifier__required-links-item">
                <a
                  href="https://www.gsa.gov/website-information/website-policies"
                  className="usa-identifier__required-link usa-link"
                >
                  Privacy policy
                </a>
              </li>
            </ul>
          </div>
        </nav>
        <section
          className="usa-identifier__section usa-identifier__section--usagov"
          aria-label="U.S. government information and services,"
        >
          <div className="usa-identifier__container">
            <div className="usa-identifier__usagov-description">
              Looking for U.S. government information and services?
            </div>{" "}
            <a href="https://www.usa.gov/" className="usa-link">
              Visit USA.gov
            </a>
          </div>
        </section>
      </div>
    </>
  );
}

Footer.propTypes = {
  siteDomain: PropTypes.string.isRequired,
};

export default Footer;
