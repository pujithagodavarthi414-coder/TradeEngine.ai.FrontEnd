export class ProjectSearchCriteriaInputModel {
  pageSize: number;
  pageNumber: number;
  projectName: string;
  projectId: string;
  projectResponsiblePersonId: string;
  isArchived: boolean;
  searchText:string;
  projectIds:string;
  sortBy: string;
  sortDirectionAsc: boolean;
  projectSearchFilter: string;
}

