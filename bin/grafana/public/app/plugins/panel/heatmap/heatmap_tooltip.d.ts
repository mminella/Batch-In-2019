/// <reference path="../../../../../public/app/headers/common.d.ts" />
export declare class HeatmapTooltip {
    tooltip: any;
    scope: any;
    dashboard: any;
    panel: any;
    heatmapPanel: any;
    mouseOverBucket: boolean;
    originalFillColor: any;
    constructor(elem: any, scope: any);
    onMouseOver(e: any): void;
    onMouseLeave(): void;
    onMouseMove(e: any): void;
    add(): void;
    destroy(): void;
    show(pos: any, data: any): void;
    getBucketIndexes(pos: any, data: any): {
        xBucketIndex: any;
        yBucketIndex: any;
    };
    getXBucketIndex(offsetX: any, data: any): any;
    getYBucketIndex(offsetY: any, data: any): any;
    getSharedTooltipPos(pos: any): any;
    addHistogram(data: any): void;
    move(pos: any): any;
    valueFormatter(decimals: any): (value: any) => any;
}
