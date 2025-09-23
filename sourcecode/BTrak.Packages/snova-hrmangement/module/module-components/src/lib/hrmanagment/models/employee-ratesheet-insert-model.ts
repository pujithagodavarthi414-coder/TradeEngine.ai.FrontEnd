import { EmployeeRateSheetModel } from "./employee-ratesheet-model";
import { SearchCriteriaInputModelBase } from './searchCriteriaInputModelBase';

// tslint:disable-next-line: no-use-before-declare
export class EmployeeRateSheetModelList extends EmployeeRateSheetModel {
    isSelected: boolean;
}

// tslint:disable-next-line: max-classes-per-file
export class EmployeeRateSheetInsertModel extends SearchCriteriaInputModelBase {
    rateSheetStartDate: Date;
    rateSheetEndDate: Date;
    rateSheetCurrencyId: string;
    rateSheetEmployeeId: string;
    rateSheetDetails: EmployeeRateSheetModelList[];
}
