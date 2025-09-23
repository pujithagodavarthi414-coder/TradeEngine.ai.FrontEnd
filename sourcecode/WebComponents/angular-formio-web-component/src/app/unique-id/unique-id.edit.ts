import nestedComponentForm from 'formiojs/components/_classes/nested/NestedComponent.form';
import componentForm from 'formiojs/components/_classes/component/Component.form';
import { DisplayComponents } from '../lookup/components/editForm/display';
// export { multiSelect, multiSelectOptions } from '../components/editForm/comp3';

export default function(...extend) {
 return componentForm([
    {
        key: 'display',
        components: DisplayComponents
    },
    // {
    //     key: 'form',
    //     label: 'Form',
    //     weight: 20,
    //     components: FormComponents
    // },
    {
      key: 'api',
      ignore: false
    },
    {
      key: 'validation',
      ignore: false
    },
    {
        key: 'data',
        ignore: false
    },
    {
        key: 'conditional',
        ignore: false
    },
    {
        key: 'layout',
        ignore: false
    },
    {
        key: 'logic',
        ignore: false
    }
  ], ...extend);
}