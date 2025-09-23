export class DynamicDashboardFilterModel {
    dashboardId: string;
    dashboardAppId: string;
    referenceId: string;
    filters: FilterKeyValueModel[];
}

export class FilterKeyValueModel {
    filterId: string;
    filterKey: string;
    filterName: string;
    filterValue: string;
    isSystemFilter: boolean;
    dashboardAppId: string;
    dashboardId: string;
}
