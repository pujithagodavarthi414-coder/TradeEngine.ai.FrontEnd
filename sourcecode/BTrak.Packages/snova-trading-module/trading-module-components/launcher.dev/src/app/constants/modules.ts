import { billingModuleInfo } from 'trading-module-components/trading-components/src/lib/billing/models/dashboardFilterModel';

export const info: billingModuleInfo = {
    modules: [
        {
            path: "appStoreComponents",
            moduleName: "AppStoreModule",
            modulePackageName: "AppStorePacakgeModule",
            moduleLazyLoadingPath: "trading-module-components/launcher.dev/src/app/packageModules/appStore-package.module",
            description: "App store",
            apps: [
                {
                    displayName: "app store",
                    componentName: "AppStoreComponent",
                    inputs: []
                },
                {
                    displayName: "Widget list",
                    componentName: "WidgetslistComponent",
                    inputs: []
                }
            ]
        },
        {
            path: "tradingWidgetComponents",
            moduleName: "BillingModule",
            modulePackageName: "TradingWidgetPackageModule",
            moduleLazyLoadingPath: "src/app/packageModules/trading-widget.module#TradingWidgetPackageModule",
            description: "trading widget components module description",
            apps: [
                {
                    displayName: "Independent Smallholder Certification",
                    componentName: "SmallHolderApplication",
                    inputs: ["dashboardFilters"]
                },
                {
                    displayName: "Certified SHFs North Sumatra",
                    componentName: "CertifiedSHFsNorthSumateraComponent",
                    inputs: ["dashboardFilters"]
                },
                {
                    displayName: "Certified SHFs Jambi",
                    componentName: "CertifiedSHFsJambiComponent",
                    inputs: ["dashboardFilters"]
                },
                {
                    displayName: "Certified SHFs Riau",
                    componentName: "CertifiedSHFsRiauComponent",
                    inputs: ["dashboardFilters"]
                },
                {
                    displayName: "Ffb Productivity - Phase 1 Jambi",
                    componentName: "FFBProductivityJambiComponent",
                    inputs: ["dashboardFilters"]
                },
                {
                    displayName: "Ffb Productivity - Phase 1 Riau",
                    componentName: "FFBProductivityRiauComponent",
                    inputs: ["dashboardFilters"]
                },
                {
                    displayName: "Ffb Productivity - Phase 1 North Sumatra",
                    componentName: "FFBProductivityNorthSumatraComponent",
                    inputs: ["dashboardFilters"]
                },
                {
                    displayName: "Ffb Productivity Phase 01",
                    componentName: "FFBProductivityImporvementTableComponent",
                    inputs: ["dashboardFilters"]
                },
                {
                    displayName: "Increment in SHFs earnings Phase 1",
                    componentName: "IncrementInSmallholdersEarningsComponent",
                    inputs: ["dashboardFilters"]
                }
            ]
        },
        {
            path: "wigetcomponents",
            moduleName: "WidgetModule",
            modulePackageName: "WidgetPackageModule",
            moduleLazyLoadingPath: "PM-module-components/launcher.dev/src/app/packageModules/widget-package.module",
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