export class GoalStatus {
    Status: string;
    IsOwnerEditable: string;
    IsUserstoryEditable: string;
    IsEstimatedEditable: string;
    IsDeadlineEditable: string;
    DependencyEdiatble: string;
    IsStatusEdiatble: string;

}

export function createStubGoalStatus() {
    const goalStatus = new GoalStatus();

    goalStatus.Status = 'Approved	';
    goalStatus.IsOwnerEditable = 'Yes';
    goalStatus.IsUserstoryEditable = 'No';
    goalStatus.IsEstimatedEditable = 'No';
    goalStatus.IsDeadlineEditable = 'Yes';
    goalStatus.DependencyEdiatble = 'Yes';
    goalStatus.IsStatusEdiatble = 'Yes';


    return goalStatus;
}
