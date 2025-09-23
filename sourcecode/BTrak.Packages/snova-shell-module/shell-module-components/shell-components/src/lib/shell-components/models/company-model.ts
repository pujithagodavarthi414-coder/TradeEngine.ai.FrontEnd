export class CompanysettingsModel{
    companySettingsId: string;
    companysettingsName: string
    isArchived: boolean;
    timeStamp: any;
    key:any;
    description:String;
    value:string;
    isSystemApp: boolean;
    vAT: string;
    PrimaryAddress: string;
    companyName: string;
    companyId: string;
}

export class ModuleDetailsModel{
    moduleId: string;
    moduleIds: any;
    isActive: boolean;
    moduleName: string
    isArchived: boolean;
    timeStamp: any;
}

export class CompanyModel{
    isArchived: boolean;
    timeStamp: any;
    vAT: string;
    primaryAddress: string;
    companyName: string;
    companyId: string;
    key:string;
}