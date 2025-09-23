import nestedComponentForm from 'formiojs/components/_classes/nested/NestedComponent.form';
import componentForm from 'formiojs/components/_classes/component/Component.form';
import { DisplayComponents } from '../lookup/components/editForm/display';
import { FormComponents } from '../lookup/components/editForm/formcomponents';
// export { multiSelect, multiSelectOptions } from '../components/editForm/comp3';

export default function(...extend) {
 return componentForm([
    {
        key: 'display',
        components: DisplayComponents
    },
    {
        key: 'form',
        label: 'Form',
        weight: 20
    },
    // {
    //   key: 'api',
    //   ignore: true
    // },
    // {
    //   key: 'validation',
    //   ignore: true
    // },
    {
        key: 'data',
        ignore: true
    },
    // {
    //     key: 'conditional',
    //     ignore: true
    // },
    // {
    //     key: 'layout',
    //     ignore: true
    // },
    // {
    //     key: 'logic',
    //     ignore: true
    // }
  ], ...extend);
}