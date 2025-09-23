import { Injectable, Optional } from '@angular/core';
import { dashboardModuleinfo } from '../models/dashboard.model';

@Injectable({
  providedIn: 'root'
})
export class DashboardModulesService {
  private _allModules : dashboardModuleinfo;

  constructor(@Optional() config: dashboardModuleinfo) {
    if (config) { this._allModules = config; }
  }

  get allModules() {
    return this._allModules;
  }
}