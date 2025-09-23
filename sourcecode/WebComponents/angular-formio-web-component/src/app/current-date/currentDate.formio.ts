import { Injector } from '@angular/core';
import { FormioCustomComponentInfo, registerCustomFormioComponent } from 'angular-formio';
import {Formio} from 'angular-formio';
import { DateTimeComponent } from './currentDate-components/currentDate.component';


const COMPONENT_OPTIONS: FormioCustomComponentInfo = {
  type: 'uniquedatetime',
  selector: 'my-datetime',
  title: 'Date Time',
  group: 'custom',
  icon: 'square',
};

export function registerCurrentDateComponent(injector: Injector) {
  registerCustomFormioComponent(COMPONENT_OPTIONS, DateTimeComponent, injector);
}
