/// <reference path="../../../../../public/app/headers/common.d.ts" />
import { MetricsPanelCtrl } from 'app/plugins/sdk';
export declare class HeatmapCtrl extends MetricsPanelCtrl {
    private $rootScope;
    static templateUrl: string;
    opacityScales: any;
    colorModes: any;
    colorSchemes: any;
    selectionActivated: boolean;
    unitFormats: any;
    data: any;
    series: any;
    timeSrv: any;
    dataWarning: any;
    /** @ngInject */
    constructor($scope: any, $injector: any, $rootScope: any, timeSrv: any);
    onInitEditMode(): void;
    zoomOut(evt: any): void;
    onRender(): void;
    onDataReceived(dataList: any): void;
    onDataError(): void;
    seriesHandler(seriesData: any): any;
    parseSeries(series: any): {
        max: any;
        min: any;
        minLog: any;
    };
    parseHistogramSeries(series: any): {
        max: any;
        min: any;
        minLog: any;
    };
    link(scope: any, elem: any, attrs: any, ctrl: any): void;
}
