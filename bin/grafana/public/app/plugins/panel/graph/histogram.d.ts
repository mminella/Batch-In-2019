/**
 * Convert series into array of series values.
 * @param data Array of series
 */
export declare function getSeriesValues(data: any): number[];
/**
 * Convert array of values into timeseries-like histogram:
 * [[val_1, count_1], [val_2, count_2], ..., [val_n, count_n]]
 * @param values
 * @param bucketSize
 */
export declare function convertValuesToHistogram(values: number[], bucketSize: number): any[];
