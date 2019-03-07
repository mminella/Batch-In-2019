// Libraries
import React, { ComponentClass } from 'react';
import { hot } from 'react-hot-loader';
import { connect } from 'react-redux';
import _ from 'lodash';
import { AutoSizer } from 'react-virtualized';

// Services & Utils
import store from 'app/core/store';

// Components
import { Alert } from './Error';
import ErrorBoundary from './ErrorBoundary';
import GraphContainer from './GraphContainer';
import LogsContainer from './LogsContainer';
import QueryRows from './QueryRows';
import TableContainer from './TableContainer';
import TimePicker, { parseTime } from './TimePicker';

// Actions
import { changeSize, changeTime, initializeExplore, modifyQueries, scanStart, setQueries } from './state/actions';

// Types
import { RawTimeRange, TimeRange, DataQuery, ExploreStartPageProps, ExploreDataSourceApi } from '@grafana/ui';
import { ExploreItemState, ExploreUrlState, RangeScanner, ExploreId } from 'app/types/explore';
import { StoreState } from 'app/types';
import { LAST_USED_DATASOURCE_KEY, ensureQueries, DEFAULT_RANGE, DEFAULT_UI_STATE } from 'app/core/utils/explore';
import { Emitter } from 'app/core/utils/emitter';
import { ExploreToolbar } from './ExploreToolbar';
import { scanStopAction } from './state/actionTypes';

interface ExploreProps {
  StartPage?: ComponentClass<ExploreStartPageProps>;
  changeSize: typeof changeSize;
  changeTime: typeof changeTime;
  datasourceError: string;
  datasourceInstance: ExploreDataSourceApi;
  datasourceLoading: boolean | null;
  datasourceMissing: boolean;
  exploreId: ExploreId;
  initializeExplore: typeof initializeExplore;
  initialized: boolean;
  modifyQueries: typeof modifyQueries;
  range: RawTimeRange;
  scanner?: RangeScanner;
  scanning?: boolean;
  scanRange?: RawTimeRange;
  scanStart: typeof scanStart;
  scanStopAction: typeof scanStopAction;
  setQueries: typeof setQueries;
  split: boolean;
  showingStartPage?: boolean;
  supportsGraph: boolean | null;
  supportsLogs: boolean | null;
  supportsTable: boolean | null;
  urlState: ExploreUrlState;
  queryKeys: string[];
}

/**
 * Explore provides an area for quick query iteration for a given datasource.
 * Once a datasource is selected it populates the query section at the top.
 * When queries are run, their results are being displayed in the main section.
 * The datasource determines what kind of query editor it brings, and what kind
 * of results viewers it supports. The state is managed entirely in Redux.
 *
 * SPLIT VIEW
 *
 * Explore can have two Explore areas side-by-side. This is handled in `Wrapper.tsx`.
 * Since there can be multiple Explores (e.g., left and right) each action needs
 * the `exploreId` as first parameter so that the reducer knows which Explore state
 * is affected.
 *
 * DATASOURCE REQUESTS
 *
 * A click on Run Query creates transactions for all DataQueries for all expanded
 * result viewers. New runs are discarding previous runs. Upon completion a transaction
 * saves the result. The result viewers construct their data from the currently existing
 * transactions.
 *
 * The result viewers determine some of the query options sent to the datasource, e.g.,
 * `format`, to indicate eventual transformations by the datasources' result transformers.
 */
export class Explore extends React.PureComponent<ExploreProps> {
  el: any;
  exploreEvents: Emitter;
  /**
   * Timepicker to control scanning
   */
  timepickerRef: React.RefObject<TimePicker>;

  constructor(props) {
    super(props);
    this.exploreEvents = new Emitter();
    this.timepickerRef = React.createRef();
  }

  async componentDidMount() {
    const { exploreId, initialized, urlState } = this.props;
    // Don't initialize on split, but need to initialize urlparameters when present
    if (!initialized) {
      // Load URL state and parse range
      const { datasource, queries, range = DEFAULT_RANGE, ui = DEFAULT_UI_STATE } = (urlState || {}) as ExploreUrlState;
      const initialDatasource = datasource || store.get(LAST_USED_DATASOURCE_KEY);
      const initialQueries: DataQuery[] = ensureQueries(queries);
      const initialRange = { from: parseTime(range.from), to: parseTime(range.to) };
      const width = this.el ? this.el.offsetWidth : 0;

      this.props.initializeExplore(
        exploreId,
        initialDatasource,
        initialQueries,
        initialRange,
        width,
        this.exploreEvents,
        ui
      );
    }
  }

  componentWillUnmount() {
    this.exploreEvents.removeAllListeners();
  }

