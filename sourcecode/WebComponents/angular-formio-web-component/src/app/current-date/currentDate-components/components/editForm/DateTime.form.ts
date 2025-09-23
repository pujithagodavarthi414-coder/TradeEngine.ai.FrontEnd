import DateTimeEditData from './DateTime.edit.data';
import DateTimeEditDate from './DateTime.edit.date';
import DateTimeEditDisplay from './DateTime.edit.display';
import DateTimeEditTime from './DateTime.edit.time';
import DateTimeEditValidation from './DateTime.edit.validation';
import componentForm from 'formiojs/components/_classes/component/Component.form';

export default function(...extend) {
  return componentForm([
    {
      key: 'display',
      components: DateTimeEditDisplay
    },
    {
      label: 'Date',
      key: 'date',
      weight: 1,
      components: DateTimeEditDate
    },
    {
      label: 'Time',
      key: 'time',
      weight: 2,
      components: DateTimeEditTime
    },
    {
      key: 'data',
      components: DateTimeEditData
    },
    {
      key: 'validation',
      components: DateTimeEditValidation
    },
    {
      key: 'addons',
      ignore: true
    },
  ], ...extend);
}
