import { SearchCriteriaInputModelBase } from './searchCriteriaInputModelBase';

export class UserSearchModel extends SearchCriteriaInputModelBase {
    userId: string;
    userName: string;
    roleId: string;
    isUsersPage: boolean;
    employeeNameText: string;
}