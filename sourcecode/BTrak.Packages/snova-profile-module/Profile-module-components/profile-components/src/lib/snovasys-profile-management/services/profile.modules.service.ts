import { Injectable, Optional } from '@angular/core';
import { profileModulesInfo } from '../models/profileModulesInfo';

@Injectable({
  providedIn: 'root'
})
export class ProfileModulesService {
  private _allModules : profileModulesInfo;

  constructor(@Optional() config: profileModulesInfo) {
    if (config) { this._allModules = config; }
  }

  get allModules() {
    return this._allModules;
  }
}