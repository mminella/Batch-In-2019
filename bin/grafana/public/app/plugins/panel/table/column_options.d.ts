/// <reference path="../../../../../public/app/headers/common.d.ts" />
export declare class ColumnOptionsCtrl {
    private $q;
    private uiSegmentSrv;
    panel: any;
    panelCtrl: any;
    colorModes: any;
    columnStyles: any;
    columnTypes: any;
    fontSizes: any;
    dateFormats: any;
    addColumnSegment: any;
    unitFormats: any;
    getColumnNames: any;
    activeStyleIndex: number;
    /** @ngInject */
    constructor($scope: any, $q: any, uiSegmentSrv: any);
    render(): void;
    setUnitFormat(column: any, subItem: any): void;
    addColumnStyle(): void;
    removeColumnStyle(style: any): void;
    invertColorOrder(index: any): void;
}
/** @ngInject */
export declare function columnOptionsTab($q: any, uiSegmentSrv: any): {
    restrict: string;
    scope: boolean;
    templateUrl: string;
    controller: typeof ColumnOptionsCtrl;
};
