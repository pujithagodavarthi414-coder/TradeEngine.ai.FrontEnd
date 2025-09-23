import { Injector } from '@angular/core';
import { FormioCustomComponentInfo, registerCustomFormioComponent } from 'angular-formio';
import { DataGridComponent} from './data-grid.component';
import {Formio} from 'angular-formio';


const COMPONENT_OPTIONS: FormioCustomComponentInfo = {
  type: 'myDataGrid',
  selector: 'my-data-grid',
  title: 'Data Grid Custom Container',
  group: 'custom',
  icon: 'square',
};

export function registerWellComponent(injector: Injector) {
  registerCustomFormioComponent(COMPONENT_OPTIONS, DataGridComponent, injector);
}
