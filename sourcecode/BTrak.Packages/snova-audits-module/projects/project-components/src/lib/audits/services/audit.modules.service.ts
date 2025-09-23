import { Injectable, Optional } from '@angular/core';
import { auditModulesInfo } from '../models/auditModulesInfo';

@Injectable({
  providedIn: 'root'
})
export class AuditModulesService {
  private _allModules : auditModulesInfo;

  constructor(@Optional() config: auditModulesInfo) {
    if (config) { this._allModules = config; }
  }

  get allModules() {
    return this._allModules;
  }
}