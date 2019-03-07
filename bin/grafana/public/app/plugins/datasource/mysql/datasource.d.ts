/// <reference path="../../../../../public/app/headers/common.d.ts" />
export declare class MysqlDatasource {
    private backendSrv;
    private $q;
    private templateSrv;
    id: any;
    name: any;
    /** @ngInject **/
    constructor(instanceSettings: any, backendSrv: any, $q: any, templateSrv: any);
    interpolateVariable(value: any): any;
    query(options: any): any;
    annotationQuery(options: any): any;
    transformAnnotationResponse(options: any, data: any): any;
    testDatasource(): any;
    processQueryResult(res: any): {
        data: any[];
    };
}
