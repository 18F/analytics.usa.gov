import React, { useState } from "react";
import {filterMatchesDomain} from "./filter_matches_domain";

function DomainChecker({ subpropertyFilters, properties }) {
  const [domain, setDomain] = useState("");
  const [matchingProperties, setMatchingProperties] = useState([]);
  const parsedSubpropertyFilters = JSON.parse(subpropertyFilters);
  const parsedProperties = JSON.parse(properties);

  function applySubpropertyFilters(domain) {
    const matchingSubproperties = parsedSubpropertyFilters.subpropertyEventFilters.filter(
      subproperty => filterMatchesDomain(subproperty.filterClauses, domain)
    ).map(subproperty => subproperty.applyToProperty);
    return matchingSubproperties.map(propertyId => parsedProperties.properties.find(prop => prop.name === propertyId).displayName);
  }

  // // Keep matchingProperties referenced for tooling/linting and to allow
  // // future side-effects when matches change.
  // useEffect(() => {
  //   // Intentionally log for debugging; harmless in production builds when stripped.
  //   // eslint-disable-next-line no-console
  //   console.debug("matchingProperties changed:", matchingProperties);
  // }, [matchingProperties]);

  // Simple submit handler: prevent default and populate matchingProperties
  // with a small example list based on the entered domain. This both makes
  // the component interactive and ensures setMatchingProperties is used
  // (avoiding unused variable warnings).
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!domain || domain.trim() === "") {
      setMatchingProperties([]);
      return;
    }

    // Example matching logic: return some placeholder matches.
    // In the real app this would call an API or search local data.
    const normalized = domain.trim();
    const results = applySubpropertyFilters(normalized);
    setMatchingProperties(results);
  };

  return (
    <>
      <form id="domain-checker-form" onSubmit={handleSubmit}>
        <label className="usa-label" htmlFor="input-type-text">Domain</label>
        <div className="margin-top-05 display-flex flex-align-end">
          <input
            className="usa-input margin-top-0"
            id="input-type-text"
            name="input-type-text"
            required
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
          />
          <button
            className="usa-button margin-top-0 margin-left-1"
            type="submit"
          >
            Test
          </button>
        </div>
      </form>

      {/* Matching properties section */}
      <section id="matching-properties" className="margin-top-2">
        <h2 className="usa-heading-sm">Matching properties</h2>
        {matchingProperties.length === 0 ? (
          <p>No matching properties found.</p>
        ) : (
          <ul>
            {matchingProperties.map((prop, idx) => {
              const text =
                typeof prop === "string"
                  ? prop
                  : prop && prop.name
                  ? prop.name
                  : JSON.stringify(prop);
              return <li key={idx}>{text}</li>;
            })}
          </ul>
        )}
      </section>
    </>
  );
}

export default DomainChecker;
