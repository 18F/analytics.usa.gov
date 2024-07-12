/**
 * Busy waits for the provided number of milliseconds and then resolves promise.
 *
 * @param {number} milliseconds the number of millseconds to delay
 * @returns {Promise} resolves when the amount of milleseconds has passed.
 */
function delay(milliseconds) {
  return new Promise((resolve) => {
    setTimeout(resolve, milliseconds);
  });
}

export { delay };
