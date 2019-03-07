/// <reference path="../../../../../public/app/headers/common.d.ts" />
import { QueryCtrl } from 'app/plugins/sdk';
export interface MysqlQuery {
    refId: string;
    format: string;
    alias: string;
    rawSql: string;
}
export interface QueryMeta {
    sql: string;
}
export declare class MysqlQueryCtrl extends QueryCtrl {
    static templateUrl: string;
    showLastQuerySQL: boolean;
    formats: any[];
    target: MysqlQuery;
    lastQueryMeta: QueryMeta;
    lastQueryError: string;
    showHelp: boolean;
    /** @ngInject **/
    constructor($scope: any, $injector: any);
    onDataReceived(dataList: any): void;
    onDataError(err: any): void;
}
