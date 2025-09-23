import { Guid } from "guid-typescript";

export class CollaborationModel {
    dataSourceId: Guid;
    dataSetId: Guid;
    formData:any;
    isArchived:boolean;
}