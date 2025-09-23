import { Injectable, Optional } from '@angular/core';
import { shellModulesInfo } from '../models/shellModulesInfo';

@Injectable({
  providedIn: 'root'
})
export class ShellModulesService {
  private _allModules : shellModulesInfo;

  constructor(@Optional() config: shellModulesInfo) {
    if (config) { this._allModules = config; }
  }

  get allModules() {
    return this._allModules;
  }
}