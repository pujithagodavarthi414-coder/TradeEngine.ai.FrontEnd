export class PayRollBandsModel{
    payRollBandId: string;
    name: string;
    fromRange: number;
    toRange: number;
    percentage: number;
    activeFrom: string;
    activeTo: string;
    isArchived: boolean;
    parentId: string;
    parentName: string;
    modifiedToRange: string;
    modifiedFromRange: string;
    countryId: string;
    countryName: string;  
    payRollComponentId: string;  
    payRollComponentName: string;  
    minAge: number;
    maxAge: number;
    forMale: boolean;
    forFemale: boolean;
    handicapped: boolean;
    isMarried: boolean;
    order: number;
    timeStamp: any;  
}