import nestedComponentForm from 'formiojs/components/_classes/nested/NestedComponent.form';
import componentForm from 'formiojs/components/_classes/component/Component.form';
import {Triggertab} from '../components/editForm/trigger-tab';
import {fetchtab} from '../components/editForm/fetch-tab';
import {Datatab} from '../components/editForm/data-tab';

export default function(...extend) {
  // return nestedComponentForm([
  //   {
  //     key: 'display',
  //     components: CheckMatrixEditDisplay
  //   },
    
  // ], ...extend);

  return componentForm([
    {
      key: 'display',
      ignore: true
    },
    {
      key: 'data',
      components: Datatab
    },
    {
      key: 'trigger', 
      label:"Trigger",
      weight: 10,
      components: Triggertab
    },
    {
      key: 'fetch',
      label: 'Fetch',
      weight: 20,
      components: fetchtab
    },
    {
      key: 'layout',
      ignore: true
    },
    {
      key: 'validation',
      ignore: true
    }
  ], ...extend);
}