/// <reference path="../../../../../public/app/headers/common.d.ts" />
import './query_parameter_ctrl';
import { QueryCtrl } from 'app/plugins/sdk';
export declare class CloudWatchQueryCtrl extends QueryCtrl {
    static templateUrl: string;
    aliasSyntax: string;
    /** @ngInject **/
    constructor($scope: any, $injector: any);
}
