import { Injector } from '@angular/core';
import { Components, FormioCustomComponentInfo, registerCustomFormioComponent } from 'angular-formio';
import { LivesImageUploadComponent } from './lives-image-upload.component';
import { minimalEditForm } from './lives-image-upload.edit';

const COMPONENT_OPTIONS: FormioCustomComponentInfo = {
  type: 'livesimageupload', // custom type. Formio will identify the field with this type.
  selector: 'my-lives-image-uploads', // custom selector. Angular Elements will create a custom html tag with this selector
  title: 'SingleImage', // Title of the component
  group: 'advanced', // Build Group
  icon: 'image', // Icon
  // editForm: minimalEditForm,
//  template: 'input', // Optional: define a template for the element. Default: input
//  changeEvent: 'valueChange', // Optional: define the changeEvent when the formio updates the value in the state. Default: 'valueChange',
 editForm: Components.components.file.editForm, // Optional: define the editForm of the field. Default: the editForm of a textfield
//  documentation: '', // Optional: define the documentation of the field
//  weight: 0, // Optional: define the weight in the builder group
//  schema: {}, // Optional: define extra default schema for the field
//  extraValidators: [], // Optional: define extra validators  for the field
//  emptyValue: null, // Optional: the emptyValue of the field
 fieldOptions: ['validate','filePattern','fileMaxSize','tableView','disabled','uploadOnly','properties'], // Optional: explicit field options to get as `Input` from the schema (may edited by the editForm)
};

export function registerSingleFileUploadComponent(injector: Injector) {
  registerCustomFormioComponent(COMPONENT_OPTIONS, LivesImageUploadComponent, injector);
}