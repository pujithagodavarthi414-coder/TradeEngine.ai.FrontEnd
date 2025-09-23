export class MilestoneList {
    MilestoneId: string;
    MilestoneName: string;
  }
  export function createStubMilestonesList() {
   const milestonesList = new MilestoneList();
   milestonesList.MilestoneId = '2008';
   milestonesList.MilestoneName = 'Sample Milestone';
   return milestonesList;
}


