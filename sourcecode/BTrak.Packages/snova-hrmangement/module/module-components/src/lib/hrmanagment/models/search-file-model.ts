import { SearchCriteriaInputModelBase } from './searchCriteriaInputModelBase';

export class SearchFileModel extends SearchCriteriaInputModelBase {
    fileId: string;
    folderId: string;
    storeId: string;
    referenceId: string;
    referenceTypeId: string;
}
