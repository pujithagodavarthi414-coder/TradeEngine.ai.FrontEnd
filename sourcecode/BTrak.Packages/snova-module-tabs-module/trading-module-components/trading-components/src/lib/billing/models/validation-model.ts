import { Guid } from "guid-typescript";

export class ValidationModel {
    dataSourceId: Guid;
    dataSetId: Guid;
    formData:any;
    isArchived:boolean;
}