import { FilterKeyValueModel } from "./filter-key-valu.model";

export class DynamicDashboardFilterModel {
    dashboardId: string;
    dashboardAppId: string;
    referenceId: string;
    filters: FilterKeyValueModel[];
    isMongoQuery : boolean;
    collectionName : string;
}
