/// <reference path="../../../../../public/app/headers/common.d.ts" />
export declare class DashboardExporter {
    private datasourceSrv;
    constructor(datasourceSrv: any);
    makeExportable(dashboard: any): Promise<{}>;
}
