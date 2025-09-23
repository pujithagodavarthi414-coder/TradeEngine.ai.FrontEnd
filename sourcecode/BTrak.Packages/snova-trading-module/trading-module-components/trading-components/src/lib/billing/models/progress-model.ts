import { Guid } from "guid-typescript";

export class ProgressModel {
    programId: any;
    programName: string;
    phase: string;
    kpi: string;
    dateFrom: any;
    dateTo: any;
    sHFCount: number;
    order: number;
    progressId: Guid;
    isArchived: boolean;
    formData: any;
    dataSetId: any;
    dataSourceId: any;
    isVerified: boolean;
    kpiType: string;
    template: string;
    isNewRecord: boolean;
}

export const SampleProgressModel: ProgressModel[] = [
    // {
    //     programId: Guid.parse('AFB6FB47-FDE5-4D2E-959A-3FF44428BB68'),
    //     programName: 'SMILE PROGRAM',
    //     phase: 'Phase 1',
    //     kpi: 'Smallholder Certification',
    //     dateFrom: new Date('2020-10-20'),
    //     dateTo: new Date('2020-12-20'),
    //     sHFCount: 35,
    //     order: 3,
    //     progressId: Guid.create(),
    //     isArchived: false,
    //     formData: {
    //         from: "2020-10-20T12:00:00+05:30",
    //         locationKpi01: "North Sumatra",
    //         numberOfIndependentShFsCertified: 35,
    //         targetShFs: 2,
    //         to: "2020-12-20T12:00:00+05:30"
    //     }
    // },
    // {
    //     programId: Guid.parse('AFB6FB47-FDE5-4D2E-959A-3FF44428BB68'),
    //     programName: 'SMILE PROGRAM',
    //     phase: 'Phase 1',
    //     kpi: 'Smallholder Certification',
    //     dateFrom: new Date('2021-01-20'),
    //     dateTo: new Date('2021-03-20'),
    //     sHFCount: 28,
    //     order: 2,
    //     progressId: Guid.create(),
    //     isArchived: false,
    //     formData: {
    //         from: "2021-01-20T12:00:00+05:30",
    //         locationKpi01: "North Sumatra",
    //         numberOfIndependentShFsCertified: 28,
    //         targetShFs: 2,
    //         to: "2021-03-20T12:00:00+05:30"
    //     }
    // },
    // {
    //     programId: Guid.parse('AFB6FB47-FDE5-4D2E-959A-3FF44428BB68'),
    //     programName: 'SMILE PROGRAM',
    //     phase: 'Phase 1',
    //     kpi: 'Smallholder Certification',
    //     dateFrom: new Date('2021-04-20'),
    //     dateTo: new Date('2021-06-20'),
    //     sHFCount: 20,
    //     order: 1,
    //     progressId: Guid.create(),
    //     isArchived: false,
    //     formData: {
    //         from: "2021-04-20T12:00:00+05:30",
    //         locationKpi01: "North Sumatra",
    //         numberOfIndependentShFsCertified: 20,
    //         targetShFs: 2,
    //         to: "2021-06-20T12:00:00+05:30"
    //     }
    // },
]