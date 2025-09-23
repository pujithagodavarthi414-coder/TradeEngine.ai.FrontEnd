/**
 * This file shows how to create a custom component.
 *
 * Get the base component class by referencing Formio.Components.components map.
 */
 import { Component } from '@angular/core';
import { Components, Formio, Templates  } from 'formiojs';
 const FieldComponent = (Components as any).components.field;
//  const ButtonComponent = (Components as any).components.button;
 import BaseEditForm  from 'formiojs/form';
 import NativePromise from 'native-promise-only';
 import editForm from './DataSource.form';
 import * as formUtils from 'formiojs/utils/formUtils.js';
import { faHandMiddleFinger } from '@fortawesome/free-solid-svg-icons';
import { HttpHeaders } from '@angular/common/http';
 
 /**
  * Here we will derive from the base component which all Form.io form components derive from.
  *
  * @param component
  * @param options
  * @param data
  * @constructor
  */
export default class DataSource extends (FieldComponent as any) {
    public dataSrc: any;
    public urlParam = [];
    public indexeddbParam = [];
    public noSetting = false;
    constructor(component, options, data) {
      super(component, options, data);   
    }
 
    static schema() {
      return FieldComponent.schema({
        type: 'datasource',
        label: 'DataSource',
        key: 'customDataSource',
        fetch: {
          values: [],
          url: '',
        },
        dataSrc: 'url',
        tableView: false,
        dataGridLabel: false,
        modalEdit: false,
        // hidden :true,
        inputType: 'hidden',
        tooltip: '',
        resultType: ''
      });
    }
 
    public static editForm = editForm;

    init() {
      super.init();
    }

  /**
   * Returns the outside wrapping element of this component.
   * @returns {HTMLElement}
   */
    getElement() {
      //console.log(this.element);
      return this.element;
    }

    // get ready() {
    //   return super.ready.then(() => {
    //     console.log('jjjjj');
    //     if(this.component.trigger.init) {
    //       this.fetchData();
    //     }
    //     return this.loadingSubmission ? this.submissionReady : true;
    //   });
    // }

    
    get ready() {
      console.log(this.data);
      //console.log(this.root);
      this.root._form.components.forEach(component => {
        //console.log(component);
        if(component.type == 'textfield') {
          //component.defaultValue = 'aaaa';
          //this.root._form.redraw();
          //component.defaultValue = this.root._form.components[0].value;
        }
      });
      // formUtils.eachComponent(this.root._form.components.components, function (component) {
      //   console.log(component);
      //   if(component.type == 'textfield') {
          
      //     component.defaultValue = this.root._form.components[0].value;
      //   }
      // }, false);
      
      return true;
      //return this.webform.ready;
    }
 
    static builderInfo = {
      title: 'Data Source',
      group: 'Custom',
      icon: 'cloud',
      weight: 70,
      documentation: '/userguide/#datasource',
      schema: DataSource.schema()
    }

    // render(children) {
    //   if (this.instance) {
    //     console.log('render');
    //   }
    //   let content = '';
    //   content += this.renderTemplate('input', {
    //       input: {
    //         type: 'input',
    //         ref: 'dataSource',
    //         attr: {
    //           id: 'dataSource',
    //           class: 'form-control',
    //           type: 'hidden',
    //         }
    //       }
    //   });

    //   // Calling super.render will wrap it html as a component.
    //   return super.render(`${content}`);
    // }
 
