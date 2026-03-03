import { filterMatchesDomain } from "../filter_matches_domain";

describe("filterMatchesDomain", () => {
  it("handles single INCLUDE clause with single filter condition", () => {
    const filterClauses = [
      {
        "filterClauseType": "INCLUDE",
        "filterExpression": {
          "filterCondition": {
            "fieldName": "fullPageUrl",
            "stringFilter": {
              "matchType": "PARTIAL_REGEXP",
              "value": "(^.+\\.|^)(ameslab|anl|arm|biomassboard|bnl|bpa|brc|cendi|crt2014-2024review|doe|eia|energy|energycodes|fnal|fueleconomy|hanford|hydrogen|iab|inl|lbl|llnl|nersc|nrel|nwtrb|orau|ornl|osti|pnl|pnnl|pppl|salmonrecovery|sandia|science|smartgrid|solardecathlon|srs|swpa|pppo)\\.gov|(^.+\\.|^)(lightmat\\.org|h\\-mat\\.org)"
            }
          }
        }
      }
    ];
    const domain = "ameslab.gov";
    expect(filterMatchesDomain(filterClauses, domain)).toBe(true);
  });
  it("handles single INCLUDE clause with OR'ed filter condition", () => {
    const filterClauses = [
      {
        "filterClauseType": "INCLUDE",
        "filterExpression": {
          "orGroup": {
            "filterExpressions": [
              {
                "filterCondition": {
                  "fieldName": "fullPageUrl",
                  "stringFilter": {
                    "matchType": "PARTIAL_REGEXP",
                    "value": "(^.+\\.|^)(ameslab|anl|arm|biomassboard|bnl|bpa|brc|cendi|crt2014-2024review|doe|eia|energy|energycodes|fnal|fueleconomy|hanford|hydrogen|iab|inl|lbl|llnl|nersc|nrel|nwtrb|orau|ornl|osti|pnl|pnnl|pppl|salmonrecovery|sandia|science|smartgrid|solardecathlon|srs|swpa|pppo)\\.gov|(^.+\\.|^)(lightmat\\.org|h\\-mat\\.org)"
                  }
                }
              }
            ]
          }
        }
      }
    ];
    const domain = "ameslab.gov";
    expect(filterMatchesDomain(filterClauses, domain)).toBe(true);
  });
  it("handles single EXCLUDE clause with OR'ed filter condition that matches", () => {
    const filterClauses = [
      {
        "filterClauseType": "EXCLUDE",
        "filterExpression": {
          "orGroup": {
            "filterExpressions": [
              {
                "filterCondition": {
                  "fieldName": "fullPageUrl",
                  "stringFilter": {
                    "matchType": "CONTAINS",
                    "value": "(not set)"
                  }
                }
              }
            ]
          }
        }
      }];
    const domain = "(not set)";
    expect(filterMatchesDomain(filterClauses, domain)).toBe(false);
  });
  it("handles single EXCLUDE clause with OR'ed filter condition that doesn't match", () => {
    const filterClauses = [
      {
        "filterClauseType": "EXCLUDE",
        "filterExpression": {
          "orGroup": {
            "filterExpressions": [
              {
                "filterCondition": {
                  "fieldName": "fullPageUrl",
                  "stringFilter": {
                    "matchType": "CONTAINS",
                    "value": "(not set)"
                  }
                }
              }
            ]
          }
        }
      }];
    const domain = "ameslab.gov";
    expect(filterMatchesDomain(filterClauses, domain)).toBe(true);
  });
});