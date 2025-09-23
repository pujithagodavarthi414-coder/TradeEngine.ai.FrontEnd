import { GridDataResult } from "@progress/kendo-angular-grid";
import { State } from "@progress/kendo-data-query";
import { CustomQueryHeadersModel } from "./custom-query-headers.model";

export class GridSettings {
    columnsConfig: CustomQueryHeadersModel[];
    state: State;
    gridData?: GridDataResult;
    formId?: string;
    selectedTimeZoneType: number;
}
