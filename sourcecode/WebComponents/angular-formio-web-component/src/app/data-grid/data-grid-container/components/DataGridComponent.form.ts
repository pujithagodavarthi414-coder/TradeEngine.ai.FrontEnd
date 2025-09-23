import nestedComponentForm from 'formiojs/components/_classes/nested/NestedComponent.form';
import componentForm from 'formiojs/components/_classes/component/Component.form';
import _ from 'lodash';
import { DataGridEditDisplay } from './editForm/data-grid-display-edit';

export default function(...extend) {
  return componentForm([
    {
      key: 'display',
      components: DataGridEditDisplay
    },
    {
      key: 'data',
      ignore: true 
    },
    {
      key: 'validation',
      ignore: true 
    },
  ], ...extend);
}

