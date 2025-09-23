import { SearchCriteriaInputModelBase } from './searchCriteriaInputModelBase';

export class PayFrequencyModel extends SearchCriteriaInputModelBase {
    payFrequencyId:string;
    payFrequencyName:string;
    isArchived: boolean
    timeStamp: any;
}