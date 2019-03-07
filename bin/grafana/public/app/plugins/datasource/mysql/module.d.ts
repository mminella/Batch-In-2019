/// <reference path="../../../../../public/app/headers/common.d.ts" />
import { MysqlDatasource } from './datasource';
import { MysqlQueryCtrl } from './query_ctrl';
declare class MysqlConfigCtrl {
    static templateUrl: string;
}
declare class MysqlAnnotationsQueryCtrl {
    static templateUrl: string;
    annotation: any;
    /** @ngInject **/
    constructor();
}
export { MysqlDatasource, MysqlDatasource as Datasource, MysqlQueryCtrl as QueryCtrl, MysqlConfigCtrl as ConfigCtrl, MysqlAnnotationsQueryCtrl as AnnotationsQueryCtrl };
