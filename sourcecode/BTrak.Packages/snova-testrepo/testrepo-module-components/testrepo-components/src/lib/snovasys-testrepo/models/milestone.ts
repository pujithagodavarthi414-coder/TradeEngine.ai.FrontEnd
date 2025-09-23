export class MileStone {
    milestoneId: string;
    projectId: string;
    milestoneTitle: string;
    parentMileStoneId: string;
    description: string;
    searchText: string;
    startDate: Date;
    endDate: Date;
    isCompleted: boolean;
    isArchived: boolean;
    isStarted: boolean;
    createdDateTime: Date;
    createdByProfileImage: string;
    createdByName: string;
}

export class MileStonesList extends MileStone {
    testRunsCount: number;
    endDateString: string;
    subMilestoneCount: number;
    totalCount: number;
}

export class MileStoneWithCount extends MileStone {
    blockedCount: number;
    blockedPercent: number;
    failedCount: number;
    failedPercent: number;
    passedCount: number;
    passedPercent: number;
    retestCount: number;
    retestPercent: number;
    subMilestoneCount: number;
    subMilestones: MileStone[];
    testRuns: number;
    testRunsCount: number;
    testRunsXml: string;
    totalCount: number;
    untestedCount: number;
    untestedPercent: number;
    totalCasesCount: number;
    createdDateTime: Date;
}
