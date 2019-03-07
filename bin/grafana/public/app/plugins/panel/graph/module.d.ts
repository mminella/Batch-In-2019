/// <reference path="../../../../../public/app/headers/common.d.ts" />
import './graph';
import './legend';
import './series_overrides_ctrl';
import './thresholds_form';
import { MetricsPanelCtrl } from 'app/plugins/sdk';
import { DataProcessor } from './data_processor';
declare class GraphCtrl extends MetricsPanelCtrl {
    private annotationsSrv;
    static template: string;
    hiddenSeries: any;
    seriesList: any;
    dataList: any;
    annotations: any;
    alertState: any;
    annotationsPromise: any;
    dataWarning: any;
    colors: any;
    subTabIndex: number;
    processor: DataProcessor;
    panelDefaults: {
        datasource: any;
        renderer: string;
        yaxes: {
            label: any;
            show: boolean;
            logBase: number;
            min: any;
            max: any;
            format: string;
        }[];
        xaxis: {
            show: boolean;
            mode: string;
            name: any;
            values: any[];
            buckets: any;
        };
        lines: boolean;
        fill: number;
        linewidth: number;
        dashes: boolean;
        dashLength: number;
        spaceLength: number;
        points: boolean;
        pointradius: number;
        bars: boolean;
        stack: boolean;
        percentage: boolean;
        legend: {
            show: boolean;
            values: boolean;
            min: boolean;
            max: boolean;
            current: boolean;
            total: boolean;
            avg: boolean;
        };
        nullPointMode: string;
        steppedLine: boolean;
        tooltip: {
            value_type: string;
            shared: boolean;
            sort: number;
        };
        timeFrom: any;
        timeShift: any;
        targets: {}[];
        aliasColors: {};
        seriesOverrides: any[];
        thresholds: any[];
    };
    /** @ngInject */
    constructor($scope: any, $injector: any, annotationsSrv: any);
    onInitEditMode(): void;
    onInitPanelActions(actions: any): void;
    issueQueries(datasource: any): any;
    zoomOut(evt: any): void;
    onDataSnapshotLoad(snapshotData: any): void;
    onDataError(err: any): void;
    onDataReceived(dataList: any): void;
    onRender(): void;
    changeSeriesColor(series: any, color: any): void;
    toggleSeries(serie: any, event: any): void;
    toggleSeriesExclusiveMode(serie: any): void;
    toggleAxis(info: any): void;
    addSeriesOverride(override: any): void;
    removeSeriesOverride(override: any): void;
    toggleLegend(): void;
    legendValuesOptionChanged(): void;
    exportCsv(): void;
    exportCsvColumns(): void;
}
export { GraphCtrl, GraphCtrl as PanelCtrl };
