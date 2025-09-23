const dynamicComponentsJson = {
    modules: [
        {
            "path": "AppBuilderComponents",
            "moduleName": "AppBuilderModule",
            "modulePackageName": "AppBuilderModulePackageModule",
            "moduleLazyLoadingPath": "projects/launcher.dev/src/app/packageModules/appbuilder.module#AppBuilderCreationComponentsModule",
            "description": "app builder module description",
            "apps": [
                {
                    "displayName": "NewReportApp",
                    "componentName": "AddCustomWidgetComponent",
                    "inputs": []
                },
                {
                    "displayName": "NewHtmlApp",
                    "componentName": "AddCustomHtmlAppComponent",
                    "inputs": []
                },
                {
                    "displayName": "NewProcessApp",
                    "componentName": "NewProcessWidgetComponent",
                    "inputs": []
                },
                {
                    "displayName": "FormCreatorComponent",
                    "componentName": "FormCreatorComponent",
                    "inputs": []
                }
            ]
        },
        {
            "path": "widgetComponents",
            "moduleName": "WidgetModule",
            "modulePackageName": "WidgetPackageModule",
            "moduleLazyLoadingPath": "projects/launcher.dev/src/app/packageModules/widget-package.module#WidgetPackageModule",
            "description": "App builder",
            "apps": [
                {
                    "displayName": "Custom Widget",
                    "componentName": "WidgetsgridsterComponent",
                    "inputs": []
                },
            ]
        },
        {
            "path": "appStoreComponents",
            "moduleName": "AppStoreModule",
            "modulePackageName": "AppStorePacakgeModule",
            "moduleLazyLoadingPath": "projects/launcher.dev/src/app/packageModules/appStore-package.module#AppStorePacakgeModule",
            "description": "App store",
            "apps": [
                {
                    "displayName": "app store",
                    "componentName": "AppStoreComponent",
                    "inputs": []
                },
            ]
        }

    ]
}

export default dynamicComponentsJson;