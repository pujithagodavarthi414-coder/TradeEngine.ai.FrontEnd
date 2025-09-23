export class UserStoryTransition {
  userStoryName: string;
  previousStatus: string;
  newStatus: string;
  userName: string;
  statusChangedDate: string;
}

export function createStubUserStoryTransition() {
  const userStoryTransition = new UserStoryTransition();
  userStoryTransition.userStoryName = "test user story";
  userStoryTransition.previousStatus = "Deployed";
  userStoryTransition.newStatus = "QA Approved";
  userStoryTransition.userName = "Srihari";
  userStoryTransition.statusChangedDate = "5 Days ago";

  return userStoryTransition;
}
