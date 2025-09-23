export class TaxSlabs{
    Id: string;
    name: string;
    fromRange: number;
    toRange: number;
    taxPercentage: number;
    activeFrom: string;
    activeTo: string;
    minAge: number;
    maxAge: number;
    forMale: boolean;
    forFemale: boolean;
    handicapped: boolean;
    payrollTemplateId: string;
    order: number;
    IsArchived: boolean;
    parentId: string;
    parentName: string;
    branchId: string; 
    branchName: string;  
    TemplateNames: string;  
    TemplateIds: string;
    payRollTemplateIds : any;
    isFlatRate:boolean;
    modifiedToRange: string;
    modifiedFromRange: string;
}