export class ProjectDetails {
     ProjectId: string;
     CompanyGuid: string;
     ProjectName: string;
     UserId: string;
     FirstName: string;
     SurName: string;
     UserName: string;
     ProfileIamge: string;
     GoalsCount: number;
     ProjectStatus: string;
     IsArchived: boolean;
     ArchiveDateTime: string;
  }
  export function createStubProjectDetails() {
   const projectDetails = new ProjectDetails();
   projectDetails.ProjectId = 'Sample Project ID';
   projectDetails.ProjectName = 'Sample Project';
   projectDetails.UserName = 'sample UserName';
   return projectDetails;
}
