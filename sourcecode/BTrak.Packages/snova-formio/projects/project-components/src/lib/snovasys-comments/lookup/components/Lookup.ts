
/**
 * This file shows how to create a custom component.
 *
 * Get the base component class by referencing Formio.Components.components map.
 */
 import { Component,Injectable,ViewChild } from '@angular/core';
import { Components, Form, Formio, Templates,FormBuilder} from 'formiojs';
 const FieldComponent = (Components as any).components.field;
 import NativePromise from 'native-promise-only';
 import editForm from './Lookup.form';
 import ChoicesWrapper from '@formio/choices.js';
import { LocalStorageProperties } from "../../globaldependencies/constants/localstorage-properties";
import getRandomComponentId from 'formiojs/utils';
import boolValue from 'formiojs/utils';
 let Choices;
 Choices = ChoicesWrapper;

const environment = JSON.parse(localStorage.getItem(LocalStorageProperties.Environment));
const APIEndpoint = environment.apiURL;
 
 /**
  * Here we will derive from the base component which all Form.io form components derive from.
  *
  * @param component
  * @param options
  * @param data
  * @constructor
  */

export default class Lookup extends (FieldComponent as any) {
    table = [];
    tableData = [];
    numRows = 1;
    numCol = 1;
    constructor(component, options, data) {
      super(component, options, data); 
      this.previousValue = this.dataValue || null;
      this.validators = this.validators.concat('minSelectedCount', 'maxSelectedCount');
    }
 
    static schema() {
      return FieldComponent.schema({
        type: 'lookup',
        label: 'Lookup',
        key: 'lookup',
        values :[{ label: '', value: '' }],   //for radio & checkbox
        idPath: 'id',
        data: {
        values: [],
        json: '',
        url: '',
        resource: '',
        custom: '',
        tableData: []
      },
      clearOnRefresh: false,
      limit: 100,
      dataSrc: 'values',
      valueProperty: '',
      lazyLoad: true,
      filter: '',
      searchEnabled: true,
      searchField: '',
      minSearch: 0,
      readOnlyValue: false,
      authenticate: false,
      ignoreCache: false,
      template: '<span>{{ item.label }}</span>',
      selectFields: '',
      searchThreshold: 0.3,
      uniqueOptions: false,
      tableView: true,
      fuseOptions: {
        include: 'score',
        threshold: 0.3,
      },
      customOptions: {},
      useExactSearch: false,
      relatedfield: [],
      relatedFormsFields: [],
      relatedFieldsData1: [],
      relatedFieldsData2: [],
      relatedFieldsfinalData: [],
      
      });
    }
 
    public static editForm = editForm;

    init() {
      super.init();
      this.validators = this.validators.concat(['select', 'onlyAvailableItems']);
      
      // Keep track of the select options.
      this.selectOptions = [];

      if (this.isInfiniteScrollProvided) {
        this.isFromSearch = false;
   
        this.searchServerCount = null;
        this.defaultServerCount = null;
   
        this.isScrollLoading = false;
   
        this.searchDownloadedResources = [];
        this.defaultDownloadedResources = [];
      }
      // If this component has been activated.
      this.activated = false;
  
      // Determine when the items have been loaded.
      this.itemsLoaded = new NativePromise((resolve) => {
        this.itemsLoadedResolve = resolve;
      });      
    }

    triggerUpdate(update) {
      this.updateItems(null,true);
    }

  /**
   * Returns the outside wrapping element of this component.
   * @returns {HTMLElement}
   */
    getElement() {
      return this.element;
    }
 
    static builderInfo = {
      title: 'Lookup',
      group: 'Custom',
      icon: 'wpforms',
      weight: 70,
      schema: Lookup.schema()
    }

    render(value) {
      let content = '';
      let control = 'text';
      if(this.component.displayAs !== '' && this.component.displayAs !== null && this.component.displayAs !== undefined) {
        control = this.component.displayAs;  
        const info = this.inputInfo
        switch(control) {
          case 'checkbox':  this.component.inputType = 'checkbox';
                            this.component.inline = false;
                            content += this.renderTemplate('radio', {
                              input: this.inputInfo,
                              inline: this.component.inline,
                              values: this.component.values,
                              value: this.dataValue,
                              row: this.row,
                            });
                            break;
          case 'radio':   this.component.inputType = 'radio';
                          content += this.renderTemplate('radio', {
                            input: this.inputInfo,
                            inline: this.component.inline,
                            values: this.component.values,
                            value: this.dataValue,
                            row: this.row,
                          });
                          break;
          case 'dropdown_single_select' : this.component.multiple = false;
                                        info.attr = info.attr || {};
                                        info.multiple = this.component.multiple;
                                        content += this.wrapElement(this.renderTemplate('select', {
                                          input: this.inputInfo,
                                          selectOptions: '',
                                          index: null
                                        })); 
                                        break;
          case 'dropdown_multi_select' : this.component.multiple = true;
                                        info.attr = info.attr || {};
                                        info.multiple = this.component.multiple;
                                        content += this.wrapElement(this.renderTemplate('select', {
                                          input: this.inputInfo,
                                          selectOptions: '',
                                          index: null,
                                        }));          
                                        break;
        }

        //if related fields selected then bind table component to lookup component
        if(this.component.relatedFieldsfinalData.length > 0) {
          if(this.component.valueSelection == 'latest') {
            this.numRows = 2;
          } else {
            this.numRows = this.component.valueSelectionLimit + 1;
          }
          
          this.numCol = this.component.relatedFieldsfinalData.length;
          content += this.displayRelatedFieldsTable();
        }        
      } 
      
      // Calling super.render will wrap it html as a component.
      return super.render(`${content}`);
    }
 
