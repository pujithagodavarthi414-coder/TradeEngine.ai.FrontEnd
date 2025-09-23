import NestedComponent from 'formiojs/components/_classes/nested/NestedComponent';
import editForm from './WellComponent.form';
import _ from 'lodash';
import NativePromise from 'native-promise-only';
import { Multivalue as any, Multivalue } from 'formiojs/types/components/_classes/multivalue/multivalue';
import { Utils } from "formiojs";
import { Components } from 'angular-formio';


export default class WellComponent extends (NestedComponent as any){
  public schemaEdit: any = editForm;
  constructor(component, options, data)   {
    super(component, options, data);
  }
  
  static schema(...extend) {
    return NestedComponent.schema({
      type: 'wellcomponent',
      input: false,
      key: "well",
      persistent: false,
      components: []

    }, ...extend);
  };
  
  static get builderInfo() {
    return {
      title: 'Container',
      icon: 'square-o',
      group: 'custom',
      documentation: '/userguide/forms/layout-components#well',
      weight: 60,
      schema: WellComponent.schema()
    }
  }

  static editForm = editForm;

}


 



