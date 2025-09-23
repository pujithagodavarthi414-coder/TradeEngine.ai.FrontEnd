import nestedComponentForm from 'formiojs/components/_classes/nested/NestedComponent.form';
import componentForm from 'formiojs/components/_classes/component/Component.form';
import _ from 'lodash';
import { WellEditDisplay } from './editForm/well-display-edit';

export default function(...extend) {
  return componentForm([
    {
      key: 'display',
      components: WellEditDisplay
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

