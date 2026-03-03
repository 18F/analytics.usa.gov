function stringFilterMatchesDomain(stringFilter, domain) {
  switch (stringFilter.matchType) {
    case "PARTIAL_REGEXP":
      const regex = new RegExp(stringFilter.value);
      return regex.test(domain);
    case "CONTAINS":
      return domain.includes(stringFilter.value);
      case "EXACT":
      return domain === stringFilter.value;
    case "FULL_REGEXP":
      const full_regex = new RegExp(stringFilter.value);
      return full_regex.test(domain);
    default:
      console.log(`Unknown matchType: ${stringFilter.matchType}`);
      return false;
  }
}

function filterConditionMatchesDomain(filterCondition, domain) {
  // Log error if fieldName is not fullPageUrl or customEvent:hostname_dimension
  // Log error if fieldName is fullPageUrl
  if (!["fullPageUrl", "customEvent:hostname_dimension"].includes(filterCondition.fieldName)) {
    console.log(`Unsupported fieldName: ${filterCondition.fieldName}`);
    return false;
  }
  if (filterCondition.stringFilter) {
    return stringFilterMatchesDomain(filterCondition.stringFilter, domain);
  } else if (filterCondition.nullFilter) {
    return domain === null || domain === undefined;
  }
}

function filterExpressionMatchesDomain(filterExpression, domain) {
  if (filterExpression.filterCondition) {
    return filterConditionMatchesDomain(filterExpression.filterCondition, domain);
  } else if (filterExpression.notExpression) {
    // Log error if filterExpression.notExpression is not a filterCondition
    return !filterExpressionMatchesDomain(filterExpression.notExpression, domain);
  } else if (filterExpression.orGroup) {
    return filterExpression.orGroup.filterExpressions
      .filter(expr => !expr.orGroup)
      .some(expr => filterExpressionMatchesDomain(expr, domain));
  }
}

function clauseMatchesDomain(clause, domain) {
  switch (clause.filterClauseType) {
    case "INCLUDE":
      return filterExpressionMatchesDomain(clause.filterExpression, domain);
    case "EXCLUDE":
      return !filterExpressionMatchesDomain(clause.filterExpression, domain);
    default:
      console.log(`Unknown filterClauseType: ${clause.filterClauseType}`);
      return false;
  }
}

function filterMatchesDomain(filterClauses, domain) {
  return filterClauses.every(
    clause => clauseMatchesDomain(clause, domain)
  );
}

export { filterMatchesDomain };