   /**
    * After the html string has been mounted into the dom, the dom element is returned here. Use refs to find specific
    * elements to attach functionality to.
    *
    * @param element
    * @returns {Promise}
    */
    attach(element) {
      if(this.component.displayAs == 'dropdown_single_select' || this.component.displayAs == 'dropdown_multi_select') {
        const superAttach = super.attach(element);
        this.loadRefs(element, {
          selectContainer: 'single',
          addResource: 'single',
          autocompleteInput: 'single'
        });
        //enable autocomplete for select
        const autocompleteInput = this.refs.autocompleteInput;
        if (autocompleteInput) {
          this.addEventListener(autocompleteInput, 'change', (event) => {
            this.setValue(event.target.value);
          });
        }
        const input = this.refs.selectContainer;
        if (!input) {
          return;
        }

        if(input && this.component.displayAs == 'dropdown_multi_select') {
          input.setAttribute('multiple','true');
        }

        this.addEventListener(input, this.inputInfo.changeEvent, () => this.updateValue(null, {
          modified: true
        }));
        this.attachRefreshOnBlur();

        const tabIndex = input.tabIndex;
        this.addPlaceholder();
        //input.setAttribute('dir', this.i18next.dir());
        if (this.choices) {
          this.choices.destroy();
        }
 
        const choicesOptions = this.choicesOptions();

        if (Choices) {
          this.choices = new Choices(input, choicesOptions);
          if (this.selectOptions && this.selectOptions.length) {
            this.choices.setChoices(this.selectOptions, 'value', 'label', true);
          }
          if (this.component.multiple) { 
            this.focusableElement = this.choices.input.element;
          }
          else {
            this.focusableElement = this.choices.containerInner.element;
            this.choices.containerOuter.element.setAttribute('tabIndex', '-1');
            if (choicesOptions.searchEnabled) {
              this.addEventListener(this.choices.containerOuter.element, 'focus', () => this.focusableElement.focus());
            }
          }
    
          if (this.isInfiniteScrollProvided) {
            this.scrollList = this.choices.choiceList.element;
            this.addEventListener(this.scrollList, 'scroll', () => this.onScroll());
          }
        }
        this.focusableElement.setAttribute('tabIndex', tabIndex);

        // If a search field is provided, then add an event listener to update items on search.
        if (this.component.searchField) {
          // Make sure to clear the search when no value is provided.
          if (this.choices && this.choices.input && this.choices.input.element) {
            this.addEventListener(this.choices.input.element, 'input', (event) => {
              this.isFromSearch = !!event.target.value;
    
              if (!event.target.value) {
                this.triggerUpdate(false);
              }
              else {
                this.serverCount = null;
                this.downloadedResources = [];
              }
            });
          }
    
          this.addEventListener(input, 'choice', () => {            
            this.isFromSearch = false;
          });
          this.addEventListener(input, 'search', (event) => this.triggerUpdate(event.detail.value));
          this.addEventListener(input, 'stopSearch', () => this.triggerUpdate(false));
          this.addEventListener(input, 'hideDropdown', () => {
            if (this.choices && this.choices.input && this.choices.input.element) {
              this.choices.input.element.value = '';
            }  
            this.updateItems(null, true);
          });
        }

        this.addEventListener(input, 'showDropdown', () => {
          this.update()
        });

        if (this.choices && choicesOptions.placeholderValue && this.choices._isSelectOneElement) {
          this.addPlaceholderItem(choicesOptions.placeholderValue);
    
          this.addEventListener(input, 'removeItem', () => {
            this.addPlaceholderItem(choicesOptions.placeholderValue);            
          });
        }

        // Add value options.
        this.addValueOptions('');
        this.setChoicesValue(this.dataValue,'');     
    
        // Force the disabled state with getters and setters.
        this.disabled = this.shouldDisabled;       

        return superAttach;
      } else {
        this.loadRefs(element, { input: 'multiple', wrapper: 'multiple' });
        this.refs.input.forEach((input, index) => {
          this.addEventListener(input, this.inputInfo.changeEvent, () => {
            this.updateValue(null, {
              modified: true,
            });
          });
          this.addShortcut(input, this.component.values[index].shortcut);
     
          if (this.isRadio) {
            let dataValue = this.dataValue;
     
            // if (!_.isString(this.dataValue)) {
            //   dataValue = _.toString(this.dataValue);
            // }
     
            input.checked = (dataValue === input.value);
            this.addEventListener(input, 'keyup', (event) => {
              if (event.key === ' ' && dataValue === input.value) {
                event.preventDefault();
     
                this.updateValue(null, {
                  modified: true,
                });
              }
            });
          }
        });
        this.setSelectedClasses();
        return super.attach(element);
      }
    }

    addPlaceholder() {
      if (!this.component.placeholder) {
        return;
      }
   
      this.addOption('', this.component.placeholder, { placeholder: true });
    }

    addValueOptions(items) {
      items = items || [];
      let added = false;
      if (!this.selectOptions.length) {
        // Add the currently selected choices if they don't already exist.
        const currentChoices = Array.isArray(this.dataValue) ? this.dataValue : [this.dataValue];
        added = this.addCurrentChoices(currentChoices, items, false);
        if (!added && !this.component.multiple) {
          this.addPlaceholder();
        }
      }
      return added;
    }

    wrapElement(element) {
      return this.component.addResource && !this.options.readOnly
        ? (
          this.renderTemplate('resourceAdd', {
            element
          })
        )
        : element;
    }

    get defaultSchema() {
      return Lookup.schema();
    }

    get inputInfo() {
      const info = super.elementInfo();
      info.fieldName = '';
      if(this.component.displayAs == 'checkbox') {
        info.attr.name += '[]';
        info.attr.type = 'checkbox';
        info.attr.class = 'form-check-input';
      }
      
      if(this.component.displayAs == 'radio') {
        info.type = 'input';
        info.changeEvent = 'click';
        info.attr.class = 'form-check-input';
        info.attr.name = info.attr.name += `[${this.id}]`;
      }

      if(this.component.displayAs == 'dropdown_single_select' || this.component.displayAs == 'dropdown_multi_select') {
        info.type = 'select';
        info.changeEvent = 'change';
      }
      return info;
    }
 
