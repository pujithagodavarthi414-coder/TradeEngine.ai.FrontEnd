import { Injectable, Optional } from '@angular/core';
import { StatusReportsModuleInfo } from '../models/StatusReportsModuleInfo';



@Injectable({
  providedIn: 'root'
})
export class StatusReportsModuleService {
  private _allModules : StatusReportsModuleInfo;

  constructor(@Optional() config: StatusReportsModuleInfo) {
    if (config) { this._allModules = config; }
  }
 
  get allModules() {
    return this._allModules;
  }
}