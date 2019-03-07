/// <reference path="../../../../../public/app/headers/common.d.ts" />
export declare class HeatmapDisplayEditorCtrl {
    panel: any;
    panelCtrl: any;
    /** @ngInject */
    constructor($scope: any);
}
/** @ngInject */
export declare function heatmapDisplayEditor(): {
    restrict: string;
    scope: boolean;
    templateUrl: string;
    controller: typeof HeatmapDisplayEditorCtrl;
};
