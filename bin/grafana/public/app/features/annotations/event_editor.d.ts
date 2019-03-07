/// <reference path="../../../../public/app/headers/common.d.ts" />
import { MetricsPanelCtrl } from 'app/plugins/sdk';
import { AnnotationEvent } from './event';
export declare class EventEditorCtrl {
    private annotationsSrv;
    panelCtrl: MetricsPanelCtrl;
    event: AnnotationEvent;
    timeRange: {
        from: number;
        to: number;
    };
    form: any;
    close: any;
    /** @ngInject **/
    constructor(annotationsSrv: any);
    save(): void;
    timeChanged(): void;
}
export declare function eventEditor(): {
    restrict: string;
    controller: typeof EventEditorCtrl;
    bindToController: boolean;
    controllerAs: string;
    templateUrl: string;
    scope: {
        "panelCtrl": string;
        "event": string;
        "close": string;
    };
};
