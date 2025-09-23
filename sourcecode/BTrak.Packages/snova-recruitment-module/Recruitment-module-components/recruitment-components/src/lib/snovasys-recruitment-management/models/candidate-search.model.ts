import { SearchCriteriaInputModelBase } from "../../snovasys-recruitment-management-apps/models/searchcriteriainputmodelbase";

export class CandidateSearchtModel extends SearchCriteriaInputModelBase {
    public candidateId: string;
    public jobOpeningId: string;
    public firstName: string;
    public lastName: string;
    public email: string;
    public secondaryEmail: string;
    public mobile: string;
    public phone: string;
    public fax: string;
    public website: string;
    public skypeId: string;
    public twitterId: string;
    public addressJson: string;
    public countryId: string;
    public experienceInYears: number;
    public currentDesignation: string;
    public currentSalary: string;
    public expectedSalary: string;
    public sourceId: string;
    public sourcePersonId: string;
    public hiringStatusId: string;
    public assignedToManagerId: string;
    public closedById: string;
    public canJobById: string;
    public interviewerId: string;
    public package: string;
    public offeredDate: string;
    public pageNumber: number;
    public pageSize: number;
    public totalCount: number;
}