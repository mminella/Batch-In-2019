/// <reference path="../../../../public/app/headers/common.d.ts" />
import './editor_ctrl';
export declare class AnnotationsSrv {
    private $rootScope;
    private $q;
    private datasourceSrv;
    private backendSrv;
    private timeSrv;
    globalAnnotationsPromise: any;
    alertStatesPromise: any;
    /** @ngInject */
    constructor($rootScope: any, $q: any, datasourceSrv: any, backendSrv: any, timeSrv: any);
    clearCache(): void;
    getAnnotations(options: any): any;
    getPanelAnnotations(options: any): any;
    getAlertStates(options: any): any;
    getGlobalAnnotations(options: any): any;
    saveAnnotationEvent(annotation: any): any;
    translateQueryResult(annotation: any, results: any): any;
}
