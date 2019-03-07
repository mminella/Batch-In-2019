/// <reference path="../../../../public/app/headers/common.d.ts" />
export declare class AnnotationsEditorCtrl {
    private $scope;
    private datasourceSrv;
    mode: any;
    datasources: any;
    annotations: any;
    currentAnnotation: any;
    currentDatasource: any;
    currentIsNew: any;
    annotationDefaults: any;
    showOptions: any;
    /** @ngInject */
    constructor($scope: any, datasourceSrv: any);
    datasourceChanged(): any;
    edit(annotation: any): void;
    reset(): void;
    update(): void;
    add(): void;
    removeAnnotation(annotation: any): void;
}
