import { shellModulesInfo } from 'shell-module-components/shell-components/src/lib/shell-components/models/shellModulesInfo';


export const shellInfo: shellModulesInfo = {
    modules:[
        {
            path: "timeSheetComponents",
            moduleName: "TimesheetModule",
            modulePackageName: "TimesheetPackageModule",
            moduleLazyLoadingPath: "shell-module-components/launcher.dev/src/app/packageModules/time-sheet-package.module#TimesheetPackageModule",
            description: "time sheet",
            apps: [
                {
                    displayName: "Time punch card",
                    componentName: "FeedtimesheetComponentProfile",
                    inputs: []
                }
            ]
        },
        {
            path: "projectComponents",
            moduleName: "ProjectsModule",
            modulePackageName: "ProjectPackageModule",
            moduleLazyLoadingPath: "shell-module-components/launcher.dev/src/app/packageModules/project-management-package.module#ProjectPackageModule",
            description: "project module",
            apps: [
                {
                    displayName: "All work items",
                    componentName: "AllWorkItemsComponent",
                    inputs: []
                }
            ]
        },
        {
            path: "feedBackComponents",
            moduleName: "FeedbackModule",
            modulePackageName: "FeedbackPackageModule",
            moduleLazyLoadingPath: "shell-module-components/launcher.dev/src/app/packageModules/feedback-package.module#FeedbackPackageModule",
            description: "feedBack module",
            apps: [
                {
                    displayName: "Feedback comp",
                    componentName: "FeedBackComponent",
                    inputs: []
                }
            ]
        }
    ]
}