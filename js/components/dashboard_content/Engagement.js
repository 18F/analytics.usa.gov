import React from "react";
import PropTypes from "prop-types";

import EngagementRate from "./EngagementRate";
import AverageEngagementDuration from "./AverageEngagementDuration";
import Card from "../card/Card";
import CardContent from "../card/CardContent";
import CardGroup from "../card/CardGroup";

/**
 * Contains charts and other data visualizations for the user engagement section
 * of the site. This component is mainly laying out the structure for the
 * section and passes props necessary for getting data and displaying
 * visualizations to child components.
 *
 * @param {object} props the properties for the component
 * @param {string} props.dataHrefBase the URL of the base location of the data
 * to be downloaded including the agency path. In production this is proxied and
 * redirected to the S3 bucket URL.
 * @returns {import('react').ReactElement} The rendered element
 */
function Engagement({ dataHrefBase }) {
  return (
    <CardGroup className="grid-row grid-gap-2">
      <Card className="grid-col-12 desktop:grid-col-6 text-center card:padding-bottom-2 desktop:padding-bottom-0">
        <CardContent className="padding-105 margin-0 border-0">
          <AverageEngagementDuration dataHrefBase={dataHrefBase} />
        </CardContent>
      </Card>

      <Card className="grid-col-12 desktop:grid-col-6 text-center">
        <CardContent className="padding-105 margin-0 border-0">
          <EngagementRate dataHrefBase={dataHrefBase} />
        </CardContent>
      </Card>
    </CardGroup>
  );
}

Engagement.propTypes = {
  dataHrefBase: PropTypes.string.isRequired,
};

export default Engagement;
