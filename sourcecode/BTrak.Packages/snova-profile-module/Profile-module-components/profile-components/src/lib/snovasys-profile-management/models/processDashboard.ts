export class ProcessDashboard {
  GoalResponsibleUserId: string;
  GoalResponsibleUserName: string;
  GoalsXml: string;
  Goals: ProcessDashboardModel;
}

export class ProcessDashboardModel {
  processDashboardId: string;
  goalId: string;
  mileStone: string;
  delay: string;
  dashboardId: string;
  generatedDateTime: Date;
  goalStatusColor: string;
  goalName: string;
  onboardProcessDate: string;
  delayColor: string;
}
