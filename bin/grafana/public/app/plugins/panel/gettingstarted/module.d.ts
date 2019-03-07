/// <reference path="../../../../../public/app/headers/common.d.ts" />
import { PanelCtrl } from 'app/plugins/sdk';
declare class GettingStartedPanelCtrl extends PanelCtrl {
    private backendSrv;
    private datasourceSrv;
    private $q;
    static templateUrl: string;
    checksDone: boolean;
    stepIndex: number;
    steps: any;
    /** @ngInject **/
    constructor($scope: any, $injector: any, backendSrv: any, datasourceSrv: any, $q: any);
    $onInit(): any;
    nextStep(): any;
    dismiss(): void;
}
export { GettingStartedPanelCtrl, GettingStartedPanelCtrl as PanelCtrl };
