import { Injectable, Optional } from '@angular/core';
import { AppStoreModulesInfo } from '../models/appStoreModulesInfo';

@Injectable({
  providedIn: 'root'
})
export class AppStoreModulesService {
  private _allModules : AppStoreModulesInfo;

  constructor(@Optional() config: AppStoreModulesInfo) {
    if (config) { this._allModules = config; }
  }

  get allModules() {
    return this._allModules;
  }
}