   /**
    * After the html string has been mounted into the dom, the dom element is returned here. Use refs to find specific
    * elements to attach functionality to.
    *
    * @param element
    * @returns {Promise}
    */
    attach(element) {
      let flags = {};
      this.loadRefs(element, {
        removeComponent: 'single',
        editComponent: 'single',
        moveComponent: 'single',
        copyComponent: 'single',
        pasteComponent: 'single',
        editJson: 'single'
      });
      
      this.addEventListener(element, 'click', () => this.updateValue(flags, ''));

      if (this.refs.editComponent) {
        this.addEventListener(this.refs.editComponent, 'click', () => { 
          this.root.components.forEach(element => {
            if(element.component.dataSource == this.component.key) {
              setTimeout(() =>{ 
                const el = document.getElementsByClassName('formio-dialog-close')[0]as HTMLElement;
                if(el) {
                  el.click();                  
                  alert('This data source component is used in another component. You can not edit it.');
                }
              }, 100);
              return false;
            }
          });
        });
      }  
      
      if (this.refs.removeComponent) {            
        this.addEventListener(this.refs.removeComponent, 'click', () => {
          const ComponentTypes = ['textfield', 'textarea','number','password','checkbox','selectboxes','select','radio'];
          let isUsedOther = 0;
          this.options.parent.components.forEach(element => {
            if(ComponentTypes.includes(element.component.type)) {
              if(element.component.dataSource !== '' && element.component.dataSource !== null) {
                if(element.component.dataSource == this.component.key) {
                  isUsedOther++;

                  if(element.component.type == 'checkbox' || element.component.type == 'radio'|| element.component.type == 'selectboxes') {
                      //clear the label value (this value is the value of removed data source component)
                      element.component.label = '';
                      //Sets the default label
                      switch(element.component.type) {
                        case 'checkbox':  element.component.lable = 'Checkbox';
                                          break;
                        case 'radio':  element.component.lable = 'Radio';
                                          break;
                        case 'selectboxes':  element.component.lable = 'Select Boxes';
                                          break;
                      }
                  } else if(element.component.type == 'select') {
                      element.component.data.url = '';
                      element.component.dataSrc = 'values';
                      element.component.valueProperty = '';
                      element.component.template = '<span>{{ item.label }}</span>';
                  } else {
                      element.component.defaultValue = '';
                  }
                  
                  element.component.dataSource = '';
                  if(isUsedOther == 1) {
                    alert('This data source component value is used in other component. By removing this component also clears the value of other component where it is used.' );
                  }  
                }
              }
            }
          });
        });
      }

      return super.attach(element);
    }

    get defaultSchema() {
      return DataSource.schema();
    }

    get inputInfo() {
      const info = super.elementInfo();
      info.type = 'input';
      info.attr.type = 'hidden';
      info.changeEvent = 'change';
      return info;
    }

    // labelIsHidden() {
    //   return true;
    // }
 
   /**
    * Get the value of the component from the dom elements.
    *
    * @returns {Array}
    */
    getValue() {
      return this.component.value;
    }    
 
   /**
    * Set the value of the component into the dom elements.
    *
    * @param value
    * @returns {boolean}
    */
    setValue(value, flags = {}) {
      this.dataSrc = this.component.dataSrc;
      switch (this.component.dataSrc) {
        case 'url': {
          if (this.calculatedValue) {
            // If we are lazyLoading, wait until activated.
            this.itemsLoadedResolve();
            return;
          }

          if(this.component.fetch.url && this.component.fetch.method) {
            let  url  = this.component.fetch.url;
            let method = this.component.fetch.method;
            let body;
            const options = this.component.authenticate ? {} : { noToken: true };
            this.loadItems(url, this.requestHeaders, options, method, body);
          }
          break;
        }
        case 'indexeddb': {
          if (typeof window === 'undefined') {
            return;
          }
  
          if (!window.indexedDB) {
            window.alert("Your browser doesn't support current version of indexedDB");
          }

          if (this.component.indexeddb && this.component.indexeddb.database && this.component.indexeddb.table) {
            const request = window.indexedDB.open(this.component.indexeddb.database);
            
            request.onupgradeneeded = (event) => {
              const db = request.result;
              const objectStore = db.createObjectStore(this.component.indexeddb.table, { keyPath: 'myKey', autoIncrement: true });
              objectStore.transaction.oncomplete = () => {
                const transaction = db.transaction(this.component.indexeddb.table, 'readwrite');
                this.component.customOptions.forEach((item) => {
                  transaction.objectStore(this.component.indexeddb.table).put(item);
                });
              };
            };
            
            request.onerror = () => {
              window.alert(request.error);
            };
            //console.log(request);
            request.onsuccess = (event) => {
              const db = request.result;
              const transaction = db.transaction(this.component.indexeddb.table, 'readwrite');
              const objectStore = transaction.objectStore(this.component.indexeddb.table);
              new NativePromise((resolve) => {
                const responseItems = [];
                objectStore.getAll().onsuccess = (event) => {
                  console.log(event);
                  // event.target.result.forEach((item) => {
                  //   responseItems.push(item);
                  // });
                  resolve(responseItems);
                };
              }).then((items) => {
                // if (!_.isEmpty(this.component.indexeddb.filter)) {
                //   items = _.filter(items, this.component.indexeddb.filter);
                // }
                // this.setItems(items);
              });
            };
            
          }
        }
      }    
      return this.updateValue(flags,this.component.value);
    } 

