import { SearchCriteriaInputModelBase } from './searchCriteriaInputModelBase'

export class ActivityHistoryModel extends SearchCriteriaInputModelBase {
    oldValue: string
    newValue: string
    category: string
    fieldName: string
    profileImage: string
    createdByUserId: string
    createdDateTime: string
    description: string
    userName: string
    totalCount: number;
    selectedCategory: string;
}