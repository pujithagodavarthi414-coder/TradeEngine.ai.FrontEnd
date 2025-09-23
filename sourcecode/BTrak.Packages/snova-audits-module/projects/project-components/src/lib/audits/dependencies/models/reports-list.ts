import { TestCase } from "./testcase";
import { TestSuiteSections } from "./testsuitesection";

export class TestRailReport {
    testRailReportId: string;
    reportId: string;
    reportName: string;
    description: string;
    milestoneId: string;
    projectId: string;
    testRunId: string;
    testRailOptionId: string;
    isArchived: boolean;
    timeStamp: any;
}

export class ReportsList {
    testRailReportId: string;
    testRailReportName: string;
    description: string;
    milestoneId: string;
    projectId: string;
    testRunId: string;
    testRailReportOptionId: string;
    testCases: TestCase[];
    hierarchyTree: TestSuiteSections[];
    hierarchyCasesCount: number;
    casesCount: number;
    createdBy: string;
    projectName: string;
    createdDateTime: Date;
    timeStamp: any;
    createdByProfileImage: string;
    pdfUrl: string;
    blockedCount: number;
    blockedPercent: number;
    failedCount: number;
    failedPercent: number;
    passedCount: number;
    passedPercent: number;
    retestCount: number;
    retestPercent: number;
    untestedCount: number;
    untestedPercent: number;
    reportCasesCount: number;
}

export class TestRailReportsMiniModel {
    testCaseId: string;
    title: string;
    testCaseIdentity: string;
    assignToId: string;
    assignToName: string;
    statusId: string;
    status: string;
    testSuiteName: string;
    totalCount: number;
}

export class ShareReport {
    reportId: string;
    reportName: string;
    emailString: string;
    toUsers: string;
}