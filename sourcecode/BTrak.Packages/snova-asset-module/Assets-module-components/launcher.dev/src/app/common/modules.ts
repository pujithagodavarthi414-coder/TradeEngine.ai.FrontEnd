import { AssetsModuleInfo } from 'Assets-module-components/assets-components/src/lib/snovasys-asset-management/models/assets-moduleInfo';

export const info: AssetsModuleInfo = {
    modules:[
        {
            path: "wigetcomponents",
            moduleName: "WidgetModule",
            modulePackageName: "WidgetPackageModule",
            moduleLazyLoadingPath: "Assets-module-components/launcher.dev/src/app/packageModules/widget-package.module#WidgetPackageModule",
            description: "widget",
            apps: [
                {
                    displayName: "Custom Widget",
                    componentName: "WidgetsgridsterComponent",
                    inputs: []
                },
                {
                    displayName: "Custom apps view",
                    componentName: "CustomAppsListViewComponent",
                    inputs: []
                },
                {
                    displayName: "hidden workspaces list",
                    componentName: "HiddenWorkspaceslistComponent",
                    inputs: []
                }
            ]
        },
        {
            path: "ProfileManagementComponents",
            moduleName: "ProfileManagementModule",
            modulePackageName: "ProfileManagementModule",
            moduleLazyLoadingPath: "Assets-module-components/launcher.dev/src/app/packageModules/profile.module#ProfileManagementModule",
            description: "Profile",
            apps: [
                {
                    displayName: "My assets",
                    componentName: "MyAssetsComponent",
                    inputs: []
                },
            ]
        }
    ]
}