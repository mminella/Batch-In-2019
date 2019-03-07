/// <reference path="../../../../public/app/headers/common.d.ts" />
/** @ngInject **/
export declare function annotationTooltipDirective($sanitize: any, dashboardSrv: any, $compile: any): {
    restrict: string;
    scope: {
        "event": string;
    };
    link: (scope: any, element: any) => void;
};
