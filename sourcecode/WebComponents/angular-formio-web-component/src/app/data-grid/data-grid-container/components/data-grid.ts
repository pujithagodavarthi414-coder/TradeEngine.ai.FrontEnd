//import NestedComponent from 'formiojs/components/_classes/nested/NestedComponent';
import NestedComponent from 'formiojs/components/datagrid/DataGrid';
import editForm from './DataGridComponent.form';
import _ from 'lodash';
import NativePromise from 'native-promise-only';
import { Multivalue as any, Multivalue } from 'formiojs/types/components/_classes/multivalue/multivalue';
import { Utils } from "formiojs";
import { Components } from 'angular-formio';


export default class DataGridComponent extends (NestedComponent as any){
  public schemaEdit: any = editForm;
  constructor(component, options, data)   {
    super(component, options, data);
  }
  
  static schema(...extend) {
    return NestedComponent.schema({
      type: 'datagrid',
      input: false,
      key: "dataGrid",
      persistent: false,
      hideLabel: true,
      addAnother: " ",
      multiple:false,
      addAnotherPosition: "top",
      components: [
        {
          label: "Columns",
          key: "columns",
          type: "well",
          input: false,
          hideLabel: true,
          tableView: false,
          components: []
        }
      ]

    }, ...extend);
  };
  
  static get builderInfo() {
    return {
      title: 'Container',
      icon: 'square-o',
      group: 'custom',
      documentation: '/userguide/forms/layout-components#datagrid',
      weight: 60,
      schema: DataGridComponent.schema()
    }
  }

  static editForm = editForm;

}


 