  getRef = el => {
    this.el = el;
  };

  onChangeTime = (range: TimeRange, changedByScanner?: boolean) => {
    if (this.props.scanning && !changedByScanner) {
      this.onStopScanning();
    }
    this.props.changeTime(this.props.exploreId, range);
  };

  // Use this in help pages to set page to a single query
  onClickExample = (query: DataQuery) => {
    this.props.setQueries(this.props.exploreId, [query]);
  };

  onClickLabel = (key: string, value: string) => {
    this.onModifyQueries({ type: 'ADD_FILTER', key, value });
  };

  onModifyQueries = (action, index?: number) => {
    const { datasourceInstance } = this.props;
    if (datasourceInstance && datasourceInstance.modifyQuery) {
      const modifier = (queries: DataQuery, modification: any) => datasourceInstance.modifyQuery(queries, modification);
      this.props.modifyQueries(this.props.exploreId, action, index, modifier);
    }
  };

  onResize = (size: { height: number; width: number }) => {
    this.props.changeSize(this.props.exploreId, size);
  };

  onStartScanning = () => {
    // Scanner will trigger a query
    const scanner = this.scanPreviousRange;
    this.props.scanStart(this.props.exploreId, scanner);
  };

  scanPreviousRange = (): RawTimeRange => {
    // Calling move() on the timepicker will trigger this.onChangeTime()
    return this.timepickerRef.current.move(-1, true);
  };

  onStopScanning = () => {
    this.props.scanStopAction({ exploreId: this.props.exploreId });
  };

  render() {
    const {
      StartPage,
      datasourceInstance,
      datasourceError,
      datasourceLoading,
      datasourceMissing,
      exploreId,
      showingStartPage,
      split,
      supportsGraph,
      supportsLogs,
      supportsTable,
      queryKeys,
    } = this.props;
    const exploreClass = split ? 'explore explore-split' : 'explore';

    return (
      <div className={exploreClass} ref={this.getRef}>
        <ExploreToolbar exploreId={exploreId} timepickerRef={this.timepickerRef} onChangeTime={this.onChangeTime} />
        {datasourceLoading ? <div className="explore-container">Loading datasource...</div> : null}
        {datasourceMissing ? (
          <div className="explore-container">Please add a datasource that supports Explore (e.g., Prometheus).</div>
        ) : null}

        {datasourceError && (
          <div className="explore-container">
            <Alert message={`Error connecting to datasource: ${datasourceError}`} />
          </div>
        )}

        {datasourceInstance && !datasourceError && (
          <div className="explore-container">
            <QueryRows exploreEvents={this.exploreEvents} exploreId={exploreId} queryKeys={queryKeys} />
            <AutoSizer onResize={this.onResize} disableHeight>
              {({ width }) => {
                if (width === 0) {
                  return null;
                }

                return (
                  <main className="m-t-2" style={{ width }}>
                    <ErrorBoundary>
                      {showingStartPage && <StartPage onClickExample={this.onClickExample} />}
                      {!showingStartPage && (
                        <>
                          {supportsGraph && !supportsLogs && <GraphContainer width={width} exploreId={exploreId} />}
                          {supportsTable && <TableContainer exploreId={exploreId} onClickCell={this.onClickLabel} />}
                          {supportsLogs && (
                            <LogsContainer
                              width={width}
                              exploreId={exploreId}
                              onChangeTime={this.onChangeTime}
                              onClickLabel={this.onClickLabel}
                              onStartScanning={this.onStartScanning}
                              onStopScanning={this.onStopScanning}
                            />
                          )}
                        </>
                      )}
                    </ErrorBoundary>
                  </main>
                );
              }}
            </AutoSizer>
          </div>
        )}
      </div>
    );
  }
}

function mapStateToProps(state: StoreState, { exploreId }) {
  const explore = state.explore;
  const { split } = explore;
  const item: ExploreItemState = explore[exploreId];
  const {
    StartPage,
    datasourceError,
    datasourceInstance,
    datasourceLoading,
    datasourceMissing,
    initialized,
    range,
    showingStartPage,
    supportsGraph,
    supportsLogs,
    supportsTable,
    queryKeys,
  } = item;
  return {
    StartPage,
    datasourceError,
    datasourceInstance,
    datasourceLoading,
    datasourceMissing,
    initialized,
    range,
    showingStartPage,
    split,
    supportsGraph,
    supportsLogs,
    supportsTable,
    queryKeys,
  };
}

const mapDispatchToProps = {
  changeSize,
  changeTime,
  initializeExplore,
  modifyQueries,
  scanStart,
  scanStopAction,
  setQueries,
};

export default hot(module)(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Explore)
);
