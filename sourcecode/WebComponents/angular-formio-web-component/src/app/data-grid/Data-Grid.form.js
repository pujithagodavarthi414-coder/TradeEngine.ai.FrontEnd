

import WellEditDisplay from './well-component/editForm/Data.edit.display';

export default function(...extend) {
  return nestedComponentForm([
    {
      key: 'display',
      components: WellEditDisplay
    },
    {
      key: 'addons',
      ignore: true
    },
  ], ...extend);
}
