import { Injector } from '@angular/core';
import { Components, FormioCustomComponentInfo, registerCustomFormioComponent } from 'angular-formio';
import { LookUpComponent } from './look-up.component';
import { minimalEditForm } from './look-up.edit';
import  editForm from '../lookup/components/Lookup.form';
const COMPONENT_OPTIONS: FormioCustomComponentInfo = {
  type: 'mylookup', // custom type. Formio will identify the field with this type.
  selector: 'my-look-up', // custom selector. Angular Elements will create a custom html tag with this selector
  title: 'Look Up', // Title of the component
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
 fieldOptions: ['filterFieldsBasedOnForm', 'filterFormName', 'key','validate','disabled','properties','formName','fieldName','selectedFormId','valueSelection','relatedFieldsfinalData','selectedFormName','valueSelectionLimit'], // Optional: explicit field options to get as `Input` from the schema (may edited by the editForm)
};

export function registerLookupComponent(injector: Injector) {
  registerCustomFormioComponent(COMPONENT_OPTIONS, LookUpComponent, injector);
}