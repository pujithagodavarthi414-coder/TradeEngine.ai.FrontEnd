import { TimesheetModulesInfo } from "timesheet-module-components/timesheet-components/src/lib/snova-timesheet/models/timesheetModulesInfo";


export const shellInfo: TimesheetModulesInfo = {
    modules:[
        {
            path: "statusReportComponents",
            moduleName: "StatusReportsModule",
            modulePackageName: "StatusReportPackageModule",
            moduleLazyLoadingPath: "timesheet-module-components/launcher.dev/src/app/packageModules/status-reports.module#StatusReportPackageModule",
            description: "Status reporting",
            apps: [
                {
                    displayName: "Status reporting",
                    componentName: "StatusReportingComponent",
                    inputs: ["dashboardFilters"]
                }
            ]
        },
        {
            path: "projectComponents",
            moduleName: "ProjectsModule",
            modulePackageName: "ProjectPackageModule",
            moduleLazyLoadingPath: "timesheet-module-components/launcher.dev/src/app/packageModules/project-management-package.module#ProjectPackageModule",
            description: "project module",
            apps: [
                {
                    displayName: "All work items",
                    componentName: "AllWorkItemsComponent",
                    inputs: []
                }
            ]
        },
    ]
}