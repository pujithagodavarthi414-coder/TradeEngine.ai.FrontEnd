import { Injectable, Optional } from '@angular/core';
import { ExpenseModuleInfo } from '../models/ExpenseModuleInfo';

@Injectable({
  providedIn: 'root'
})
export class ExpenseModulesService {
  private _allModules : ExpenseModuleInfo;

  constructor(@Optional() config: ExpenseModuleInfo) {
    if (config) { this._allModules = config; }
  }

  get allModules() {
    return this._allModules;
  }
}