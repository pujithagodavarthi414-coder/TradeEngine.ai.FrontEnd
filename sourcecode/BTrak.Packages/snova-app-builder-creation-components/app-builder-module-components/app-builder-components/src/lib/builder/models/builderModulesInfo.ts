export class app {
    displayName: string;
    componentName: string;
    inputs: string[];
}

export class module {
    path: string;
    moduleName: string;
    modulePackageName: string;
    moduleLazyLoadingPath: string;
    description: string;
    apps: app[];
}

export class builderModulesInfo {
    modules: module[];
}