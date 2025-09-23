export class MongoQueriesInputModel {
    MongoQuery: string;
    DataSourceParamValues: DataSourceDummyParamValues[];
    DataSorceParamsType:DataSorceParams[];
    MongoCollectionName: string;
}

export class DataSourceDummyParamValues {
     Name :string;
     Value :string ;
}
export class DataSorceParams {
    Name :string;
    Type :string ;
}