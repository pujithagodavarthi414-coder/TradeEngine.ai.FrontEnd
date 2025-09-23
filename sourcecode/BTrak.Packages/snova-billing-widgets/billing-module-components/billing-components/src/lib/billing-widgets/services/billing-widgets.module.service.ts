import { Injectable, Optional } from '@angular/core';
import { BillingWidgetModulesInfo } from '../models/invoice-project-model';


@Injectable({
  providedIn: 'root'
})
export class BiilingwidgetModulesService {
  private _allModules : BillingWidgetModulesInfo;

  constructor(@Optional() config: BillingWidgetModulesInfo) {
    if (config) { this._allModules = config; }
  }

  get allModules() {
    return this._allModules;
  }
}