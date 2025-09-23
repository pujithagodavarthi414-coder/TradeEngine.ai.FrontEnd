import { Injectable, Optional } from '@angular/core';
import { adminModulesInfo } from '../models/hr-models/company-model';

@Injectable({
  providedIn: 'root'
})
export class AdminModulesService {
  private _allModules : adminModulesInfo;

  constructor(@Optional() config: adminModulesInfo) {
    if (config) { this._allModules = config; }
  }

  get allModules() {
    return this._allModules;
  }
}