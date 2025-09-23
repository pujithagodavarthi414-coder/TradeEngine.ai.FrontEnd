import { Injector } from '@angular/core';
import { Components, FormioCustomComponentInfo, registerCustomFormioComponent } from 'angular-formio';
import { RqComponent } from './rq-component';
import  editForm from './Rq.form';
const COMPONENT_OPTIONS: FormioCustomComponentInfo = {
  type: 'myrq', // custom type. Formio will identify the field with this type.
  selector: 'my-rq', // custom selector. Angular Elements will create a custom html tag with this selector
  title: 'Rq', // Title of the component
  group: 'custom', // Build Group
  icon: 'file', // Icon
  // editForm: minimalEditForm,
//  template: 'input', // Optional: define a template for the element. Default: input
//  changeEvent: 'valueChange', // Optional: define the changeEvent when the formio updates the value in the state. Default: 'valueChange',
 editForm: editForm, // Optional: define the editForm of the field. Default: the editForm of a textfield
//  documentation: '', // Optional: define the documentation of the field
//  weight: 0, // Optional: define the weight in the builder group


//  schema: {}, // Optional: define extra default schema for the field
//  extraValidators: [], // Optional: define extra validators  for the field
//  emptyValue: null, // Optional: the emptyValue of the field
 fieldOptions: ['value', 'key', 'disabled', 'formName', 'selectedFormName', 'selectedFormId', 'selectedForm', 'fieldName', 'operator', 'calculateFieldName', 'relatedFieldsfinalData'], // Optional: explicit field options to get as `Input` from the schema (may edited by the editForm)
};

export function registerRqComponent(injector: Injector) {
  registerCustomFormioComponent(COMPONENT_OPTIONS, RqComponent, injector);
}