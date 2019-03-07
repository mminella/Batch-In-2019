///<reference path="../../headers/common.d.ts" />

import config from 'app/core/config';
import $ from 'jquery';
import _ from 'lodash';
import kbn from 'app/core/utils/kbn';
import {PanelCtrl} from './panel_ctrl';

import * as rangeUtil from 'app/core/utils/rangeutil';
import * as dateMath from 'app/core/utils/datemath';

import {Subject} from 'vendor/npm/rxjs/Subject';

class MetricsPanelCtrl extends PanelCtrl {
  scope: any;
  loading: boolean;
  datasource: any;
  datasourceName: any;
  $q: any;
  $timeout: any;
  datasourceSrv: any;
  timeSrv: any;
  templateSrv: any;
  timing: any;
  range: any;
  rangeRaw: any;
  interval: any;
  intervalMs: any;
  resolution: any;
  timeInfo: any;
  skipDataOnInit: boolean;
  dataStream: any;
  dataSubscription: any;
  dataList: any;

  constructor($scope, $injector) {
    super($scope, $injector);

    // make metrics tab the default
    this.editorTabIndex = 1;
    this.$q = $injector.get('$q');
    this.datasourceSrv = $injector.get('datasourceSrv');
    this.timeSrv = $injector.get('timeSrv');
    this.templateSrv = $injector.get('templateSrv');
    this.scope = $scope;

    if (!this.panel.targets) {
      this.panel.targets = [{}];
    }

    this.events.on('refresh', this.onMetricsPanelRefresh.bind(this));
    this.events.on('init-edit-mode', this.onInitMetricsPanelEditMode.bind(this));
    this.events.on('panel-teardown', this.onPanelTearDown.bind(this));
  }

  private onPanelTearDown() {
    if (this.dataSubscription) {
      this.dataSubscription.unsubscribe();
      this.dataSubscription = null;
    }
  }

  private onInitMetricsPanelEditMode() {
    this.addEditorTab('Metrics', 'public/app/partials/metrics.html');
    this.addEditorTab('Time range', 'public/app/features/panel/partials/panelTime.html');
  }

  private onMetricsPanelRefresh() {
    // ignore fetching data if another panel is in fullscreen
    if (this.otherPanelInFullscreenMode()) { return; }

    // if we have snapshot data use that
    if (this.panel.snapshotData) {
      this.updateTimeRange();
      var data = this.panel.snapshotData;
      // backward compatability
      if (!_.isArray(data)) {
        data = data.data;
      }

      this.events.emit('data-snapshot-load', data);
      return;
    }

    // // ignore if we have data stream
    if (this.dataStream) {
      return;
    }

    // clear loading/error state
    delete this.error;
    this.loading = true;

    // load datasource service
    this.setTimeQueryStart();
    this.datasourceSrv.get(this.panel.datasource)
    .then(this.updateTimeRange.bind(this))
    .then(this.issueQueries.bind(this))
    .then(this.handleQueryResult.bind(this))
    .catch(err => {
      // if cancelled  keep loading set to true
      if (err.cancelled) {
        console.log('Panel request cancelled', err);
        return;
      }

      this.loading = false;
      this.error = err.message || "Request Error";
      this.inspector = {error: err};

      if (err.data) {
        if (err.data.message) {
          this.error = err.data.message;
        }
        if (err.data.error) {
          this.error = err.data.error;
        }
      }

      this.events.emit('data-error', err);
      console.log('Panel data error:', err);
    });
  }


  setTimeQueryStart() {
    this.timing.queryStart = new Date().getTime();
  }

  setTimeQueryEnd() {
    this.timing.queryEnd = new Date().getTime();
  }

  updateTimeRange(datasource?) {
    this.datasource = datasource || this.datasource;
    this.range = this.timeSrv.timeRange();
    this.rangeRaw = this.range.raw;

    this.applyPanelTimeOverrides();

    if (this.panel.maxDataPoints) {
      this.resolution = this.panel.maxDataPoints;
    } else {
      this.resolution = Math.ceil($(window).width() * (this.panel.span / 12));
    }

    this.calculateInterval();

    return this.datasource;
  }

  calculateInterval() {
    var intervalOverride = this.panel.interval;

    // if no panel interval check datasource
    if (intervalOverride) {
      intervalOverride = this.templateSrv.replace(intervalOverride, this.panel.scopedVars);
    } else if (this.datasource && this.datasource.interval) {
      intervalOverride = this.datasource.interval;
    }

    var res = kbn.calculateInterval(this.range, this.resolution, intervalOverride);
    this.interval = res.interval;
    this.intervalMs = res.intervalMs;
  }

