///<reference path="../../../headers/common.d.ts" />

import {MetricsPanelCtrl} from 'app/plugins/sdk';
import _ from 'lodash';
import kbn from 'app/core/utils/kbn';
import TimeSeries from 'app/core/time_series';
import {axesEditor} from './axes_editor';
import {heatmapDisplayEditor} from './display_editor';
import rendering from './rendering';
import { convertToHeatMap, elasticHistogramToHeatmap, calculateBucketSize, getMinLog} from './heatmap_data_converter';

let X_BUCKET_NUMBER_DEFAULT = 30;
let Y_BUCKET_NUMBER_DEFAULT = 10;

let panelDefaults = {
  heatmap: {
  },
  cards: {
    cardPadding: null,
    cardRound: null
  },
  color: {
    mode: 'spectrum',
    cardColor: '#b4ff00',
    colorScale: 'sqrt',
    exponent: 0.5,
    colorScheme: 'interpolateOranges',
  },
  dataFormat: 'timeseries',
  xAxis: {
    show: true,
  },
  yAxis: {
    show: true,
    format: 'short',
    decimals: null,
    logBase: 1,
    splitFactor: null,
    min: null,
    max: null,
  },
  xBucketSize: null,
  xBucketNumber: null,
  yBucketSize: null,
  yBucketNumber: null,
  tooltip: {
    show: true,
    showHistogram: false
  },
  highlightCards: true
};

let colorModes = ['opacity', 'spectrum'];
let opacityScales = ['linear', 'sqrt'];

// Schemes from d3-scale-chromatic
// https://github.com/d3/d3-scale-chromatic
let colorSchemes = [
  // Diverging
  {name: 'Spectral',  value: 'interpolateSpectral', invert: 'always'},
  {name: 'RdYlGn',    value: 'interpolateRdYlGn',   invert: 'always'},

  // Sequential (Single Hue)
  {name: 'Blues',     value: 'interpolateBlues',    invert: 'dark'},
  {name: 'Greens',    value: 'interpolateGreens',   invert: 'dark'},
  {name: 'Greys',     value: 'interpolateGreys',    invert: 'dark'},
  {name: 'Oranges',   value: 'interpolateOranges',  invert: 'dark'},
  {name: 'Purples',   value: 'interpolatePurples',  invert: 'dark'},
  {name: 'Reds',      value: 'interpolateReds',     invert: 'dark'},

  // Sequential (Multi-Hue)
  {name: 'BuGn',    value: 'interpolateBuGn',       invert: 'dark'},
  {name: 'BuPu',    value: 'interpolateBuPu',       invert: 'dark'},
  {name: 'GnBu',    value: 'interpolateGnBu',       invert: 'dark'},
  {name: 'OrRd',    value: 'interpolateOrRd',       invert: 'dark'},
  {name: 'PuBuGn',  value: 'interpolatePuBuGn',     invert: 'dark'},
  {name: 'PuBu',    value: 'interpolatePuBu',       invert: 'dark'},
  {name: 'PuRd',    value: 'interpolatePuRd',       invert: 'dark'},
  {name: 'RdPu',    value: 'interpolateRdPu',       invert: 'dark'},
  {name: 'YlGnBu',  value: 'interpolateYlGnBu',     invert: 'dark'},
  {name: 'YlGn',    value: 'interpolateYlGn',       invert: 'dark'},
  {name: 'YlOrBr',  value: 'interpolateYlOrBr',     invert: 'dark'},
  {name: 'YlOrRd',  value: 'interpolateYlOrRd',     invert: 'darm'}
];

export class HeatmapCtrl extends MetricsPanelCtrl {
  static templateUrl = 'module.html';

  opacityScales: any = [];
  colorModes: any =  [];
  colorSchemes: any = [];
  selectionActivated: boolean;
  unitFormats: any;
  data: any;
  series: any;
  timeSrv: any;
  dataWarning: any;

  /** @ngInject */
  constructor($scope, $injector, private $rootScope, timeSrv) {
    super($scope, $injector);
    this.$rootScope = $rootScope;
    this.timeSrv = timeSrv;
    this.selectionActivated = false;

    _.defaultsDeep(this.panel, panelDefaults);
    this.opacityScales = opacityScales;
    this.colorModes = colorModes;
    this.colorSchemes = colorSchemes;

    // Bind grafana panel events
    this.events.on('render', this.onRender.bind(this));
    this.events.on('data-received', this.onDataReceived.bind(this));
    this.events.on('data-error', this.onDataError.bind(this));
    this.events.on('data-snapshot-load', this.onDataReceived.bind(this));
    this.events.on('init-edit-mode', this.onInitEditMode.bind(this));
  }

  onInitEditMode() {
    this.addEditorTab('Axes', axesEditor, 2);
    this.addEditorTab('Display', heatmapDisplayEditor, 3);
    this.unitFormats = kbn.getUnitFormats();
  }

