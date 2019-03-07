/// <reference path="../../../../../public/app/headers/common.d.ts" />
export declare class TableRenderer {
    private panel;
    private table;
    private isUtc;
    private sanitize;
    formatters: any[];
    colorState: any;
    constructor(panel: any, table: any, isUtc: any, sanitize: any);
    setTable(table: any): void;
    initColumns(): void;
    getColorForValue(value: any, style: any): any;
    defaultCellFormatter(v: any, style: any): any;
    createColumnFormatter(column: any): (v: any, style: any) => any;
    formatColumnValue(colIndex: any, value: any): any;
    renderCell(columnIndex: any, value: any, addWidthHack?: boolean): string;
    render(page: any): string;
    render_values(): {
        columns: any;
        rows: any[];
    };
}
