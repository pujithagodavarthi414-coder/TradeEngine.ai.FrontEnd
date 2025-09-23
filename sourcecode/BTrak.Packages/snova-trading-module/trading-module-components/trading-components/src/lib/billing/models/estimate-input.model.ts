import { EstimateFilterModel } from "./estimate-filter.model";

export class EstimateInputModel {
    estimateId: string;
    searchText: string;
    estimateStatusId: string;
    estimateStatusName: string;
    estimateStatusColor: string;
    sortBy: string;
    pageSize: number;
    pageNumber: number;
    sortDirectionAsc: boolean;
    isArchived: boolean;
    estimateFilter: EstimateFilterModel[];
    projectActive: boolean
}