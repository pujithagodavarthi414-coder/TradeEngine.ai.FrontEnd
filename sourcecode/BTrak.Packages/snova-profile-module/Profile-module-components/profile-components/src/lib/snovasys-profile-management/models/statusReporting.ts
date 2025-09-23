import { SearchCriteriaInputModelBase } from './search-criteria-input-base.model';

export class StatusReporting extends SearchCriteriaInputModelBase{
    id: string;
    StatusReportingConfigurationOptionId: string;
    FormId: string;
    FormName: string;
    Description: string;
    FormDataJson: string;
    FormJson: string;
    UploadedFileName: string;
    UploadedFileUrl: string;
    Filepath: string;
    FileName: string;
    CreatedDateTime: Date;
    CreatedByUserId: string;
    UpdatedDateTime: Date;
    UpdatedByUserId: string;
    SubmittedDateTime: Date;
    IsArchived: boolean;
    createdOn: string;
    assignedTo: string;
    isUnread: boolean;
    formName: string;
}

export class StatusReportSeenStatus {
    StatusReportId: string;
    SeenStatus: boolean;
}