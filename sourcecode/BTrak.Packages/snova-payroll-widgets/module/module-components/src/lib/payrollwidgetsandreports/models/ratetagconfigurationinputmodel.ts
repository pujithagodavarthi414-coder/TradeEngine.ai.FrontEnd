import { SearchCriteriaInputModelBase } from './searchCriteriaInputModelBase';
import { EmployeeRateTagModel } from "./employee-ratetag-model";

// tslint:disable-next-line: no-use-before-declare
export class RateTagConfigurationModelList extends EmployeeRateTagModel {
    isSelected: boolean;
}

// tslint:disable-next-line: max-classes-per-file
export class RateTagConfigurationInsertModel extends SearchCriteriaInputModelBase {
    rateTagStartDate: Date;
    rateTagEndDate: Date;
    rateTagCurrencyId: string;
    rateTagEmployeeId: string;
    isClearCustomize: boolean;
    groupPriority: number;
    rateTagDetails: RateTagConfigurationModelList[];
}
