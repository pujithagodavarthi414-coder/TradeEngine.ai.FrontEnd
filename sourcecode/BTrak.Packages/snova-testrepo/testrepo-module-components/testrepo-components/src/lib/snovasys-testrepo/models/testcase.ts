export class TestCase {
    testCaseId: string;
    testCaseIntId: number;
    testCaseIdentity: string;
    testSuiteId: string;
    testRunId: string;
    goalId: string;
    scenarioId: string;
    userStoryId: string;
    userStoryName: string;
    parentUserStoryId: string;
    testRunName: string;
    title: string;
    sectionId: string;
    oldSectionId: string;
    sectionName: string;
    templateId: string;
    templateName: string;
    typeId: string;
    typeName: string;
    priorityId: string;
    priorityType: string;
    estimate: any;
    references: string;
    referencesList: string[];
    multipleSectionIds: string;
    automationTypeId: string;
    automationType: string;
    precondition: string;
    preConditionFilePath: string;
    steps: string;
    stepsFilePath: string;
    expectedResult: string;
    expectedResultFilePath: string;
    testCaseSteps: TestCaseStepsModel[];
    testCaseHistory: TestCaseHistoryModel[];
    testCaseCommentHistory: TestCaseHistoryModel[];
    testCaseStepsHistory: TestCaseStepsModel[];
    stepStatus: TestCaseStepStatusModel[];
    mission: string;
    goals: string;
    assignToId: string;
    assignToName: string;
    assignToProfileImage: string;
    assignToComment: string;
    statusId: string;
    status: string;
    statusName: string;
    statusColor: string;
    statusHexValue: string;
    statusComment: string;
    timeStamp: any;
    userStoryScenarioTimeStamp: any;
    isArchived: boolean;
    isChecked: boolean;
    isBugAdded: boolean;
    isFilterApplied: boolean;
    createdOn: string;
    createdBy: any;
    updatedOn: string;
    updatedBy: any;
    priorityFilter: any;
    sectionFilter: any;
    templateFilter: any;
    statusFilter: any;
    createdByFilter: any;
    updatedByFilter: any;
    sortBy: string;
    searchText: string;
    testedByUserName: string;
    bugsCount: number;
    bugPriorityIcon: string;
    bugPriorityName: string;
    bugPriorityColor: string;
    bugPriorityDescription: string;
    fieldName: string;
    configurationId: string;
    multipleTestCaseIds: string[];
    isDeleted: boolean;
    changeSection: boolean;
    isHierarchical: boolean;
    isFilter: boolean;
    clearFilter: boolean;
    isSprintUserStories: boolean;
    isForRuns: boolean;
    testCasesCount: number;
}

export class TestCaseStepsModel {
    stepId: string;
    stepText: string;
    stepTextFilePath: string;
    stepExpectedResult: string;
    stepExpectedResultFilePath: string;
    stepActualResult: string;
    stepActualResultFilePath: string;
    stepStatusId: string;
    stepStatusName: string;
    stepStatusColor: string;
    stepOrder: number;
    stepCreated: boolean;
    testedBy: string;
    testedByProfileImage: string;
    createdDateTime: Date;
}

export class TestCaseStepStatusModel {
    id: string;
    expectedResult: string;
    actualResult: string;
    statusId: string;
    statusName: string;
}

export class TestCaseHistoryModel {
    fieldName: string;
    oldValue: string;
    newValue: string;
    description: string;
    step: string;
    stepOrder: number;
    expectedResult: string;
    statusName: string;
    statusColor: string;
    statusComment: string;
    testedByName: string;
    testedByProfileImage: string;
    createdDateTime: Date;
    configurationId: string;
    testCaseId: string;
    testCaseTitle: string;
    testRunName: string;
    userStoryId: string;
}

export class TestCaseTitle {
    testCaseId: string;
    multipleTestCaseIds: string;
    testSuiteId: string;
    sectionId: string;
    userStoryId: string;
    title: string;
    isArchived: boolean;
    timeStamp: any;
    isHierarchical: boolean;
    hierarchicalSectionId: string;
}

export class MultipleTestCases {
    id: string;
    changes: TestCase[];
}