import { SearchCriteriaInputModelBase } from './searchCriteriaInputModelBase';

export class Branch extends SearchCriteriaInputModelBase {
  branchName: string;
  branchId: string;
}

export class PayRollTemplateModel{
  payRollTemplateId: string;
  payRollName: string;
  payRollShortName: string;
  isRepeatInfinitly: boolean;
  islastWorkingDay: boolean;
  isArchived: boolean;
  timeStamp: any;
  frequencyId: string;
  infinitlyRunDate: Date;
  currencyId: string;
}
