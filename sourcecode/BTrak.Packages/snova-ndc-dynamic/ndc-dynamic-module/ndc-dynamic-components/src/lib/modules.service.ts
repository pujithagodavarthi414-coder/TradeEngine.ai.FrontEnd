import { Injectable, Optional } from '@angular/core';
import { modulesProviderInfo } from './snova-ndcdynamic/models/modulesInfo';

@Injectable({
  providedIn: 'root'
})
export class ModulesProvider {
  private _allModules : modulesProviderInfo;

  constructor(@Optional() config: modulesProviderInfo) {
    if (config) { this._allModules = config; }
  }

  get allModules() {
    return this._allModules;
  }
}