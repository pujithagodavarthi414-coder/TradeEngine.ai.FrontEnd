import _ from 'lodash';
// import NativePromise from 'native-promise-only';
// import { Multivalue as any, Multivalue } from 'formiojs/types/components/_classes/multivalue/multivalue';
import { Utils } from "formiojs";
// import { Components, FormioUtils } from 'angular-formio';
import { Components, Form, Templates,FormBuilder} from 'formiojs';
 const FieldComponent = (Components as any).components.input;
import { Input } from 'formiojs/types/components/_classes/input/input';
import * as moment from 'moment';
import editForm from './editForm/DateTime.form';

/**
  * Here we will derive from the base component which all Form.io form components derive from.
  *
  * @param component
  * @param options
  * @param data
  * @constructor
  */

export default class UniqueDateTimeLinkComponent extends (FieldComponent as any)  {
  public schemaEdit: any = editForm;
  constructor(component, options, data) {
    super(component, options, data);
    const timezone = (this.component.timezone || this.options.timezone);
    const time24hr = !_.get(this.component, 'timePicker.showMeridian', true);
 
    // Change the format to map to the settings.
    if (!this.component.enableDate) {
      this.component.format = this.component.format.replace(/yyyy-MM-dd /g, '');
    }
    if (!this.component.enableTime) {
      this.component.format = this.component.format.replace(/ hh:mm a$/g, '');
    }
    else if (time24hr) {
      this.component.format = this.component.format.replace(/hh:mm a$/g, 'HH:mm');
    }
    else {
      this.component.format = this.component.format.replace(/HH:mm$/g, 'hh:mm a');
    }
 
    let customOptions = this.component.customOptions || {};
 
    if (typeof customOptions === 'string') {
      try {
        customOptions = JSON.parse(customOptions);
      }
      catch (err) {
        console.warn(err.message);
        customOptions = {};
      }
    }
 
    /* eslint-disable camelcase */
    this.component.widget = {
      type: 'calendar',
      timezone,
      displayInTimezone: _.get(this.component, 'displayInTimezone', 'viewer'),
      submissionTimezone: this.submissionTimezone,
      locale: this.options.language,
      useLocaleSettings: _.get(this.component, 'useLocaleSettings', false),
      allowInput: _.get(this.component, 'allowInput', true),
      mode: 'single',
      enableTime: _.get(this.component, 'enableTime', true),
      noCalendar: !_.get(this.component, 'enableDate', true),
      format: this.component.format,
      hourIncrement: _.get(this.component, 'timePicker.hourStep', 1),
      minuteIncrement: _.get(this.component, 'timePicker.minuteStep', 5),
      time_24hr: time24hr,
      readOnly: this.options.readOnly,
      minDate: _.get(this.component, 'datePicker.minDate'),
      disabledDates: _.get(this.component, 'datePicker.disable'),
      disableWeekends: _.get(this.component, 'datePicker.disableWeekends'),
      disableWeekdays: _.get(this.component, 'datePicker.disableWeekdays'),
      disableFunction: _.get(this.component, 'datePicker.disableFunction'),
      maxDate: _.get(this.component, 'datePicker.maxDate'),
      ...customOptions,
    };
    /* eslint-enable camelcase */
 
    // Add the validators date.
    this.validators.push('date');
  }

  static schema(...extend) {
    return FieldComponent.schema({
      type: 'mylinkdatetime',
      label: 'Unique Link Date / Time',
      key: 'mylinkdatetime',
      format: 'yyyy-MM-dd hh:mm a',
      useLocaleSettings: false,
      allowInput: true,
      enableDate: true,
      enableTime: true,
      defaultValue: '',
      defaultDate:'',
      disabled: true,
      displayInTimezone: 'viewer',
      timezone: '',
      datepickerMode: 'day',
      datePicker: {
        showWeeks: true,
        startingDay: 0,
        initDate: '',
        minMode: 'day',
        maxMode: 'year',
        yearRows: 4,
        yearColumns: 5,
        minDate: null,
        maxDate: null
      },
      timePicker: {
        hourStep: 1,
        minuteStep: 1,
        showMeridian: true,
        readonlyInput: false,
        mousewheel: true,
        arrowkeys: true
      },
      customOptions: {},
    }, ...extend);
  }
 
  static get builderInfo() {
    return {
      title: 'Unique Link Date / Time',
      group: 'advanced',
      icon: 'calendar',
      documentation: '/userguide/#datetime',
      weight: 40,
      schema: UniqueDateTimeLinkComponent.schema()
    };
  }

  static editForm = editForm;
 
  performInputMapping(input) {
    if (input.widget && input.widget.settings) {
      input.widget.settings.submissionTimezone = this.submissionTimezone;
    }
    return input;
  }
 
  get defaultSchema() {
    return UniqueDateTimeLinkComponent.schema();
  }
 
  get defaultValue() {
    let defaultValue = super.defaultValue;
    if (!defaultValue && this.component.defaultDate) {
      defaultValue = Utils.getDateSetting(this.component.defaultDate);
      defaultValue = defaultValue ? defaultValue.toISOString() : '';
    }
    return defaultValue;
  }
 
  get emptyValue() {
    return '';
  }
 
  get momentFormat() {
    return Utils.convertFormatToMoment(this.component.format);
  }
 
  isEmpty(value = this.dataValue) {
    if (value && (value.toString() === 'Invalid Date')) {
      return true;
    }
    return super.isEmpty(value);
  }
 
  formatValue(input) {
    const result = moment.utc(input).toISOString();
    return result === 'Invalid date' ? input : result;
  }
 
  isEqual(valueA, valueB = this.dataValue) {
    return (this.isEmpty(valueA) && this.isEmpty(valueB))
      || moment.utc(valueA).format(this.momentFormat) === moment.utc(valueB).format(this.momentFormat);
  }
 
  createWrapper() {
    return false;
  }
 
  checkValidity(data, dirty, rowData) {
    if (this.refs.input) {
      this.refs.input.forEach((input) => {
        if (input.widget && input.widget.enteredDate) {
          dirty = true;
        }
      });
    }
    return super.checkValidity(data, dirty, rowData);
  }
 
  getValueAsString(value) {
    const format = Utils.convertFormatToMoment(this.component.format);
    return (value ? moment(value).format(format) : value) || '';
  }
}