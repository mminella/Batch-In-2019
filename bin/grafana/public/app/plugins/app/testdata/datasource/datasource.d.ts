/// <reference path="../../../../../../public/app/headers/common.d.ts" />
declare class TestDataDatasource {
    private backendSrv;
    private $q;
    id: any;
    /** @ngInject */
    constructor(instanceSettings: any, backendSrv: any, $q: any);
    query(options: any): any;
    annotationQuery(options: any): any;
}
export { TestDataDatasource };
