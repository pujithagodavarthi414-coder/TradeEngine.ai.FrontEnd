import { Injectable, Optional } from '@angular/core';
import { ActivityModulesInfo } from '../models/activity-tracker.model';


@Injectable({
  providedIn: 'root'
})
export class ActivityTrackerModuleService {
  private _allModules : ActivityModulesInfo;

  constructor(@Optional() config: ActivityModulesInfo) {
    if (config) { this._allModules = config; }
  }

  get allModules() {
    return this._allModules;
  }
}