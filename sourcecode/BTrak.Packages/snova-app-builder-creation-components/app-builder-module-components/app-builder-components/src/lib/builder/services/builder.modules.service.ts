import { Injectable, Optional } from '@angular/core';
import { builderModulesInfo } from '../models/builderModulesInfo';

@Injectable({
  providedIn: 'root'
})
export class BuilderModulesService {
  private _allModules : builderModulesInfo;

  constructor(@Optional() config: builderModulesInfo) {
    if (config) { this._allModules = config; }
  }

  get allModules() {
    return this._allModules;
  }
}