export class PaymentTermModel {
    name: string;
    id: string;
    portCategoryId: string;
    isArchived: boolean;
    timeStamp: any;
}

export class ShipmentBLModel{
    purchaseShipmentBLId:string;
    purchaseShipmentId:string;
    shipmentBLId:string
    isArchived: boolean;
    searchText: any;
    timeStamp: any;
    BLDescriptionModel: InitialDocumentsDescriptionsXml[];
}
export class InitialDocumentsDescriptionsXml{
    id:string;
    description :string;
    ReferenceTypeId:string;
    orderNumber:number;
}
export class FinalDocumentsDescriptionsXml{
    id:string;
    description :string;
    ReferenceTypeId:string;
    orderNumber:number;
}