  applyPanelTimeOverrides() {
    this.timeInfo = '';

    // check panel time overrrides
    if (this.panel.timeFrom) {
      var timeFromInterpolated = this.templateSrv.replace(this.panel.timeFrom, this.panel.scopedVars);
      var timeFromInfo = rangeUtil.describeTextRange(timeFromInterpolated);
      if (timeFromInfo.invalid) {
        this.timeInfo = 'invalid time override';
        return;
      }

      if (_.isString(this.rangeRaw.from)) {
        var timeFromDate = dateMath.parse(timeFromInfo.from);
        this.timeInfo = timeFromInfo.display;
        this.rangeRaw.from = timeFromInfo.from;
        this.rangeRaw.to = timeFromInfo.to;
        this.range.from = timeFromDate;
        this.range.to = dateMath.parse(timeFromInfo.to);
      }
    }

    if (this.panel.timeShift) {
      var timeShiftInterpolated = this.templateSrv.replace(this.panel.timeShift, this.panel.scopedVars);
      var timeShiftInfo = rangeUtil.describeTextRange(timeShiftInterpolated);
      if (timeShiftInfo.invalid) {
        this.timeInfo = 'invalid timeshift';
        return;
      }

      var timeShift = '-' + timeShiftInterpolated;
      this.timeInfo += ' timeshift ' + timeShift;
      this.range.from = dateMath.parseDateMath(timeShift, this.range.from, false);
      this.range.to = dateMath.parseDateMath(timeShift, this.range.to, true);

      this.rangeRaw = this.range;
    }

    if (this.panel.hideTimeOverride) {
      this.timeInfo = '';
    }
  }

  issueQueries(datasource) {
    this.datasource = datasource;

    if (!this.panel.targets || this.panel.targets.length === 0) {
      return this.$q.when([]);
    }

    // make shallow copy of scoped vars,
    // and add built in variables interval and interval_ms
    var scopedVars = Object.assign({}, this.panel.scopedVars, {
      "__interval":     {text: this.interval,   value: this.interval},
      "__interval_ms":  {text: this.intervalMs, value: this.intervalMs},
    });

    var metricsQuery = {
      panelId: this.panel.id,
      range: this.range,
      rangeRaw: this.rangeRaw,
      interval: this.interval,
      intervalMs: this.intervalMs,
      targets: this.panel.targets,
      format: this.panel.renderer === 'png' ? 'png' : 'json',
      maxDataPoints: this.resolution,
      scopedVars: scopedVars,
      cacheTimeout: this.panel.cacheTimeout
    };

    return datasource.query(metricsQuery);
  }

  handleQueryResult(result) {
    this.setTimeQueryEnd();
    this.loading = false;

    // check for if data source returns subject
    if (result && result.subscribe) {
      this.handleDataStream(result);
      return;
    }

    if (this.dashboard.snapshot) {
      this.panel.snapshotData = result.data;
    }

    if (!result || !result.data) {
      console.log('Data source query result invalid, missing data field:', result);
      result = {data: []};
    }

    return this.events.emit('data-received', result.data);
  }

  handleDataStream(stream) {
    // if we already have a connection
    if (this.dataStream) {
      console.log('two stream observables!');
      return;
    }

    this.dataStream = stream;
    this.dataSubscription = stream.subscribe({
      next: (data) => {
        console.log('dataSubject next!');
        if (data.range) {
          this.range = data.range;
        }
        this.events.emit('data-received', data.data);
      },
      error: (error) => {
        this.events.emit('data-error', error);
        console.log('panel: observer got error');
      },
      complete: () => {
        console.log('panel: observer got complete');
        this.dataStream = null;
      }
    });
  }

  setDatasource(datasource) {
    // switching to mixed
    if (datasource.meta.mixed) {
      _.each(this.panel.targets, target => {
        target.datasource = this.panel.datasource;
        if (!target.datasource) {
          target.datasource = config.defaultDatasource;
        }
      });
    } else if (this.datasource && this.datasource.meta.mixed) {
      _.each(this.panel.targets, target => {
        delete target.datasource;
      });
    }

    this.panel.datasource = datasource.value;
    this.datasourceName = datasource.name;
    this.datasource = null;
    this.refresh();
  }
}

export {MetricsPanelCtrl};
