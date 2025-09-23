import { Injectable, Optional } from '@angular/core';
import { TimesheetModulesInfo } from '../models/timesheetModulesInfo';

@Injectable({
  providedIn: 'root'
})
export class TimesheetModuleService {
  private _allModules : TimesheetModulesInfo;

  constructor(@Optional() config: TimesheetModulesInfo) {
    if (config) { this._allModules = config; }
  }
 
  get allModules() {
    return this._allModules;
  }
}