  zoomOut(evt) {
    this.publishAppEvent('zoom-out', 2);
  }

  onRender() {
    if (!this.range) { return; }

    let xBucketSize, yBucketSize, heatmapStats, bucketsData;
    let logBase = this.panel.yAxis.logBase;

    if (this.panel.dataFormat === 'tsbuckets') {
      heatmapStats = this.parseHistogramSeries(this.series);
      bucketsData = elasticHistogramToHeatmap(this.series);

      // Calculate bucket size based on ES heatmap data
      let xBucketBoundSet = _.map(_.keys(bucketsData), key => Number(key));
      let yBucketBoundSet = _.map(this.series, series => Number(series.alias));
      xBucketSize = calculateBucketSize(xBucketBoundSet);
      yBucketSize = calculateBucketSize(yBucketBoundSet, logBase);
      if (logBase !== 1) {
        // Use yBucketSize in meaning of "Split factor" for log scales
        yBucketSize = 1 / yBucketSize;
      }
    } else {
      let xBucketNumber = this.panel.xBucketNumber || X_BUCKET_NUMBER_DEFAULT;
      let xBucketSizeByNumber = Math.floor((this.range.to - this.range.from) / xBucketNumber);

      // Parse X bucket size (number or interval)
      let isIntervalString = kbn.interval_regex.test(this.panel.xBucketSize);
      if (isIntervalString) {
        xBucketSize = kbn.interval_to_ms(this.panel.xBucketSize);
      } else if (isNaN(Number(this.panel.xBucketSize)) || this.panel.xBucketSize === '' || this.panel.xBucketSize === null) {
        xBucketSize = xBucketSizeByNumber;
      } else {
        xBucketSize = Number(this.panel.xBucketSize);
      }

      // Calculate Y bucket size
      heatmapStats = this.parseSeries(this.series);
      let yBucketNumber = this.panel.yBucketNumber || Y_BUCKET_NUMBER_DEFAULT;
      if (logBase !== 1) {
        yBucketSize = this.panel.yAxis.splitFactor;
      } else {
        if (heatmapStats.max === heatmapStats.min) {
          if (heatmapStats.max) {
            yBucketSize = heatmapStats.max / Y_BUCKET_NUMBER_DEFAULT;
          } else {
            yBucketSize = 1;
          }
        } else {
          yBucketSize = (heatmapStats.max - heatmapStats.min) / yBucketNumber;
        }
        yBucketSize = this.panel.yBucketSize || yBucketSize;
      }

      bucketsData = convertToHeatMap(this.series, yBucketSize, xBucketSize, logBase);
    }

    // Set default Y range if no data
    if (!heatmapStats.min && !heatmapStats.max) {
      heatmapStats = {min: -1, max: 1, minLog: 1};
      yBucketSize = 1;
    }

    this.data = {
      buckets: bucketsData,
      heatmapStats: heatmapStats,
      xBucketSize: xBucketSize,
      yBucketSize: yBucketSize
    };
  }

  onDataReceived(dataList) {
    this.series = dataList.map(this.seriesHandler.bind(this));

    this.dataWarning = null;
    const datapointsCount = _.reduce(this.series, (sum, series) => {
      return sum + series.datapoints.length;
    }, 0);

    if (datapointsCount === 0) {
      this.dataWarning = {
        title: 'No data points',
        tip: 'No datapoints returned from data query'
      };
    } else {
      for (let series of this.series) {
        if (series.isOutsideRange) {
          this.dataWarning = {
            title: 'Data points outside time range',
            tip: 'Can be caused by timezone mismatch or missing time filter in query',
          };
          break;
        }
      }
    }

    this.render();
  }

  onDataError() {
    this.series = [];
    this.render();
  }

  seriesHandler(seriesData) {
    let series = new TimeSeries({
      datapoints: seriesData.datapoints,
      alias: seriesData.target
    });

    series.flotpairs = series.getFlotPairs(this.panel.nullPointMode);
    series.minLog = getMinLog(series);

    let datapoints = seriesData.datapoints || [];
    if (datapoints && datapoints.length > 0) {
      let last = datapoints[datapoints.length - 1][1];
      let from = this.range.from;
      if (last - from < -10000) {
        series.isOutsideRange = true;
      }
    }

    return series;
  }

  parseSeries(series) {
    let min = _.min(_.map(series, s => s.stats.min));
    let minLog = _.min(_.map(series, s => s.minLog));
    let max = _.max(_.map(series, s => s.stats.max));

    return {
      max: max,
      min: min,
      minLog: minLog
    };
  }

  parseHistogramSeries(series) {
    let bounds = _.map(series, s => Number(s.alias));
    let min = _.min(bounds);
    let minLog = _.min(bounds);
    let max = _.max(bounds);

    return {
      max: max,
      min: min,
      minLog: minLog
    };
  }

  link(scope, elem, attrs, ctrl) {
    rendering(scope, elem, attrs, ctrl);
  }
}
