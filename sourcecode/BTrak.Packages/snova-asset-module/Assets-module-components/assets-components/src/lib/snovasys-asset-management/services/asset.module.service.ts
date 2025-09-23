import { Injectable, Optional } from '@angular/core';
import { AssetModulesInfo } from '../models/asset-comments';

@Injectable({
  providedIn: 'root'
})
export class AssetModulesService {
  private _allModules : AssetModulesInfo;

  constructor(@Optional() config: AssetModulesInfo) {
    if (config) { this._allModules = config; }
  }

  get allModules() {
    return this._allModules;
  }
}