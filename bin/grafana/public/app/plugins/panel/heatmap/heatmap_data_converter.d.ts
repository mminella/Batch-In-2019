/// <reference path="../../../../../public/app/headers/common.d.ts" />
declare function elasticHistogramToHeatmap(seriesList: any): {};
/**
 * Convert buckets into linear array of "cards" - objects, represented heatmap elements.
 * @param  {Object} buckets
 * @return {Array}          Array of "card" objects
 */
declare function convertToCards(buckets: any): any[];
/**
 * Special method for log scales. When series converted into buckets with log scale,
 * for simplification, 0 values are converted into 0, not into -Infinity. On the other hand, we mean
 * that all values less than series minimum, is 0 values, and we create special "minimum" bucket for
 * that values (actually, there're no values less than minimum, so this bucket is empty).
 *  8-16|    | ** |    |  * |  **|
 *   4-8|  * |*  *|*   |** *| *  |
 *   2-4| * *|    | ***|    |*   |
 *   1-2|*   |    |    |    |    | This bucket contains minimum series value
 * 0.5-1|____|____|____|____|____| This bucket should be displayed as 0 on graph
 *     0|____|____|____|____|____| This bucket is for 0 values (should actually be -Infinity)
 * So we should merge two bottom buckets into one (0-value bucket).
 *
 * @param  {Object} buckets  Heatmap buckets
 * @param  {Number} minValue Minimum series value
 * @return {Object}          Transformed buckets
 */
declare function mergeZeroBuckets(buckets: any, minValue: any): any;
/**
   * Convert set of time series into heatmap buckets
   * @return {Object}    Heatmap object:
 * {
 *   xBucketBound_1: {
 *     x: xBucketBound_1,
 *     buckets: {
 *       yBucketBound_1: {
 *         y: yBucketBound_1,
 *         bounds: {bottom, top}
 *         values: [val_1, val_2, ..., val_K],
 *         points: [[val_Y, val_X, series_name], ..., [...]],
 *         seriesStat: {seriesName_1: val_1, seriesName_2: val_2}
 *       },
 *       ...
 *       yBucketBound_M: {}
 *     },
 *     values: [val_1, val_2, ..., val_K],
 *     points: [
 *       [val_Y, val_X, series_name], (point_1)
 *       ...
 *       [...] (point_K)
 *     ]
 *   },
 *   xBucketBound_2: {},
 *   ...
 *   xBucketBound_N: {}
 * }
 */
declare function convertToHeatMap(seriesList: any, yBucketSize: any, xBucketSize: any, logBase?: number): {};
declare function getValueBucketBound(value: any, yBucketSize: any, logBase: any): any;
declare function getMinLog(series: any): any;
/**
 * Calculate size of Y bucket from given buckets bounds.
 * @param bounds Array of Y buckets bounds
 * @param logBase Logarithm base
 */
declare function calculateBucketSize(bounds: number[], logBase?: number): number;
/**
 * Compare two heatmap data objects
 * @param objA
 * @param objB
 */
declare function isHeatmapDataEqual(objA: any, objB: any): boolean;
export { convertToHeatMap, elasticHistogramToHeatmap, convertToCards, mergeZeroBuckets, getMinLog, getValueBucketBound, isHeatmapDataEqual, calculateBucketSize };
