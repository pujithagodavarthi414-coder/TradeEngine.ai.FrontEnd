import { Injector } from '@angular/core';
import { FormioCustomComponentInfo, registerCustomFormioComponent } from 'angular-formio';
import { WellComponent} from './well.component';
import {Formio} from 'angular-formio';


const COMPONENT_OPTIONS: FormioCustomComponentInfo = {
  type: 'myWell',
  selector: 'my-well',
  title: 'Well Container',
  group: 'custom',
  icon: 'square',
};

export function registerWellComponent(injector: Injector) {
  registerCustomFormioComponent(COMPONENT_OPTIONS, WellComponent, injector);
}
