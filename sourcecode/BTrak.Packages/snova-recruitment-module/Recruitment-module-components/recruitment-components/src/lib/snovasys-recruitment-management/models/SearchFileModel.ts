import { SearchCriteriaInputModelBase } from "../../snovasys-recruitment-management-apps/models/searchcriteriainputmodelbase";

export class SearchFileModel extends SearchCriteriaInputModelBase {
    fileId: string;
    folderId: string;
    storeId: string;
    referenceId: string;
    referenceTypeId: string;
    userStoryId: string;
}
