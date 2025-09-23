export class TrainingAssignmentOutPutModel {
    userId: string;
    userFullName: string;
    userProfileImage: string;
    assignmentsJson: string;
    totalCount: string
    assignments: Assignment[];
}

export class Assignment{
    assignmentId: string;
    trainingCourseId: string;
    courseName: string;
    statusName: string;
    validityEndDate: Date;
    validityInMonths: number;
    statusId: string;
    statusColor: string
}