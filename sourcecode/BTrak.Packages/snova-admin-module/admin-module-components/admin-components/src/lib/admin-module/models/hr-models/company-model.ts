export class app {
    displayName: string;
    componentName: string;
    inputs: string[];
}

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
    isFromSupportUser: boolean;
    isEnabled: boolean;
}

export class module {
    path: string;
    moduleName: string;
    modulePackageName: string;
    moduleLazyLoadingPath: string;
    description: string;
    apps: app[];
}

export class adminModulesInfo {
    modules: any;
}