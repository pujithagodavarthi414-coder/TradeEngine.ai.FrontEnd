import { SearchCriteriaInputModelBase } from './searchCriteriaInputModelBase';

export class SearchFolderModel extends SearchCriteriaInputModelBase{
    folderId: string;
    parentFolderId: string;
    storeId: string;
    folderReferenceId: string;
    folderReferenceTypeId: string;
    isArchived: boolean;
    searchText: string;
    isFromSprints: boolean;
    isTreeView: boolean;
}
