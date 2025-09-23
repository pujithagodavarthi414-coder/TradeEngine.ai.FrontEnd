import { Injectable, Optional } from '@angular/core';
import { modulesInfo } from '../models/modulesInfo';

@Injectable({
  providedIn: 'root'
})
export class ModulesService {
  private _allModules : modulesInfo;

  constructor(@Optional() config: modulesInfo) {
    if (config) { this._allModules = config; }
  }

  get allModules() {
    return this._allModules;
  }
}