const info  = {
    modules: [

        {
            path: "ProjectManagementComponents",
            moduleName: "ProjectManagementComponents",
            modulePackageName: "AppBuilderPacakgeModule",
            moduleLazyLoadingPath: "app-builder-module-components/launcher.dev/src/app/packageModules/projectmanagement.module#ProjectManagementModule",
            description: "Project Management",
            apps: [
                {
                    displayName: "Goals",
                    componentName: "GoalsBrowseBoardComponent",
                    inputs: []
                },
                {
                    displayName: "Goal",
                    componentName: "GoalUniqueDetailComponent",
                    inputs: []
                },
                {
                    displayName: "Userstory",
                    componentName: "UserStoryUniqueDetailComponent",
                    inputs: []
                },
                {
                    displayName: "Userstories",
                    componentName: "AllWorkItemsComponent",
                    inputs: []
                },
                {
                    displayName: "Project",
                    componentName: "ProjectListComponent",
                    inputs: []
                }
            ]
        },
        {
            path: "leaveComponents",
            moduleName: "LeaveManagementModule",
            modulePackageName: "LeavesManagementPackageModule",
            moduleLazyLoadingPath: "app-builder-module-components/launcher.dev/src/app/packageModules/leavemanagement.module#LeaveModule",
            description: "leaves module description",
            apps: [
                {
                    displayName: "Leaves",
                    componentName: "MyLeavesListComponent",
                    inputs: []
                }
            ]
        },
        {
            path: "TestManagementComponents",
            moduleName: "TestManagementModule",
            modulePackageName: "TestManagementPackageModule",
            moduleLazyLoadingPath: "app-builder-module-components/launcher.dev/src/app/packageModules/testmanagement.module#TestManagementPackageModule",
            description: "test module description",
            apps: [
                {
                    displayName: "Scenarios",
                    componentName: "TestSuitesViewComponent",
                    inputs: []
                },
                {
                    displayName: "Runs",
                    componentName: "TestRunsViewComponent",
                    inputs: []
                }
                ,
                {
                    displayName: "Versions",
                    componentName: "TestrailMileStoneBaseComponent",
                    inputs: []
                }
            ]
        },
        {
            path: "EmployeeIndexComponents",
            moduleName: "DashboardManagementModule",
            modulePackageName: "DashboardManagementPackageModule",
            moduleLazyLoadingPath: "app-builder-module-components/launcher.dev/src/app/packageModules/dashboardmanagement.module#DashboardManagementModule",
            description: "dashboard module description",
            apps: [
                {
                    displayName: "EmployeeIndex",
                    componentName: "EmployeeIndexComponent",
                    inputs: []
                }
            ]
        },
        {
            path: "customFieldsComponents",
            moduleName: "CustomFieldsComponentModule",
            modulePackageName: "CustomFieldsPackageModule",
            moduleLazyLoadingPath: "app-builder-module-components/launcher.dev/src/app/packageModules/custom-field-package.module#CustomFieldsPackageModule",
            description: "custom fields module description",
            apps: [
                {
                    displayName: "Custom fields",
                    componentName: "CustomFieldAppComponent",
                    inputs: ["dashboardFilters"]
                },
                {
                    displayName: "Custom field comp",
                    componentName: "CustomFieldsComponent",
                    inputs: []
                },
                {
                    displayName: "custom view form",
                    componentName: "ViewCustomFormComponent",
                    inputs: ["dashboardFilters"]
                },
                {
                    displayName: "custom forms",
                    componentName: "CustomFormsComponent",
                    inputs: []
                }
            ]
        },
        {
            path: "appbuilderComponents",
            moduleName: "AppBuilderModule",
            modulePackageName: "AppBuilderPacakgeModule",
            moduleLazyLoadingPath: "projects/launcher.dev/src/app/packageModules/app-builder-package.module#AppBuilderPacakgeModule",
            description: "App builder",
            apps: [
                {
                    displayName: "CustomSubQuery",
                    componentName: "CustomSubqueryTableComponent",
                    inputs: []
                },
                {
                    displayName: "FormCreatorComponent",
                    componentName: "FormCreatorComponent",
                    inputs: []
                },
                {
                    displayName: "Generic status",
                    componentName:  "GenericStatusComponent",
                    inputs: []
                }
            ]
        },
        {
            path: "projectComponents",
            moduleName: "AdminModule",
            modulePackageName: "AdminPackageModule",
            moduleLazyLoadingPath: "app-builder-module-components/launcher.dev/src/app/packageModules/admin-package.module#AdminPackageModule",
            description: "project components module description",
            apps: [
                {
                    displayName: "Form type",
                    componentName: "FormTypeComponent",
                    inputs:  ["dashboardFilters"]
                }
            ]
        },
        {
            path: "wigetcomponents",
            moduleName: "WidgetModule",
            modulePackageName: "WidgetPackageModule",
            moduleLazyLoadingPath: "projects/launcher.dev/src/app/packageModules/widget-package.module#WidgetPackageModule",
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
        }
    ]
}

export default info;