   /**
    * Get the value of the component from the dom elements.
    *
    * @returns {Array}
    */
    getValue() {
      if(this.component.displayAs == 'dropdown_single_select' || this.component.displayAs == 'dropdown_multi_select') {
          // If the widget isn't active.
          if (
            this.viewOnly || this.loading
            || (!this.component.lazyLoad && !this.selectOptions.length)
            || !this.element
          ) {
            return this.dataValue;
          }
 
          let value = this.emptyValue;
         
          if (this.choices) {
            value = this.choices.getValue(true);
            
            // Make sure we don't get the placeholder
            if (
              !this.component.multiple &&
              this.component.placeholder &&
              (value === this.t(this.component.placeholder, { _userInput: true }))
            ) {
              value = this.emptyValue;
            }
          }
          else if (this.refs.selectContainer) {
            value = this.refs.selectContainer.value;
      
            if (this.valueProperty === '') {
              if (value === '') {
                return {};
              }
      
              const option = this.selectOptions[''];
              if (option && this.isObject(option.value)) {
                value = option.value;
              }
            }
          }
          else {
            value = this.dataValue;
          }
          // Choices will return undefined if nothing is selected. We really want '' to be empty.
          if (value === undefined || value === null) {
            value = '';
          }
          return value;
      }
      if(this.component.displayAs == 'checkbox') {
        if (this.viewOnly || !this.refs.input || !this.refs.input.length) {
          return this.dataValue;
        }
        const value = {};
        this.refs.input.forEach(input => {
          value[input.value] = !!input.checked;
        });
        return value;
      }
      if(this.component.displayAs == 'radio') {
        if (this.viewOnly || !this.refs.input || !this.refs.input.length) {
          return this.dataValue;
        }
        let value = this.dataValue;
        this.refs.input.forEach((input) => {
          if (input.checked) {
            value = input.value;
          }
        });
        return value;
      }
    } 
    
    get isRadio() {
      return this.component.inputType === 'radio';
    }
 
   /**
    * Set the value of the component into the dom elements.
    *
    * @param value
    * @returns {boolean}
    */
    setValue(value, flags = {}) {
      if(this.component.displayAs == 'dropdown_single_select' || this.component.displayAs == 'dropdown_multi_select') {
          const previousValue = this.dataValue;  
          const changed = this.updateValue(value, flags);
          value = this.dataValue;
          const hasPreviousValue = Array.isArray(previousValue) ? previousValue.length : previousValue;
          const hasValue = Array.isArray(value) ? value.length : value;
    
          // Undo typing when searching to set the value.
          if (this.component.multiple && Array.isArray(value)) {
            value = value.map(value => {
              if (typeof value === 'boolean' || typeof value === 'number') {
                return value.toString();
              }
              return value;
            });
          }
          else {
            if (typeof value === 'boolean' || typeof value === 'number') {
              value = value.toString();
            }
          }
    
          // Do not set the value if we are loading... that will happen after it is done.
          if (this.loading) {
            return changed;
          }
 
         // Determine if we need to perform an initial lazyLoad api call if searchField is provided.
        if (this.isInitApiCallNeeded(hasValue)) {
          this.loading = true;
          this.lazyLoadInit = true;
          const searchProperty = this.component.searchField || this.component.valueProperty;
          this.triggerUpdate(value.data);
          return changed;
        }
    
        // Add the value options.
        this.addValueOptions([]);
        this.setChoicesValue(value, hasPreviousValue, flags);
        return changed;
      }

      if(this.component.displayAs == 'checkbox') {
        const changed = this.updateValue(value, flags);
        value = this.dataValue;
        this.refs.input.forEach(input => {
          if (value[input.value] !== undefined) {
            value[input.value] = false;
          }
          input.checked = !!value[input.value];
        });
        return changed;
      }
    } 

    updateValue(value, flags) {
      if(this.component.displayAs == 'radio' ) {
        const changed = super.updateValue(value, flags);
        if (changed) {
          this.setSelectedClasses();
          this.getFormRelatedFieldValues();
        }
    
        if (!flags || !flags.modified || !this.isRadio) {
          return changed;
        }
    
        // If they clicked on the radio that is currently selected, it needs to reset the value.
        this.currentValue = this.dataValue;
        const shouldResetValue = !(flags && flags.noUpdateEvent)
          && this.previousValue === this.currentValue;
        if (shouldResetValue) {
          this.resetValue();
          this.triggerChange(flags);
        }
        this.previousValue = this.dataValue;
        return changed;
      }

      if(this.component.displayAs == 'dropdown_single_select' || this.component.displayAs == 'dropdown_multi_select') {
        this.normalizeValue(value);
        console.log(this.getValue());
        if(this.component.displayAs == 'dropdown_single_select') {
          if(this.getValue() !== '' && this.getValue() !== null) {
            this.getFormRelatedFieldValues();
          }
        }        
      }
      
    }
    
    // setItems(items) {
    //   this.component.value = items;
    //   return this.component.value;
    // }
    /**
   * Adds an option to the select dropdown.
   *
   * @param value
   * @param label
   */
  addOption(value, label, attrs = {}, id = getRandomComponentId()) {
      const idPath = this.component.idPath
      ? this.component.idPath.split('.').reduceRight((obj, key) => ({ [key]: obj }), id)
      : {};
      const option = {
        value: this.getOptionValue(value),
        label,
        ...idPath
      };
 
      //const skipOption = this.component.uniqueOptions;
      const skipOption = this.component.uniqueOptions
      ? !!this.selectOptions.find((selectOption) => this.isEqual(selectOption.value, option.value))
      : false;
  
      if (skipOption) {
        return;
      }
  
      if (value) {
        this.selectOptions.push(option);
      }
 
      if (this.refs.selectContainer && (this.component.widget === 'html5')) {
        // Add element to option so we can reference it later.
        const div = document.createElement('div');
        div.innerHTML = this.sanitize(this.renderTemplate('selectOption', {
          selected: this.isEqual(this.dataValue, option.value),
          option,
          attrs,
          id,
          useId: (this.valueProperty === '') && this.isObject(value) && id,
        })).trim();
  
        option.element = div.firstChild;
        this.refs.selectContainer.appendChild(option.element);
      }
  }

