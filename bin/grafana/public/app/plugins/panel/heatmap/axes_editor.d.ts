/// <reference path="../../../../../public/app/headers/common.d.ts" />
export declare class AxesEditorCtrl {
    panel: any;
    panelCtrl: any;
    unitFormats: any;
    logScales: any;
    dataFormats: any;
    /** @ngInject */
    constructor($scope: any, uiSegmentSrv: any);
    setUnitFormat(subItem: any): void;
}
/** @ngInject */
export declare function axesEditor(): {
    restrict: string;
    scope: boolean;
    templateUrl: string;
    controller: typeof AxesEditorCtrl;
};
