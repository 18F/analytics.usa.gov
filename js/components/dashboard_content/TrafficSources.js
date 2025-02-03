import React from "react";
import PropTypes from "prop-types";

import Card from "../card/Card";
import CardContent from "../card/CardContent";
import CardGroup from "../card/CardGroup";
import TopSessionChannelGroupChart from "./TopSessionChannelGroupChart";
import TopSessionSourceMediumChart from "./TopSessionSourceMediumChart";

/**
 * Contains charts and other data visualizations for the traffic sources
 * section of the site. This component is mainly laying out the structure for
 * the section and passes props necessary for getting data and displaying
 * visualizations to child components.
 *
 * @param {object} props the properties for the component
 * @param {string} props.dataHrefBase the URL of the base location of the data
 * to be downloaded including the agency path. In production this is proxied and
 * redirected to the S3 bucket URL.
 * @returns {import('react').ReactElement} The rendered element
 */
function TrafficSources({ dataHrefBase }) {
  return (
    <CardGroup className="grid-row tablet:grid-gap-2 card:padding-x-1 tablet:padding-x-0">
      <Card className="card:grid-col-12 desktop:grid-col-6 card:padding-bottom-2 desktop:padding-bottom-0">
        <CardContent className="padding-105 margin-0 border-0">
          <TopSessionChannelGroupChart dataHrefBase={dataHrefBase} />
        </CardContent>
      </Card>
      <Card className="card:grid-col-12 desktop:grid-col-6">
        <CardContent className="padding-105 margin-0 border-0">
          <TopSessionSourceMediumChart dataHrefBase={dataHrefBase} />
        </CardContent>
      </Card>
    </CardGroup>
  );
}

TrafficSources.propTypes = {
  dataHrefBase: PropTypes.string.isRequired,
};

export default TrafficSources;
