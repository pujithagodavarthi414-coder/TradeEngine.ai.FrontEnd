import { Guid } from "guid-typescript";

export class Productivityfilters {
  
    public dateFrom: Date;
    public dateTo: Date;
    public lineManagerId: Guid;
    public filterType: string
    public userId: Guid;
    public branchId: Guid;

}