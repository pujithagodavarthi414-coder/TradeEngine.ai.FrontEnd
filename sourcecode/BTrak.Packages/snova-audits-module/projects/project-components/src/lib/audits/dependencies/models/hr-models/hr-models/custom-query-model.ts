export class CustomQueryModel {
    dynamicQuery: string;
    filterQuery: string;
    defaultColumns: string;
}

export class CustomQueryOutputModel {
    headers: CustomQueryHeadersModel[];
    queryData: any;
}

export class CustomQueryHeadersModel {
    columnName: string;
    type: string;
    maxLength: number;
    isNullable: boolean;
    includeInFilters: boolean;
    isHidden: boolean;
    isAvailableForFiltering: boolean;
    isVisibleByDefault: boolean;
}