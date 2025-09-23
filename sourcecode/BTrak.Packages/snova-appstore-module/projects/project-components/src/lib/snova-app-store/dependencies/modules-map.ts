import { InjectionToken } from '@angular/core';

export type LAZY_DYNAMIC_MODULES = {
  WidgetPackageModule: string
};

export const lazyDynamicMap: LAZY_DYNAMIC_MODULES = {
  WidgetPackageModule: "src/app/packageModules/widget-package.module#WidgetPackageModule"
};

export const LAZY_DYNAMIC_MODULES_MAP = new InjectionToken('LAZY_DYNAMIC_MODULES_MAP', {
  factory: () => lazyDynamicMap
});
