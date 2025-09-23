import { app } from './app';

export class module {
    path: string;
    moduleName: string;
    modulePackageName: string;
    moduleLazyLoadingPath: string;
    description: string;
    apps: app[];
}

export class modulesInfo {
    modules: any;
}