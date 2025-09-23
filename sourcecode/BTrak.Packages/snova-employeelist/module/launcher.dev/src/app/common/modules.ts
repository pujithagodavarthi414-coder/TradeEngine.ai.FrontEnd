import { hrModulesInfo } from 'module/module-components/src/lib/employeeList/models/hrModulesInfo';

export const info: hrModulesInfo = {
    modules:[
        {
            path: "wigetcomponents",
            moduleName: "WidgetModule",
            modulePackageName: "WidgetPackageModule",
            moduleLazyLoadingPath: "module/launcher.dev/src/app/packageModules/widget-package.module#WidgetPackageModule",
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
            path: "documentManagementComponents",
            moduleName: "DocumentManagementModule",
            modulePackageName: "DocumentManagementPackageModule",
            moduleLazyLoadingPath: "module/launcher.dev/src/app/packageModules/documentmanagement-package.module#DocumentManagementPackageModule",
            description: "document management components module description",
            apps: [
                {
                    displayName: "Documents",
                    componentName: "DocumentStoreAppComponent",
                    inputs: ["dashboardFilters"]   
                },
                {
                    displayName: "Store management",
                    componentName: "StoreManagementComponent",
                    inputs: ["dashboardFilters"]   
                },
                {
                    displayName: "Document Store",
                    componentName: "DocumentStoreComponent",
                    inputs: []
                }
            ]
        },
        {
            path: "leaveComponents",
            moduleName: "LeaveManagementModule",
            modulePackageName: "LeavesManagementPackageModule",
            moduleLazyLoadingPath: "module/launcher.dev/src/app/packageModules/leavemanagement-package.module#LeavesManagementPackageModule",
            description: "leaves module description",
            apps: [
                {
                    displayName: "Leaves dashboard",
                    componentName: "LeavesDashBoardListComponent",
                    inputs: ["dashboardFilters"]
                },
                {
                    displayName: "My leaves list",
                    componentName: "MyLeavesListComponent",
                    inputs: []
                },
                {
                    displayName: "Leaves",
                    componentName: "MyLeavesListComponent",
                    inputs: []
                },
                {
                    displayName: "Leave types",
                    componentName: "LeaveTypesListComponent",
                    inputs: []
                },
                {
                    displayName: "Leaves list",
                    componentName: "LeavesListComponent",
                    inputs: []
                }
            ]
        },
        {
            path: "payrollcomponents",
            moduleName: "PayrollManagementModule",
            modulePackageName: "PayrollPackageModule",
            moduleLazyLoadingPath: "module/launcher.dev/src/app/packageModules/payrollmanagement-package.module#PayrollPackageModule",
            description: "payroll management module description",
            apps: [
                {
                    displayName: "Payroll template configuration",
                    componentName: "PayRollTemplateConfigurationComponent",
                    inputs: ["dashboardFilters"]
                },
                {
                    displayName: "Payroll run",
                    componentName: "PayrollRunComponent",
                    inputs: []
                }
            ]
        }
    ]
}