  update() {
    // Activate the control.
    this.activate();
  }

   /**
   * Activate this select control.
   */
    activate() {
      if (this.loading || !this.active) {
        this.setLoadingItem();
      }
      if (this.active) {
        return;
      }
      this.activated = true;
      this.triggerUpdate(false);
    }

    itemTemplate(data) {
      if (this.isEmpty(data)) {
        return '';
      }
      // If they wish to show the value in read only mode, then just return the itemValue here.
      if (this.options.readOnly && this.component.readOnlyValue) {
        return this.itemValue(data);
      }
   
      // Perform a fast interpretation if we should not use the template.
      if (data && !this.component.template) {
        const itemLabel = data.label || data;
        return (typeof itemLabel === 'string') ? this.t(itemLabel, { _userInput: true }) : itemLabel;
      }
      if (typeof data === 'string') {
        return this.t(data, { _userInput: true });
      }
   
      if (data.data) {
        // checking additional fields in the template for the selected Entire Object option
        const hasNestedFields = /item\.data\.\w*/g.test(this.component.template);
        data.data = data.data;
      }
      const template = this.sanitize(this.component.template ? this.interpolate(this.component.template, { item: data }) : data.label);
      if (template) {
        const label = template.replace(/<\/?[^>]+(>|$)/g, '');
        if (!label || !this.t(label, { _userInput: true })) return;
        return template.replace(label, this.t(label, { _userInput: true }));
      }
      else {
        return JSON.stringify(data);
      }
    }

    setChoicesValue(value, hasPreviousValue, flags = {}) {
      const hasValue = Array.isArray(value) ? value.length : value;
      hasPreviousValue = (hasPreviousValue === undefined) ? true : hasPreviousValue;
      if (this.choices) {
        // Now set the value.
        if (hasValue) {
          this.choices.removeActiveItems();
          // Add the currently selected choices if they don't already exist.
          const currentChoices = Array.isArray(value) ? value : [value];
          if (!this.addCurrentChoices(currentChoices, this.selectOptions, true)) {           
            this.choices.setChoices(this.selectOptions, 'value', 'label', true);
          }
          this.choices.setChoiceByValue(value);
        }
        else if (hasPreviousValue) {
          this.choices.removeActiveItems();
        }
      }
      else {
        if (hasValue) {
          const values = Array.isArray(value) ? value : [value];
          this.selectOptions.forEach(selectOption => {
            values.forEach(val  => {
              if (this.isEqual(val, selectOption.value) && selectOption.element) {
                selectOption.element.selected = true;
                selectOption.element.setAttribute('selected', 'selected');
                return false;
              }
            });
          });
          
        }
        else {
          this.selectOptions.forEach(selectOption => {
            if (selectOption.element) {
              selectOption.element.selected = false;
              selectOption.element.removeAttribute('selected');
            }
          });
        }
      }
    }
    
    choicesOptions() {
      const useSearch = this.component.hasOwnProperty('searchEnabled') ? this.component.searchEnabled : true;
      const placeholderValue = this.t(this.component.placeholder, { _userInput: true });
      let customOptions = this.component.customOptions || {};
      if (typeof customOptions == 'string') {
        try {
          customOptions = JSON.parse(customOptions);
        }
        catch (err) {
          console.warn(err.message);
          customOptions = {};
        }
      }
   
      return {
        removeItemButton: this.component.disabled ? false : true,
        itemSelectText: '',
        classNames: {
          containerOuter: 'choices form-group formio-choices',
          containerInner: this.transform('class', 'form-control ui fluid selection dropdown')
        },
        addItemText: false,
        placeholder: !!this.component.placeholder,
        placeholderValue: placeholderValue,
        noResultsText: this.t('No results found'),
        noChoicesText: this.t('No choices to choose from'),
        searchPlaceholderValue: this.t('Type to search'),
        shouldSort: false,
        position: (this.component.dropdown || 'auto'),
        searchEnabled: useSearch,
        searchChoices: !this.component.searchField,
        searchFields: '',
        fuseOptions: this.component.useExactSearch
          ? {}
          : Object.assign(
          {},
          // this.get(this, 'component.fuseOptions', {}),
          // {
          //   include: 'score',
          //   threshold: this.get(this, 'component.searchThreshold', 0.3),
          // }
        ),
        valueComparer: this.isEqual,
        resetScrollPosition: false,
        ...customOptions,
      };
    }

    /**
   * @param {*} value
   * @param {Array} items
   */
    addCurrentChoices(values, items, keyValue) {
      if (!values) {
        return false;
      }
      const notFoundValuesToAdd = [];
      const added = values.reduce((defaultAdded, value) => {
        if (!value) {
          return defaultAdded;
        }
        let found = false;
  
        // Make sure that `items` and `this.selectOptions` points
        // to the same reference. Because `this.selectOptions` is
        // internal property and all items are populated by
        // `this.addOption` method, we assume that items has
        // 'label' and 'value' properties. This assumption allows
        // us to read correct value from the item.
        const isSelectOptions = items === this.selectOptions;
        if (items && items.length) {
          items.forEach(choice => {
            if (choice._id && value._id && (choice._id === value._id)) {
              found = true;
              return false;
            }
            const itemValue = keyValue ? choice.value : this.itemValue(choice, isSelectOptions);
            if(itemValue == value) {
              found = this.isEqual(itemValue, value);
              return found ? false : true;
            }
          });
        }
        // Add the default option if no item is found.
        if (!found) {
          notFoundValuesToAdd.push({
            value: this.itemValue(value),
            label: this.itemTemplate(value)
          });       
          return true;
        }
        return found || defaultAdded;
      }, false);
      if (notFoundValuesToAdd.length) {
        if (this.choices) {
          this.choices.setChoices(notFoundValuesToAdd, 'value', 'label');
        }
        notFoundValuesToAdd.map(notFoundValue => {
          this.addOption(notFoundValue.value, notFoundValue.label);
        });
      }
      return added;
    }

