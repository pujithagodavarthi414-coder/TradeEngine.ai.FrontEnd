import { FilterKeyValueModel } from './filterKeyValueModel';

export class DynamicDashboardFilterModel {
    dashboardId: string;
    dashboardAppId: string;
    referenceId: string;
    filters: FilterKeyValueModel[];
}
