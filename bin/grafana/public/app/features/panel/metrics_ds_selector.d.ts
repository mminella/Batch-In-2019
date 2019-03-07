/// <reference path="../../../../public/app/headers/common.d.ts" />
export declare class MetricsDsSelectorCtrl {
    private uiSegmentSrv;
    dsSegment: any;
    mixedDsSegment: any;
    dsName: string;
    panelCtrl: any;
    datasources: any[];
    current: any;
    /** @ngInject */
    constructor(uiSegmentSrv: any, datasourceSrv: any);
    getOptions(includeBuiltin: any): Promise<any[]>;
    datasourceChanged(): void;
    mixedDatasourceChanged(): void;
    addDataQuery(): void;
}