    setLoadingItem(addToCurrentList = false) {
      if (this.choices) {
        if (addToCurrentList) {
          this.choices.setChoices([{
            value: `${this.id}-loading`,
            label: 'Loading...',
            disabled: true,
          }], 'value', 'label');
        }
        else {
          this.choices.setChoices([{
            value: '',
            label: `<i class="${this.iconClass('refresh')}" style="font-size:1.3em;"></i>`,
            disabled: true,
          }], 'value', 'label', true);
        }
      }
      
    }

    getValueAsString(data) {
      if(this.component.displayAs == 'dropdown_single_select' || this.component.displayAs == 'dropdown_multi_select') {
        return (this.component.multiple && Array.isArray(data))
          ? data.map(this.asString.bind(this)).join(', ')
          : this.asString(data);
      }
      if(this.component.displayAs == 'checkbox') {
        if (!data) {
          return '';
        }
        return (this.component.values || [])
          .filter((v) => data[v.value])
          .map('label')
          .join(', ');
      }
    }

    setItems(items, fromSearch) {
      // If the items is a string, then parse as JSON.
      if (typeof items == 'string') {
        try {
          items = JSON.parse(items);
        }
        catch (err) {
          console.warn(err.message);
          items = [];
        }
      }
  
      // Allow js processing (needed for form builder)
      if (this.component.onSetItems && typeof this.component.onSetItems === 'function') {
        const newItems = this.component.onSetItems(this, items);
        if (newItems) {
          items = newItems;
        }
      }
  
      if (!this.choices && this.refs.selectContainer) {
        if (this.loading) {
          // this.removeChildFrom(this.refs.input[0], this.selectContainer);
        }
  
        this.empty(this.refs.selectContainer);
      }
  
      // If they provided select values, then we need to get them instead.
      if (this.component.selectValues) {
        items = this.get(items, this.component.selectValues, items) || [];
      }
  
      let areItemsEqual;
  
      if (this.isInfiniteScrollProvided) {
        areItemsEqual = this.isSelectURL ?this.isEqual(items, this.downloadedResources) : false;
  
        const areItemsEnded = this.component.limit > items.length;
        const areItemsDownloaded = areItemsEqual
          && this.downloadedResources
          && this.downloadedResources.length === items.length;
  
        if (areItemsEnded) {
          this.disableInfiniteScroll();
        }
        else if (areItemsDownloaded) {
          this.selectOptions = [];
        }
        else {
          this.serverCount = items.serverCount;
        }
      }
  
      if (this.isScrollLoading && items) {
        if (!areItemsEqual) {
          this.downloadedResources = this.downloadedResources
            ? this.downloadedResources.concat(items)
            : items;
        }
  
        this.downloadedResources.serverCount = items.serverCount || this.downloadedResources.serverCount;
      }
      else {
        this.downloadedResources = items || [];
        this.selectOptions = [];
        // If there is new select option with same id as already selected, set the new one
        if (!this.isEmpty(this.dataValue) && this.component.idPath) {
          const selectedOptionId = this.get(this.dataValue, this.component.idPath, null);
          const newOptionWithSameId = !this.isNil(selectedOptionId) && items.find(item => {
            const itemId = this.get(item, this.component.idPath);
            return itemId === selectedOptionId;
          });
  
          if (newOptionWithSameId) {
            this.setValue(newOptionWithSameId);
          }
        }
      }
  
      // Add the value options.
      if (!fromSearch) {
        this.addValueOptions(items);
      }
  
      if (this.component.widget === 'html5' && !this.component.placeholder) {
        this.addOption(null, '');
      }
  
      // Iterate through each of the items.
      items.forEach((item, index) => {
          // preventing references of the components inside the form to the parent form when building forms
          if (this.root && this.root.options.editForm && this.root.options.editForm._id && this.root.options.editForm._id === item._id) return;
          this.addOption(this.itemValue(item), this.itemTemplate(item), {},item);
      });
      if (this.choices) {
        this.choices.setChoices(this.selectOptions, 'value', 'label', true);
      }
      else if (this.loading) {
        // Re-attach select input.
        // this.appendTo(this.refs.input[0], this.selectContainer);
      }
  
      // We are no longer loading.
      this.isScrollLoading = false;
      this.loading = false;
  
      // If a value is provided, then select it.
      if (this.dataValue) {
        this.setValue(this.dataValue, {
          noUpdateEvent: true
        });
      }
      else {
        // If a default value is provided then select it.
        const defaultValue = this.multiple ? this.defaultValue || [] : this.defaultValue;
        if (defaultValue) {
          this.setValue(defaultValue);
        }
      }
  
      // Say we are done loading the items.
      this.itemsLoadedResolve();
    }

   /**
   * Normalize values coming into updateValue.
   *
   * @param value
   * @return {*}
   */
    normalizeValue(value) {
      if(this.component.displayAs == 'radio') {
          const dataType = this.component.dataType || 'auto';
    
          if (value === this.emptyValue) {
            return value;
          }
      
          switch (dataType) {
            case 'auto':
              if (!isNaN(parseFloat(value)) && isFinite(value)) {
                value = +value;
              }
              if (value === 'true') {
                value = true;
              }
              if (value === 'false') {
                value = false;
              }
              break;
            case 'number':
              value = +value;
              break;
            case 'string':
              if (typeof value === 'object') {
                value = JSON.stringify(value);
              }
              else {
                value = value.toString();
              }
              break;
            case 'boolean':
              value = !(!value || value.toString() === 'false');
              break;
          }
          return super.normalizeValue(value);
      }

      if(this.component.displayAs == 'dropdown_single_select' || this.component.displayAs == 'dropdown_multi_select') {
        if (this.component.multiple && Array.isArray(value)) {
          return value.map((singleValue) => this.normalizeSingleValue(singleValue,''));
        }        
        
        return super.normalizeValue(this.normalizeSingleValue(value,''));
      }

      if(this.component.displayAs == 'checkbox') {
        value = value || {};
        if (typeof value !== 'object') {
          if (typeof value === 'string') {
            value = {
              [value]: true
            };
          }
          else {
            value = {};
          }
        }
        if (Array.isArray(value)) {
          value.forEach(val => {
            value[val] = true;
          });
        }
     
        return value;
      }
    }

