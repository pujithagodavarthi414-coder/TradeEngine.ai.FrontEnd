const info = {
    modules: [
        {
            path: "timeSheetComponents",
            moduleName: "TimesheetModule",
            modulePackageName: "TimesheetPackageModule",
            moduleLazyLoadingPath: "activity-tracker-components/launcher.dev/src/app/packageModules/time-sheet-package.module#TimesheetPackageModule",
            description: "role management module description",
            apps: [
                {
                    displayName: "Time sheet",
                    componentName: "ViewTimeSheetComponent",
                    inputs: ["dashboardFilters"]
                },
            ]
        },
        {
            path: "wigetcomponents",
            moduleName: "WidgetModule",
            modulePackageName: "WidgetPackageModule",
            moduleLazyLoadingPath: "PM-module-components/launcher.dev/src/app/packageModules/widget-package.module#WidgetPackageModule",
            description: "widget",
            apps: [
                {
                    displayName: "Custom apps view",
                    componentName: "CustomAppsListViewComponent",
                    inputs: []
                }
            ]
        }
    ]
}

export default info;