    updateValue(flags, value) {
      if (!this.hasInput) {
        return false;
      }
   
      flags = flags || {};
      const newValue = value || this.getValue();
      const changed = this.hasChanged(newValue, this.dataValue);
      this.dataValue = newValue;
      return changed;
    }
    
    setItems(items) {
      this.component.value = items;
      this.dataValue = items;
      return this.component.value;
    }

    get requestHeaders() {
      // Create the headers object.
      const headers = new Formio.Headers();
  
      // Add custom headers to the url.
      if (this.component.fetch && this.component.fetch.headers) {
        try {
          this.component.fetch.headers.forEach(header => {
            if (header.key) {
              headers.set(header.key, this.interpolate(header.value));
            }
          });
        }
        catch (err) {
          console.warn(err.message);
        }
      }

      //headers.set('Access-Control-Allow-Origin',this.interpolate('*'));
      headers.set("Access-Control-Allow-Origin", "*");
      headers.set("Access-Control-Allow-Credentials", "true");
      // headers.set("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
      // headers.set("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
  
      return headers;
    }

    loadItems(url, headers, options, method, body) { 
      let urlData = '';
      options = options || {};

      const limit = this.component.limit || 100;
      const skip = this.isScrollLoading ? this.selectOptions.length : 0;
      const query = this.component.disableLimit ? {} : {
        limit,
        skip,
      };

      // Allow for url interpolation.
      url = this.interpolate(url, {
        formioBase: Formio.getBaseUrl(),
        limit,
        skip,
        page: Math.abs(Math.floor(skip / limit))
      });

      // Set ignoreCache if it is
      options.ignoreCache = this.component.ignoreCache;

      if (!this.component.fetch.method) {
        method = 'GET';
      }
      else {
        method = this.component.fetch.method;
        if (method.toUpperCase() === 'POST') {
          body = this.component.fetch.body;
        }
        else {
          body = null;
        }
      }

      // Make the request.
      options.header = headers;
      this.loading = true;
      
      // Formio.makeRequest(this.options.formio, 'datasource', url, method, body, options)
      //   .then((response) => {
      //     this.loading = false;
      //     this.setItems(response);
      //     const dataType = typeof(response);
      //     if(dataType == 'object') {
      //       if(Array.isArray(response)) {
      //         this.component.resultType = 'array';
      //       } else {
      //         this.component.resultType = 'json';
      //       }
      //     } else {
      //       this.component.resultType = dataType;
      //     }
      //     console.log(this.component.resultType);
      //     //console.log(this.data);
      //   })
      //   .catch((err) => {
      //     if (this.isInfiniteScrollProvided) {
      //       this.setItems([]);
      //     }
      //   }); 
       
        fetch(url, {
            method: method,
          })
          .then((response) => response.json())
          .then((data) => {
                  this.setItems(data);
              const dataType = typeof(data);
              if(dataType == 'object') {
                if(Array.isArray(data)) {
                  this.component.resultType = 'array';
                } else {
                  this.component.resultType = 'json';
                }
              } else {
                this.component.resultType = dataType;
              }                                        
          })
          .catch((error) => {
            console.error('Error:', error);
          });
    }

}

