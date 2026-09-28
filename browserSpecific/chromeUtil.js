/**
 * @typedef {Object} ChromeMemStats
 * @property {number} totalJSHeapSize
 * @property {number} jsHeapSizeLimit
 *
 * @typedef {Object} ChromePerf
 * @property {ChromeMemStats} memory
 */

/**
 * @type ChromePerf
 */
const chromePerf = /** @type {any}*/ (window)["performance"];

const BYTES_TO_GB = Math.pow(1024, 3);

export function getMemInGb() {
  return (chromePerf.memory.totalJSHeapSize / BYTES_TO_GB).toFixed(2);
}

export function getMemLimitInGb() {
  return (chromePerf.memory.jsHeapSizeLimit / BYTES_TO_GB).toFixed(2);
}
