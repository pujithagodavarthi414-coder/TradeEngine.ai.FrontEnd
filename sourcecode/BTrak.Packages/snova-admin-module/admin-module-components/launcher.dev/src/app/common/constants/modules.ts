import { AdminModulesInfo } from 'admin-module-components/admin-components/src/lib/admin-module/models/adminModuleInfo';

export const info: AdminModulesInfo = {
    modules:[
        {
            path: "wigetcomponents",
            moduleName: "WidgetModule",
            modulePackageName: "WidgetPackageModule",
            moduleLazyLoadingPath: "admin-module-components/launcher.dev/src/app/packageModules/widget-package.module#WidgetPackageModule",
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
                },
                {
                    displayName: "filtered apps view",
                    componentName: "FilteredListviewComponent",
                    inputs: []
                }
            ]
        },
        {
            path: "roleManagementComponents",
            moduleName: "RoleManagementModule",
            modulePackageName: "RoleManagementPackageModule",
            moduleLazyLoadingPath: "admin-module-components/launcher.dev/src/app/packageModules/role-management-package.module#RoleManagementPackageModule",
            description: "role management module description",
            apps: [
                {
                    displayName: "Project role permissions",
                    componentName: "EntityPermissionsComponent",
                    inputs: ["dashboardFilters"]
                },
                {
                    displayName: "Role permissions",
                    componentName: "RolePermissionsComponent",
                    inputs: ["dashboardFilters"]
                }
            ]
        },
        
    ]
}