    /**
   * Check if a component is eligible for multiple validation
   *
   * @return {boolean}
   */
    validateMultiple() {
      // Select component will contain one input when flagged as multiple.
      return false;
    }

    asString(value) {
      value = value || this.getValue();
      //need to convert values to strings to be able to compare values with available options that are strings
      const convertToString = (data, valueProperty) => {
        if (valueProperty) {
          if (Array.isArray(data)) {
            data.forEach((item) => item[valueProperty] = item[valueProperty].toString());
          }
          else {
            data[valueProperty] = data[valueProperty].toString();
          }
          return data;
        }
  
        if (this.isBooleanOrNumber(data)) {
          data = data.toString();
        }
  
        if (Array.isArray(data) && data.some(item => this.isBooleanOrNumber(item))) {
          data = data.map(item => {
            if (this.isBooleanOrNumber(item)) {
              item = item.toString();
            }
          });
        }
  
        return data;
      };
  
      value = convertToString(value, this.component.valueProperty);
  
      const {
        items,
        valueProperty,
      } = {
            items: convertToString(this.getNormalizedValues(), 'value'),
            valueProperty: 'value',
          };

      value = (this.component.multiple && Array.isArray(value))
        ? this.filter(items, (item) => value.includes(item.value))
        : valueProperty
          ? this.find(items, [valueProperty, value])
          : value;
  
      if (this.isString(value)) {
        return value;
      }
  
      if (Array.isArray(value)) {
        const items = [];
        value.forEach(item => items.push(this.itemTemplate(item)));
        return items.length > 0 ? items.join('<br />') : '-';
      }
  
      return !this.isNil(value)
        ? this.itemTemplate(value)
        : '-';
    }

    /**
     * Performs required transformations on the initial value to use in selectOptions
     * @param {*} value
     */
    getOptionValue(value) {
      return this.isObject(value) && this.isEntireObjectDisplay()
        ? this.normalizeSingleValue(value,'')
        : this.isObject(value)
          ? value
          : this.isNull(value)
            ? this.emptyValue
            : String(this.normalizeSingleValue(value,''));
    }

    isNull(value) {
      if (value === null) { return true;} else { return false;}
    }

    isEntireObjectDisplay() {
      return false;
    }
 
   /**
   * If component has static values (values, json) or custom values, returns an array of them
   * @returns {Array<*>|undefiened}
   */
    getOptionsValues() {
      let rawItems = [];
      rawItems = this.component.data.values;
  
      if (typeof rawItems === 'string') {
        try {
          rawItems = JSON.parse(rawItems);
        }
        catch (err) {
          console.warn(err.message);
          rawItems = [];
        }
      }
  
      if (!Array.isArray(rawItems)) {
        return;
      }
  
      return rawItems.map((item) => this.getOptionValue(this.itemValue(item)));
    }

    get emptyValue() {
      if(this.component.displayAs == 'dropdown_single_select' || this.component.displayAs == 'dropdown_multi_select') {
        if (this.component.multiple) {
          return [];
        }
        
        if (this.valueProperty) {
          return '';
        }
        return {};
      }
      if(this.component.displayAs == 'checkbox') {
        return this.component.values.reduce((prev, value) => {
          if (value.value) {
            prev[value.value] = false;
          }
          return prev;
        }, {});
      }      
    }

    isEmpty(val) {
      if(this.component.displayAs == 'checkbox') {
        let value = this.dataValue;
        let empty = true;
        for (const key in value) {
          if (value.hasOwnProperty(key) && value[key]) {
            empty = false;
            break;
          }
        }
    
        return empty;
      } else {
        return val == null || val.length === 0 || this.isEqual(val, this.emptyValue);;
      }      
    }

    /* eslint-disable max-statements */
    updateItems(searchInput, forceUpdate) {
      this.itemsLoaded = new NativePromise((resolve) => {
        this.itemsLoadedResolve = resolve;
      });
      if (!this.component.data) {
        console.warn(`Select component ${this.key} does not have data configuration.`);
        this.itemsLoadedResolve();
        return;
      }
  
      // Only load the data if it is visible.
      if (!this.checkConditions()) {
        this.itemsLoadedResolve();
        return;
      }
      this.setItems(this.component.data.values,'');
    }

    setValueAt(index, value) {
      if (this.refs.input && this.refs.input[index] && value !== null && value !== undefined) {
        const inputValue = this.refs.input[index].value;
        this.refs.input[index].checked = (inputValue === value.toString());
      }
    }

    setSelectedClasses() {
      if (this.refs.wrapper) {
        //add/remove selected option class
        const value = this.dataValue;
        this.refs.wrapper.forEach((wrapper, index) => {
          const input = this.refs.input[index];
          const checked  = (input.type === 'checkbox') ? value[input.value] : '';
          //const checked  = (input.type === 'checkbox') ? value[input.value] : (input.value.toString() === value.toString());
          if (checked) {
            //add class to container when selected
            this.addClass(wrapper, this.optionSelectedClass);
            //change "checked" attribute
            input.setAttribute('checked', 'true');
          }
          else {
            this.removeClass(wrapper, this.optionSelectedClass);
            input.removeAttribute('checked');
          }
        });
      }
    }

    get defaultValue() {
      let defaultValue = this.emptyValue;
      if (this.isEmpty(this.component.defaultValue)) {
        defaultValue = this.component.defaultValue;
      }
      if (this.component.customDefaultValue && !this.options.preview) {
        defaultValue = this.evaluate(
          this.component.customDefaultValue,
          { value: '' },
          'value'
        );
      }
   
      return defaultValue;
    }
   
