export class CompanysettingsModel{
    companySettingsId: string;
    companysettingsName: string
    isArchived: boolean;
    timeStamp: any;
    key:any;
    description:String;
    value:string;
    isSystemApp: boolean;
    isVisible: boolean;
}

export class ModuleDetailsModel{
    moduleId: string;
    moduleIds: any;
    isActive: boolean;
    moduleName: string
    isArchived: boolean;
    timeStamp: any;
}

export class CompanyDetailsModel {
    companyId: string;
    companyName: string;
    siteAddress: string;
    workEmail: string;
    password: string;
    industryId: string;
    mainUseCaseId: string;
    phoneNumber: string;
    countryId: string;
    timeZoneId: string;
    currencyId: string;
    numberFormatId: string;
    dateFormatId: string;
    timeFormatId: string;
    teamSize: number;
    versionNumber: string;
    inActiveDateTime: Date;
    originalId: string;
    createdDateTime: Date;
    createdByUserId: string;
}