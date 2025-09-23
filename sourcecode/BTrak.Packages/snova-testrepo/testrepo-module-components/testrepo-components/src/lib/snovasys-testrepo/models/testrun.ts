import { TestCaseRunDetails } from "./testcaserundetails";

export class TestRun {
    testRunId: string;
    projectId: string;
    testSuiteId: string;
    testRunName: string;
    milestoneId: string;
    assignToId: string;
    description: string;
    isIncludeAllCases: any;
    isSectionsRequired: boolean;
    selectedCases: TestCaseRunDetails[];
    selectedSections: string[];
    isArchived: boolean;
    isCompleted: boolean;
    timeStamp: any;
    testRunIds: string;
}

export class TestRunList {
    id: string;
    testRunId: string;
    projectId: string;
    description: string;
    name: string;
    testRunName: string;
    createdDateTime: Date;
    createdBy: string;
    assignToName: string;
    createdByProfileImage: string;
    createdOn: string;
    isArchived: boolean;
    isCompleted: boolean;
    isTestRun: boolean;
    isIncludeAllCases: any;
    passedCount: number;
    blockedCount: number;
    untestedCount: number;
    retestCount: number;
    failedCount: number;
    totalCount: number;
    casesCount: number;
    passedPercent: number;
    blockedPercent: number;
    failedPercent: number;
    untestedPercent: number;
    retestPercent: number;
    testSuiteId: string;
    testSuiteName: string;
    timeStamp: any;
}