    normalizeSingleValue(value, retainObject) {
      // if (this.isNil(value)) {
      //   return;
      // }
      //check if value equals to default emptyValue
      if (this.isObject(value) && Object.keys(value).length === 0) {
        return value;
      }
      const displayEntireObject = this.isEntireObjectDisplay();
      const dataType = this.component.dataType || 'auto';
      return value;
      
    }

    checkComponentValidity(data, dirty, rowData, options) {
      const minCount = this.component.validate.minSelectedCount;
      const maxCount = this.component.validate.maxSelectedCount;
   
      if ((maxCount || minCount) && !this.isValid(data, dirty)) {
        const count = Object.keys(this.validationValue).reduce((total, key) => {
          if (this.validationValue[key]) {
            total++;
          }
          return total;
        }, 0);
   
        if (maxCount && count >= maxCount) {
          if (this.refs.input) {
            this.refs.input.forEach(item => {
              if (!item.checked) {
                item.disabled = true;
              }
            });
          }
          if (maxCount && count > maxCount) {
            const message = this.t(
              this.component.maxSelectedCountMessage || 'You can only select up to {{maxCount}} items.',
              { maxCount }
            );
            this.setCustomValidity(message, dirty);
            return false;
          }
        }
        else if (minCount && count < minCount) {
          if (this.refs.input) {
            this.refs.input.forEach(item => {
              item.disabled = false;
            });
          }
          const message = this.t(
            this.component.minSelectedCountMessage || 'You must select at least {{minCount}} items.',
            { minCount }
          );
          this.setCustomValidity(message, dirty);
          return false;
        }
        else {
          if (this.refs.input) {
            this.refs.input.forEach(item => {
              item.disabled = false;
            });
          }
        }
      }
   
      return super.checkComponentValidity(data, dirty, rowData, options);
    }

    get isInfiniteScrollProvided() {
      return false;
    }

    get dataReady() {
      // If the root submission has been set, and we are still not attached, then assume
      // that our data is ready.
      if (
        this.root &&
        this.root.submissionSet &&
        !this.attached
      ) {
        return NativePromise.resolve();
      }
      return this.itemsLoaded;
    }

    get valueProperty() {
      if (this.component.valueProperty) {
        return this.component.valueProperty;
      }
      // Force values datasource to use values without actually setting it on the component settings.
      if (this.component.dataSrc === 'values') {
        return 'value';
      }
   
      return '';
    }

    get isSelectResource() {
      return false;
    }
   
    get isSelectURL() {
      return false;
    }

    get shouldDisabled() {
      return super.shouldDisabled || this.parentDisabled;
    }

    isEqual(val1, val2) {
      if(val1== val2) { return true;} else {return false;}
    }

    isObject(val) {
      if (val === null) { return false;}
      return ( (typeof val === 'function') || (typeof val === 'object') );
    }

    disableInfiniteScroll() {
      if (!this.downloadedResources) {
        return;
      }
   
      this.downloadedResources.serverCount = this.downloadedResources.length;
      this.serverCount = this.downloadedResources.length;
    }

    refresh(value, { instance }) {
      if (this.component.clearOnRefresh && (instance && !instance.pristine)) {
        this.setValue(this.emptyValue);
      }
   
      if (this.component.lazyLoad) {
        this.activated = false;
        this.loading = true;
        this.setItems([],'');
        return;
      }
   
      this.updateItems(null, true);
    }

    get serverCount() {
      if (this.isFromSearch) {
        return this.searchServerCount;
      }
   
      return this.defaultServerCount;
    }
   
    set serverCount(value) {
      if (this.isFromSearch) {
        this.searchServerCount = value;
      }
      else {
        this.defaultServerCount = value;
      }
    }

    get downloadedResources() {
      if (this.isFromSearch) {
        return this.searchDownloadedResources;
      }
   
      return this.defaultDownloadedResources;
    }
   
    set downloadedResources(value) {
      if (this.isFromSearch) {
        this.searchDownloadedResources = value;
      }
      else {
        this.defaultDownloadedResources = value;
      }
    }

    get active() {
      return !this.component.lazyLoad || this.activated || this.options.readOnly;
    }

    attachRefreshOnBlur() {
      if (this.component.refreshOnBlur) {
        this.on('blur', (instance) => {
          this.checkRefreshOn([{ instance, value: instance.dataValue }], { fromBlur: true });
        });
      }
    }

    get isLoadingAvailable() {
      return !this.isScrollLoading && this.additionalResourcesAvailable;
    }
   
    onScroll() {
      if (this.isLoadingAvailable) {
        this.isScrollLoading = true;
        this.setLoadingItem(true);
        this.triggerUpdate(this.choices.input.element.value);
      }
    }

    addPlaceholderItem(placeholderValue) {
      const items = this.choices._store.activeItems;
      if (!items.length) {
        this.choices._addItem({
          value: placeholderValue,
          label: placeholderValue,
          choiceId: 0,
          groupId: -1,
          customProperties: null,
          placeholder: true,
          keyCode: null
        });
      }
    }

    set disabled(disabled) {
      super.disabled = disabled;
      if (!this.choices) {
        return;
      }
      if (disabled) {
        this.setDisabled(this.choices.containerInner.element, true);
        this.focusableElement.removeAttribute('tabIndex');
        this.choices.disable();
      }
      else {
        this.setDisabled(this.choices.containerInner.element, false);
        this.focusableElement.setAttribute('tabIndex', this.component.tabindex || 0);
        this.choices.enable();
      }
    }
   
    get disabled() {
      return super.disabled;
    }
   
    set visible(value) {
      // If we go from hidden to visible, trigger a refresh.
      if (value && (!this._visible !== !value)) {
        this.triggerUpdate(false);
      }
      super.visible = value;
    }
   
    get visible() {
      return super.visible;
    }

    redraw() {
      const done = super.redraw();
      this.triggerUpdate(false);
      return done;
    }

    isInitApiCallNeeded(hasValue) {
      return this.component.lazyLoad &&
        !this.lazyLoadInit &&
        !this.active &&
        !this.selectOptions.length &&
        hasValue &&
        this.visible && (this.component.searchField || this.component.valueProperty);
    }

