export class GoalStatusDropDownData {
  goalStatusName: string;
  goalStatusId: string;
}

export function createStubGoalStatusDropDownData() {
  const data = new GoalStatusDropDownData();
  data.goalStatusName = "Active";
  return data;
}
