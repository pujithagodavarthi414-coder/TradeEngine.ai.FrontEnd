export class TestSuite {
    testSuiteId: string;
    projectId: string;
    testSuiteName: string;
    description: string;
    isArchived: boolean;
    timeStamp: any;
    createdDateTime: any;
}

export class TestSuiteList {
    testSuiteId: string;
    multipleTestSuiteIds: string[];
    projectId: string;
    testSuiteName: string;
    description: string;
    totalEstimate: any;
    sectionsCount: number;
    casesCount: number;
    runsCount: number;
    totalCount: number;
    timeStamp: any;
    isArchived: boolean;
    testSuiteSelected: boolean;
    createdDateTime: any;
    createdByName: string;
    createdByProfileImage: string;
}

export class TestRailTabs {
    name: string;
    index: string;
}

export class TestSuiteMultipleUpdates {
    id: string;
    changes: TestSuiteList;
}

export class TestSuiteExportModel {
    projectName: string;
    personName: string;
    toMails: string;
    download: string;
    testSuiteName: string;
}