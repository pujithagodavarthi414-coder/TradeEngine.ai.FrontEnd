import { GridDataResult } from "@progress/kendo-angular-grid";
import { State } from "@progress/kendo-data-query";
import { CustomWorkLogHeaderModel } from './custom-work-log-header.model';

export class WorkLogGridSettings {
    columnsConfig: CustomWorkLogHeaderModel[];
    state: State;
    gridData?: GridDataResult;
    formId?: string;
}
