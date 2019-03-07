import { MetricsPanelCtrl } from 'app/plugins/sdk';
import { AnnotationEvent } from './event';
export declare class EventManager {
    private panelCtrl;
    private elem;
    private popoverSrv;
    event: AnnotationEvent;
    constructor(panelCtrl: MetricsPanelCtrl, elem: any, popoverSrv: any);
    editorClosed(): void;
    updateTime(range: any): void;
    addFlotEvents(annotations: any, flotOptions: any): void;
}
