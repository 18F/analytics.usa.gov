import React from "react";
import PropTypes from "prop-types";

import Accordion from "../accordion/Accordion";
import AccordionHeader from "../accordion/AccordionHeader";
import AccordionContent from "../accordion/AccordionContent";
import Card from "../card/Card";
import CardGroup from "../card/CardGroup";
import CardContent from "../card/CardContent";
import Config from "../../lib/config";
import TopDownloads from "./TopDownloads";
import TopVideoPlays from "./TopVideoPlays";
import TopPages from "./TopPages";

/**
 * Contains charts and other data visualizations for the top pages, top
 * downloads, and top video plays section of the site. This component is mainly
 * laying out the structure for the section, including tabs/panels, and passes
 * props necessary for getting data and displaying visualizations to child
 * components. The top pages chart, top downloads chart, and top video plays
 * displayed correspond to the time interval selected in the tabs.
 *
 *
 * Note that the 30 minutes time interval is how often Google Analytics 4
 * updates realtime reports. The dimensions/metrics needed to report on file
 * downloads are not available in the realtime reporting API, so for the 30
 * minute time interval, show top downloads and top video plays for the past day
 * (the shortest time interval allowed for the non-realtime reporting API.)
 *
 * @param {object} props the properties for the component
 * @param {string} props.dataHrefBase the URL of the base location of the data
 * to be downloaded including the agency path. In production this is proxied and
 * redirected to the S3 bucket URL.
 * @param {string} props.agency the display name for the current agency.
 * @returns {import('react').ReactElement} The rendered element
 */
function SidebarContent({ dataHrefBase, agency }) {
  return (
    <>
      <Accordion className="usa-accordion--bordered" multiselect={true}>
        <AccordionHeader className="section__headline margin-0">
          <button
            type="button"
            className="usa-accordion__button white bg-palette-color-2"
            aria-expanded="true"
            aria-controls="top-pages-content"
          >
            Top Web Pages and App Screens
          </button>
        </AccordionHeader>
        <AccordionContent
          id="top-pages-content"
          className="bg-light-gray padding-2"
        >
          <CardGroup className="grid-row grid-gap-2">
            <Card className="grid-col-12">
              <CardContent className="padding-105 margin-0 border-0 height-auto">
                <TopPages
                  dataHrefBase={dataHrefBase}
                  numberOfListingsToDisplay={30}
                  refreshSeconds={Config.realtimeDataRefreshSeconds}
                />
              </CardContent>
            </Card>
          </CardGroup>
        </AccordionContent>
      </Accordion>
      <Accordion className="usa-accordion--bordered" multiselect={true}>
        <AccordionHeader className="section__headline margin-0">
          <button
            type="button"
            className="usa-accordion__button white bg-palette-color-2"
            aria-expanded="true"
            aria-controls="top-downloads-content"
          >
            Top Downloads
          </button>
        </AccordionHeader>
        <AccordionContent
          id="top-downloads-content"
          className="bg-light-gray padding-2"
        >
          <CardGroup className="grid-row grid-gap-2">
            <Card className="grid-col-12">
              <CardContent className="padding-105 margin-0 border-0 height-auto">
                <TopDownloads
                  agency={agency}
                  dataHrefBase={dataHrefBase}
                  numberOfListingsToDisplay={10}
                />
              </CardContent>
            </Card>
          </CardGroup>
        </AccordionContent>
      </Accordion>
      <Accordion className="usa-accordion--bordered" multiselect={true}>
        <AccordionHeader className="section__headline margin-0">
          <button
            type="button"
            className="usa-accordion__button white bg-palette-color-2"
            aria-expanded="true"
            aria-controls="top-video-plays-content"
          >
            Top Video Plays
          </button>
        </AccordionHeader>
        <AccordionContent
          id="top-video-plays-content"
          className="bg-light-gray padding-2"
        >
          <CardGroup className="grid-row grid-gap-2">
            <Card className="grid-col-12">
              <CardContent className="padding-105 margin-0 border-0 height-auto">
                <TopVideoPlays
                  agency={agency}
                  dataHrefBase={dataHrefBase}
                  numberOfListingsToDisplay={10}
                />
              </CardContent>
            </Card>
          </CardGroup>
        </AccordionContent>
      </Accordion>
    </>
  );
}

SidebarContent.propTypes = {
  dataHrefBase: PropTypes.string.isRequired,
  agency: PropTypes.string.isRequired,
};

export default SidebarContent;