    validateValueAvailability(setting, value) {
      if (!boolValue(setting) || !value) {
        return true;
      }
   
      const values = this.getOptionsValues();
   
      if (values) {
        if (this.isObject(value)) {
          const compareComplexValues = (optionValue) => {
            const normalizedOptionValue = this.normalizeSingleValue(optionValue,'');
   
            if (!this.isObject(normalizedOptionValue)) {
              return false;
            }
   
            try {
              return (JSON.stringify(normalizedOptionValue) === JSON.stringify(value));
            }
            catch (err) {
              console.log('Error while comparing items', err);
              return false;
            }
          };
   
          return values.findIndex((optionValue) => compareComplexValues(optionValue)) !== -1;
        }
   
        return values.findIndex((optionValue) => this.normalizeSingleValue(optionValue,'') === value) !== -1;
      }
      return false;
    }

    /**
   * Deletes the value of the component.
   */
  deleteValue() {
    this.setValue('', {
      noUpdateEvent: true
    });
    this.unset();
  }

  isBooleanOrNumber(value) {
    return typeof value === 'number' || typeof value === 'boolean';
  }
 
  getNormalizedValues() {
    if (!this.component || !this.component.data || !this.component.data.values) {
      return;
    }
    return this.component.data.values.map(
      value => ({ label: value.label, value: String(this.normalizeSingleValue(value.value,'')) })
    );
  }

  detach() {
    super.detach();
    if (this.choices) {
      this.choices.destroy();
      this.choices = null;
    }
  }
 
  focus() {
    if (this.focusableElement) {
      super.focus.call(this);
      this.focusableElement.focus();
    }
  }
 
  setErrorClasses(elements, dirty, hasError) {
    super.setErrorClasses(elements, dirty, hasError);
    if (this.choices) {
      super.setErrorClasses([this.choices.containerInner.element], dirty, hasError);
    }
    else {
      super.setErrorClasses([this.refs.selectContainer], dirty, hasError);
    }
  }

  getFormRelatedFieldValues() {
        let token='';
        const name = 'CurrentUser';
        const nameLenPlus = (name.length + 1);
        token = document.cookie
                .split(';')
                .map(c => c.trim())
                .filter(cookie => {
                  return cookie.substring(0, nameLenPlus) === `${name}=`;
                })
                .map(cookie => {
                  return decodeURIComponent(cookie.substring(nameLenPlus));
                })[0] || null;        
       
        const data = { 
          KeyName: this.component.fieldName,
          KeyValue: this.getValue(),
          FormsModel: this.component.relatedFieldsfinalData,
          PageSize: this.component.valueSelectionLimit
        };
        const Get_Form_Related_Field_Values = APIEndpoint + 'GenericForm/GenericFormApi/GetFormRecordValues';

        fetch(Get_Form_Related_Field_Values, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token 
          },
          body: JSON.stringify(data),
          })
          .then((response) => response.json())
          .then((data) => {
            //console.log('Success:', data);
            var table: HTMLTableElement = <HTMLTableElement> document.getElementById(this.component.key+"-table");
            for(let j=0;j<this.component.relatedFieldsfinalData.length;j++) {
              const formname = this.component.relatedFieldsfinalData[j]['FormName'];
              const formdata = data.data[0][formname];
              for(let k=0;k<formdata.length;k++) {
                let currentRow: HTMLTableRowElement = <HTMLTableRowElement> document.getElementById(this.component.key+"-row-"+(k+1));
                const KeyName = this.component.relatedFieldsfinalData[j]['KeyName'];
                if(formdata[k][KeyName] == undefined) {
                  currentRow.cells[j].innerHTML = '';
                  this.table[k+1][j]='';
                } else {
                  currentRow.cells[j].innerHTML = formdata[k][KeyName];
                  this.table[k+1][j]=formdata[k][KeyName];
                }                
              }
            } 
            this.component.data.tableData = this.table;
          })
          .catch((error) => {
            console.error('Error:', error);
          });
  }

  get optionSelectedClass() {
    return 'radio-selected';
  }

  emptyTable(numRows, numCols) {
    const rows = [];
    for (let i = 0; i < numRows; i++) {
      const cols = [];
      for (let j = 0; j < numCols; j++) {
        const comp = {
          type: 'textfield',
          key: 'lookup-table-'+j,
          label: 'lookup-text',
          input: true,
          tableView: true
        };
        cols.push({ components: [comp] });
      }
      rows.push(cols);
    }
    return rows;
  }

  displayRelatedFieldsTable() {
    let relatedContent = '';
    let rows = this.emptyTable(this.numRows, this.numCol);
    rows.forEach((row, rowIndex) => {
      this.table[rowIndex] = [];
      row.forEach((column, colIndex) => {
        this.table[rowIndex][colIndex] = [];
        column.components.forEach(comp => {
          let columnComponent;
          if (this.builderMode) {
            comp.id = comp.id + rowIndex;
            columnComponent = comp;
          }
          else {
            columnComponent = { ...comp, id: (comp.id + rowIndex) };
          }
 
          // const component = this.createComponent(columnComponent);
          // component.tableRow = rowIndex;
          // component.tableColumn = colIndex;
          // this.table[rowIndex][colIndex].push(component);
        });
      });     
    });

    let content = '';
    for (let i = 0; i < this.numRows; i++) {
      const id = this.component.key+'-row-'+i;
      let row = '<tr id="'+id+'">';
      for (let j = 0; j < this.numCol; j++) {
        let cell = '<td>';
        if(i==0) {  
          this.table[0][j] = this.component.relatedFieldsfinalData[j]['label'];                
          cell += '<span style="font-weight:bold;">'+this.component.relatedFieldsfinalData[j]['label']+'</span>';
        }
        cell += '</td>';
        row += cell;
      }
      row += '</tr>';
      content += row;
    }
    relatedContent += `
      <table class="table table-bordered" id=" ${this.component.key}-table">
        <tbody>
          ${content}
        </tbody>
      </table> `;
    return relatedContent;
  }

}

