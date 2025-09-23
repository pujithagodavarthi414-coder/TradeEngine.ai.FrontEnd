import { Guid } from "guid-typescript";

export class KPIModel {
    programId: Guid;
    programName: string;
    kpiId: Guid;
    kpiName: string;
    targetArea: string;
    sDGIndicator: string;
    eSGIndicator: string;
    totalCount : number;
    order : number;
    isArchived : boolean;
    formData : any;
    formName : string;
}