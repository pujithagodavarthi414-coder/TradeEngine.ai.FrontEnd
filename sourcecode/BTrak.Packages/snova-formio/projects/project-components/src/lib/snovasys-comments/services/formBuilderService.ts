import { Injectable, Type } from "@angular/core";
import { FormService } from '../services/formService';
import { CookieService } from 'ngx-cookie-service';
import { LocalStorageProperties } from "../globaldependencies/constants/localstorage-properties";
import { FormFieldValue } from '../models/formFieldValue';
import { FormRelatedFieldValue } from '../models/formRelatedFieldValues';
const APIEndpoint = document.location.hostname == 'localhost' ? 'http://localhost:55224/' : document.location.origin + '/backend/';
const Get_Form_Field_Values = APIEndpoint + 'GenericForm/GenericFormApi/GetFormFieldValues';
const Get_User_Valu_ByRole = APIEndpoint + 'GenericForm/GenericFormApi/GetUsersBasedonRole?roles=';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: "root"
})

export class FormBuilderService {
  options = {};
  listDataSource = [];
  textDataSource = [];
  numberDataSource = [];
  formList = [];
  selectedFormId: string = '';
  currentUser = this.cookieService.get(LocalStorageProperties.CurrentUser);
  texFieldOptions: ({ type: string; input: boolean; checked: boolean; key: string; label: string; weight: number; tooltip: string; dataSrc: string; lazyLoad: boolean; data: { url: string; headers: { key: string; value: string; }[]; }; valueProperty: string; template: string; multiple: boolean; selectValues: string; refreshOn: string; onChange(context: any): void; conditional?: undefined; } | { type: string; input: boolean; key: string; label: string; weight: number; tooltip: string; dataSrc: string; lazyLoad: boolean; data: { url: string; headers: { key: string; value: string; }[]; }; valueProperty: string; template: string; multiple: boolean; selectValues: string; refreshOn: string; onChange(context: any): void; checked?: undefined; conditional?: undefined; } | { type: string; input: boolean; multiple: boolean; key: string; label: string; weight: number; tooltip: string; conditional: { json: { and: ({ in: (string[] | { var: string; })[]; '==='?: undefined; } | { '===': (string | { var: string; })[]; in?: undefined; })[]; }; }; dataSrc: string; lazyLoad: boolean; data: { url: string; headers: { key: string; value: string; }[]; }; valueProperty: string; template: string; selectValues: string; refreshOn: string; onChange(context: any): void; checked?: undefined; })[];
  constructor(public formService: FormService, private cookieService: CookieService) { }

  getOptions() {
    this.listDataSource = [];
    this.textDataSource = [];
    this.numberDataSource = [];
    return this.options = {
      builder: {
        advanced: {
          components: {
            file: false
          }
        },
        premium: false,
        custom: {
          title: 'Custom',
          weight: 200,
          components: {
            datasource: true,
            lookup: true
          }
        },
      },
      editForm: {
        lookup: [
          {
              key: 'form',
              components: [
                {
                    type: 'select',
                    input: true,
                    key: 'formName',
                    label: 'Form Name',
                    weight: 20,       
                    tooltip: 'The form list from that we fetch data.',
                    dataSrc: 'url',
                    lazyLoad: false,
                    data: {
                      url: this.formService.Get_Forms_List,
                      headers: 
                          [
                              {key: 'Content-Type', value: 'application/json'},
                              {key: 'Authorization', value: 'Bearer '+this.currentUser}
                          ]
                    },
                    valueProperty: 'id',
                    template: '<span>{{ item.formName }}</span>',
                    selectValues: 'data',
                    conditional: {
                      json: { '===': [{ var: 'data.importDataType' }, 'form'] },
                    },
                    onChange(context) {                              
                      context.self.defaultDownloadedResources.findIndex(function(item, index) {
                        if(item.id == context.data.formName) {
                            context.data.selectedFormName = item.formName;
                            return;
                        }                                  
                      });
                    }
                },
                {
                  type: 'select',
                  input: true,
                  key: 'fieldName',
                  label: 'Field Name',
                  weight: 30,
                  tooltip: 'The field list of selected form. This selected field value will display in the form. By selecting a field we will fetch the other fields data.',
                  conditional: {
                      json: { '===': [{ var: 'data.importDataType' }, 'form'] },
                  },
                  dataSrc: 'url',
                  lazyLoad: false,
                  data: {
                    url: this.formService.Get_Form_Fields+'{{row.formName}}',
                    headers: 
                        [
                            {key: 'Content-Type', value: 'application/json'},
                            {key: 'Authorization', value: 'Bearer '+this.currentUser}
                        ]
                  },
                  valueProperty: 'key',
                  template: '<span>{{ item.label }}</span>',
                  selectValues: 'data',
                  refreshOn: 'formName',
                  onChange(context) {
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

                      let selectData = [];
                      const formField = new FormFieldValue();
                      formField.FormId = context.data.formName;
                      formField.Key =  context.data.fieldName;
          
                      const httpOptions = {
                        headers: new HttpHeaders({ 'Content-Type': 'application/json' })
                      };
                      fetch(Get_Form_Field_Values, {
                          method: 'POST',
                          headers: {
                            'Content-Type': 'application/json',
                            'authorization':'Bearer '+token
                          },
                          body: JSON.stringify(formField),
                        })
                        .then((response) => response.json())
                        .then((data) => {
                          for(let i=0; i<data.data.length;i++) {
                            selectData.push({label:data.data[i], value: data.data[i]});
                          }
                          
                          switch(context.data.displayAs) {
                            case 'radio':  context.data.values = selectData; 
                                            break;
                            case 'checkbox' : context.data.values = selectData; 
                                              break;
                            case 'dropdown_single_select' : context.data.data.values = selectData; 
                                              break;
                            case 'dropdown_multi_select': context.data.data.values = selectData; 
                                              break;
                          }
                                                      
                        })
                        .catch((error) => {
                          console.error('Error:', error);
                        });
                  }
                },
                {
                  type: 'select',
                  input: true,
                  multiple: true,
                  key: 'relatedfield',
                  label: 'Select Related Fields',
                  weight: 80,
                  tooltip: 'The selected field list will display in the form.',                          
                  conditional: {
                      json: {
                          and: [
                              {
                                  in: [
                                      { var: 'data.displayAs' },
                                      [
                                      'dropdown_single_select',
                                      'radio',
                                      ],
                                  ]
                              },
                              { '===': [{ var: 'data.importDataType' }, 'form'] }
                          ]                
                      }
                  },
                  dataSrc: 'url',
                  lazyLoad: false,
                  data: {
                    url: this.formService.Get_Form_Fields+'{{row.formName}}',
                    headers: 
                        [
                            {key: 'Content-Type', value: 'application/json'},
                            {key: 'Authorization', value: 'Bearer '+this.currentUser}
                        ]
                  },
                  valueProperty: 'key',
                  template: '<span>{{ item.label }}</span>',
                  selectValues: 'data',
                  refreshOn: 'formName',
                  onChange(context) {
                    context.data.relatedFieldsData1 = [];
                    context.data.relatedFieldsfinalData = [];
                    context.data.relatedfield.forEach(element => {
                        const index = context.self.defaultDownloadedResources.findIndex(i => i.key === element);
                        
                        //add related fields into data array
                        context.data.relatedFieldsData1.push({
                          FormName: context.data.selectedFormName,
                          KeyName:element,
                          label:context.self.defaultDownloadedResources[index].label
                        });                             
                    });
                    //combine two related fields array
                    context.data.relatedFieldsfinalData = context.data.relatedFieldsData1.concat(context.data.relatedFieldsData2);
                  }
                },
                {
                  type: 'select',
                  input: true,
                  multiple: true,
                  key: 'relatedForm',
                  label: 'Select Related Forms',
                  weight: 100,
                  tooltip: 'This is the list of related forms which have the above selected field.',                          
                  conditional: {
                      json: {
                          and: [
                              {
                                  in: [
                                      { var: 'data.displayAs' },
                                      [
                                      'dropdown_single_select',
                                      'radio',
                                      ],
                                  ]
                              },
                              { '===': [{ var: 'data.importDataType' }, 'form'] }
                          ]                
                      }
                  },
                  dataSrc: 'url',
                  lazyLoad: false,
                  data: {
                    url: this.formService.Get_related_Forms+'?FormId={{row.formName}}&KeyName={{row.fieldName}}',
                    headers: 
                        [
                            {key: 'Content-Type', value: 'application/json'},
                            {key: 'Authorization', value: 'Bearer '+this.currentUser}
                        ]
                  },
                  valueProperty: 'id',
                  template: '<span>{{ item.formName }}</span>',
                  selectValues: 'data',
                  refreshOn: 'fieldName',
                  // onChange(context) {  
                  //   context.data.selectedRelatedFormNames = [];
                  //   context.data.relatedForm.forEach(element => {  
                  //     context.self.defaultDownloadedResources.findIndex(function(item, index) {                              
                  //       if(item.id == element) {
                  //           context.data.selectedRelatedFormNames.push(item.formName);
                  //           return;
                  //       }                                  
                  //     });
                  //   });
                  // }
                },
                {
                  type: 'select',
                  input: true,
                  multiple: true,
                  key: 'relatedFormsFields',
                  label: 'Select Related Forms Fields',
                  weight: 120,
                  tooltip: 'We can also display related forms fields with primary form fields by selecting from here.',                          
                  conditional: {
                      json: {
                          and: [
                              {
                                  in: [
                                      { var: 'data.displayAs' },
                                      [
                                      'dropdown_single_select',
                                      'radio',
                                      ],
                                  ]
                              },
                              { '===': [{ var: 'data.importDataType' }, 'form'] }
                          ]                
                      }
                  },
                  dataSrc: 'url',
                  lazyLoad: false,
                  data: {
                    url: this.formService.Get_Related_Form_Field+'?FormIds={{row.relatedForm}}',
                    headers: 
                        [
                            {key: 'Content-Type', value: 'application/json'},
                            {key: 'Authorization', value: 'Bearer '+this.currentUser}
                        ]
                  },
                  valueProperty: 'key',
                  template: '<span>{{ item.label }}</span>',
                  selectValues: 'data',
                  refreshOn: 'relatedForm',
                  onChange(context) {
                    context.data.relatedFieldsData2 = [];
                    context.data.relatedFieldsfinalData = [];
                    context.data.relatedFormsFields.forEach(element => {
                        const index = context.self.defaultDownloadedResources.findIndex(i => i.key === element);
                        if(index !== -1) {
                          context.data.relatedFieldsData2.push({
                            FormName:context.self.defaultDownloadedResources[index].formName,
                            KeyName:context.self.defaultDownloadedResources[index].key,
                            label:context.self.defaultDownloadedResources[index].label
                          });
                        }
                    });
                    context.data.relatedFieldsfinalData = context.data.relatedFieldsData1.concat(context.data.relatedFieldsData2);
                  }
                }
              ]
          }
        ],
        textfield: [
          {
            key: "data",
            ignore: false,
            components: this.setPermissionsAndDataSource(this.textDataSource, 'textfield')
          }
        ],
        currency: [
          {
            key: "data",
            ignore: false,
            components: this.selectPermission(this.textDataSource, 'currency')
          }
        ],
        table: [
          {
            key: "display",
            ignore: false,
            components: this.selectPermission(this.textDataSource, 'table')
          }
        ],
        well: [
          {
            key: "display",
            ignore: false,
            components: this.selectPermission(this.textDataSource, 'well')
          }
        ],
        textarea: [
          {
            key: "data",
            ignore: false,
            components: this.setPermissionsAndDataSource(this.textDataSource, 'textarea')
          }
        ],
        phonenumber: [
          {
            key: "data",
            ignore: false,
            components: this.selectPermission(this.numberDataSource, 'phonenumber')
          }
        ],
        number: [
          {
            key: "data",
            ignore: false,
            components: this.setPermissionsAndDataSource(this.numberDataSource, 'number')
          }
        ],
        password: [
          {
            key: "data",
            ignore: false,
            components: this.selectDataSourceField(this.textDataSource, 'password')
          }
        ],
        checkbox: [
          {
            key: "display",
            ignore: false,
            components: this.selectDataSourceField(this.textDataSource, 'checkbox')
          }
        ],
        radio: [
          {
            key: "display",
            ignore: false,
            components: this.selectDataSourceField(this.textDataSource, 'radio')
          }
        ],
        select: [
          {
            key: "data",
            ignore: false,
            components: this.setPermissionsAndDataSource(this.listDataSource, 'select')
          }
        ],
        selectboxes: [
          {
            key: "display",
            ignore: false,
            components: this.selectDataSourceField(this.textDataSource, 'selectboxes')
          }
        ],
        signature: [
          {
            key: "data",
            ignore: false,
            components: this.selectPermission(this.textDataSource, 'signature')
          }
        ],
        myfileuploads: [
          {
            key: "data",
            ignore: false,
            components: this.selectPermission(this.textDataSource, 'myfileuploads')
          }
        ],
        button: [
          {
            key: "display",
            ignore: false,
            components: this.selectPermission(this.textDataSource, 'button')
          } 
        ]

      }
    }

  }
  setPermissionsAndDataSource(dataValues, type) {
    let tooltip = 'The source to get the data. You can fetch from data source component.';
    if (type == 'checkbox' || type == 'radio') {
      tooltip = 'The source to get the data. If selected then data of selected data source component is assigned to label.';
    }

    return [
      {
        type: 'select',
        input: true,
        key: 'roleView',
        label: 'Select the roles to provide the view only permission to the user',
        weight: 0,
        searchEnabled: true,
        tooltip: 'Click on role name to select the role ',
        dataSrc: 'url',
        lazyLoad: false,
        data: {
          url: this.formService.Get_Role_Values,
          headers:
            [
              { key: 'Content-Type', value: 'application/json' },
              { key: 'Authorization', value: 'Bearer ' + this.currentUser }
            ]
        },
        valueProperty: 'roleId',
        template: "<span class=''>{{ item.roleName }}</span>",
        multiple: true,
        widget: 'choicesjs',
        selectValues: 'data',
        refreshOn: 'roleName',
        onChange(context) {
        }
      },
      {
        type: 'select',
        input: true,
        key: 'userView',
        label: 'Select the users to provide the view permission',
        weight: 0,
        tooltip: 'Click on name to select the user',
        dataSrc: 'url',
        data: {
          url: this.formService.Get_User_Values + '{{row.roleView}}',
          headers:
            [
              { key: 'Content-Type', value: 'application/json' },
              { key: 'Authorization', value: 'Bearer ' + this.currentUser }
            ]
        },
        valueProperty: 'id',
        template: '<span>{{ item.fullName }}</span>',
        refreshOn: 'roleView',
        multiple: true,
        clearOnRefresh: true,
        selectValues: 'data',
        onSetItems(component, form) {
          component.component.defaultValue = [];
          var ind = 0;
          if (component.data.roleView.length > 0) {
            form.data.forEach(element => {
              if (ind < form.data.length) {
                component.component.defaultValue.push(form.data[ind].id);
                ind++;
              }
            });
          }
        },
      },
      {
        type: 'select',
        input: true,
        key: 'roleEdit',
        label: 'Select the roles to provide the edit permission to the user',
        weight: 0,
        widget: "choicesjs",
        tableView: false,
        tooltip: 'Click on role name to select the role ',
        dataSrc: 'url',
        altInput: true,
        allowInput: true,
        data: {
          url: this.formService.Get_Role_Values,
          headers:
            [
              { key: 'Content-Type', value: 'application/json' },
              { key: 'Authorization', value: 'Bearer ' + this.currentUser }
            ]
        },
        valueProperty: 'roleId',
        template: '<span>{{ item.roleName }}</span>',
        selectValues: 'data',
        multiple: true,
        onChange(context) {
          let token = '';
          const name = 'CurrentUser';
          const nameLenPlus = (name.length + 1);
        }
      },
      {
        type: 'select',
        input: true,
        key: 'userEdit',
        label: 'Select the users to provide the edit permission',
        weight: 0,
        tooltip: 'Click on  name to select the user ',
        lazyLoad: false,
        data: {
          url: this.formService.Get_User_Values + '{{row.roleEdit}}',
          headers:
            [
              { key: 'Content-Type', value: 'application/json' },
              { key: 'Authorization', value: 'Bearer ' + this.currentUser }
            ]
        },
        dataSrc: 'url',
        valueProperty: 'id',
        template: '<span>{{ item.fullName}}</span>',
        multiple: true,
        selectValues: 'data',
        clearOnRefresh: true,
        refreshOn: 'roleEdit',
        onSetItems(component, form) {
          component.component.defaultValue = [];
          var ind = 0;
          if (component.data.roleEdit.length > 0) {
            form.data.forEach(element => {
              if (ind < form.data.length) {
                component.component.defaultValue.push(form.data[ind].id);
                ind++;
              }
            });
          }
        },
      },
      {
        type: 'select',
        key: 'dataSource',
        label: 'Select Data Source Component',
        weight: 0,
        tooltip: tooltip,
        data: {
          values: dataValues,
        },
        dataSrc: "values",

        onChange(context) {
          context.data.defaultValue = '';
          if (context.data.dataSource !== '' && context.data.dataSource !== null) {
            context.utils.eachComponent(context.instance.options.editForm.components, function (component, path) {
              if (component.key == context.data.dataSource) {
                const dataSrc = component;
                if (context.data.type == 'checkbox' || context.data.type == 'radio' || context.data.type == 'selectboxes') {
                  context.data.label = dataSrc.value;
                } else if (context.data.type == 'select') {
                  context.data.data.url = dataSrc.fetch.url;
                  context.data.dataSrc = dataSrc.dataSrc;
                } else {
                  context.data.defaultValue = dataSrc.value;

                }
              }
            });
          }
        }
      }
    ];
  }

  selectPermission(dataValues, type) {

    return [
      {
        type: 'select',
        input: true,
        key: 'roleView',
        label: 'Select the roles to provide the view only permission to the user',
        weight: 0,
        searchEnabled: true,
        tooltip: 'Click on role name to select the role ',
        dataSrc: 'url',
        lazyLoad: false,
        data: {
          url: this.formService.Get_Role_Values,
          headers:
            [
              { key: 'Content-Type', value: 'application/json' },
              { key: 'Authorization', value: 'Bearer ' + this.currentUser }
            ]
        },
        valueProperty: 'roleId',
        template: "<span class=''>{{ item.roleName }}</span>",
        multiple: true,
        widget: 'choicesjs',
        selectValues: 'data',
        refreshOn: 'roleName',

        onChange(context) {
        }
      },
      {
        type: 'select',
        input: true,
        key: 'userView',
        label: 'Select the users to provide the view permission',
        weight: 0,
        tooltip: 'Click on name to select the user',
        dataSrc: 'url',
        data: {
          url: this.formService.Get_User_Values + '{{row.roleView}}',
          headers:
            [
              { key: 'Content-Type', value: 'application/json' },
              { key: 'Authorization', value: 'Bearer ' + this.currentUser }
            ]
        },
        valueProperty: 'id',
        template: '<span>{{ item.fullName }}</span>',
        refreshOn: 'roleView',
        multiple: true,
        clearOnRefresh: true,
        selectValues: 'data',
        onSetItems(component, form) {
          component.component.defaultValue = [];
          var ind = 0;
          if (component.data.roleView.length > 0) {
            form.data.forEach(element => {
              if (ind < form.data.length) {
                component.component.defaultValue.push(form.data[ind].id);
                ind++;
              }
            });
          }
        },
      },
      {
        type: 'select',
        input: true,
        key: 'roleEdit',
        label: 'Select the roles to provide the edit permission to the user',
        weight: 0,
        widget: "choicesjs",
        tableView: false,
        tooltip: 'Click on role name to select the role ',
        dataSrc: 'url',
        altInput: true,
        allowInput: true,
        data: {
          url: this.formService.Get_Role_Values,
          headers:
            [
              { key: 'Content-Type', value: 'application/json' },
              { key: 'Authorization', value: 'Bearer ' + this.currentUser }
            ]
        },
        valueProperty: 'roleId',
        template: '<span>{{ item.roleName }}</span>',
        selectValues: 'data',
        multiple: true,
        onChange(context) {
          let token = '';
          const name = 'CurrentUser';
          const nameLenPlus = (name.length + 1);
        }
      },
      {
        type: 'select',
        input: true,
        key: 'userEdit',
        label: 'Select the users to provide the edit permission',
        weight: 0,
        tooltip: 'Click on  name to select the user ',
        lazyLoad: false,
        data: {
          url: this.formService.Get_User_Values + '{{row.roleEdit}}',
          headers:
            [
              { key: 'Content-Type', value: 'application/json' },
              { key: 'Authorization', value: 'Bearer ' + this.currentUser }
            ]
        },
        dataSrc: 'url',
        valueProperty: 'id',
        template: '<span>{{ item.fullName}}</span>',
        multiple: true,
        selectValues: 'data',
        clearOnRefresh: true,
        refreshOn: 'roleEdit',
        onSetItems(component, form) {
          component.component.defaultValue = [];
          var ind = 0;
          if (component.data.roleEdit.length > 0) {
            form.data.forEach(element => {
              if (ind < form.data.length) {
                component.component.defaultValue.push(form.data[ind].id);
                ind++;
              }
            });
          }
        },
      },

    ];
  }
  selectDataSourceField(dataValues, type) {
    let tooltip = 'The source to get the data. You can fetch from data source component.';
    if (type == 'checkbox' || type == 'radio') {
      tooltip = 'The source to get the data. If selected then data of selected data source component is assigned to label.';
    }
    return [
      {
        type: 'select',
        input: true,
        key: 'dataSource',
        label: 'Select Data Source Component',
        weight: 0,
        tooltip: tooltip,
        data: {
          values: dataValues,
        },
        dataSrc: "values",
        onChange(context) {
          context.data.defaultValue = '';
          if (context.data.dataSource !== '' && context.data.dataSource !== null) {
            context.utils.eachComponent(context.instance.options.editForm.components, function (component, path) {
              if (component.key == context.data.dataSource) {
                const dataSrc = component;
                if (context.data.type == 'checkbox' || context.data.type == 'radio' || context.data.type == 'selectboxes') {
                  context.data.label = dataSrc.value;
                } else if (context.data.type == 'select') {
                  context.data.data.url = dataSrc.fetch.url;
                  context.data.dataSrc = dataSrc.dataSrc;
                } else {
                  context.data.defaultValue = dataSrc.value;

                }
              }
            });
          }
        }
      }
    ];
  }
  getDataSourceComponent(event) {
    const eventData = event;
    const currentComponent = event.component;
    switch (eventData.type) {
      case 'addComponent':
        this.SetDataSrcAccordingToType(currentComponent);
        break;
      case 'saveComponent':
        switch (typeof (event.originalComponent.value)) {
          case 'string': const index = this.textDataSource.findIndex(element => {
            if (element.value === currentComponent.key) {
              return true;
            }
          });
            this.textDataSource.splice(index);

          case 'number': const index1 = this.numberDataSource.findIndex(element => {
            if (element.value === currentComponent.key) {
              return true;
            }
          });
            this.numberDataSource.splice(index1);
            break;
          case 'object': const index2 = this.listDataSource.findIndex(element => {
            if (element.value === currentComponent.key) {
              return true;
            }
          });
            this.listDataSource.splice(index2);
            break;
        }
        this.SetDataSrcAccordingToType(currentComponent);
        break;
      case 'deleteComponent':
        if (typeof (currentComponent.value) == 'string') {
          console.log(currentComponent);
          let index = this.textDataSource.findIndex(element => {
            if (element.value === currentComponent.key) {
              return true;
            }
          });
          this.textDataSource.splice(index);
        }
        if (typeof (currentComponent.value) == 'number') {
          let index = this.numberDataSource.findIndex(element => {
            if (element.value === currentComponent.key) {
              return true;
            }
          });
          this.numberDataSource.splice(index);
        }
        if (typeof (currentComponent.value) == 'object') {
          let index = this.listDataSource.findIndex(element => {
            if (element.value === currentComponent.key) {
              return true;
            }
          });
          this.listDataSource.splice(index, 1);
        }

    }

    return eventData;
  }

  SetDataSrcAccordingToType(component) {

    setTimeout(() => {
      console.log(component.value);
      console.log(typeof (component.value));
      if (typeof (component.value) == 'string') {
        this.textDataSource.push({ label: component.label, value: component.key });
      }
      if (typeof (component.value) == 'number') {
        this.numberDataSource.push({ label: component.label, value: component.key });
      }
      if (typeof (component.value) == 'object') {
        this.listDataSource.push({ label: component.label, value: component.key });
      }
    }, 400);
  }

  setDataSourceComponentInEdit(formComponents) {
    const components = formComponents.components;
    components.forEach(element => {
      if (element.type == 'datasource') {
        if (typeof (element.value) == 'string') {
          this.textDataSource.push({ label: element.label, value: element.key });
        }
        if (typeof (element.value) == 'number') {
          this.numberDataSource.push({ label: element.label, value: element.key });
        }
        if (typeof (element.value) == 'object') {
          this.listDataSource.push({ label: element.label, value: element.key });
        }
      }
    });
  }

  // getFormFieldValues(event) {
  //   console.log(event);
  //   if(event.component.formName !== '' && event.component.fieldName!== '') {
  //       const formField = new FormFieldValue();
  //       // formField.FormName = 'total sales';
  //       // formField.Key = 'branch';
  //       //formField.FormName = event.component.formName;
  //       formField.FormId = event.component.formName;
  //       formField.Key =  event.component.fieldName;

  //     this.formService
  //       .GetFormFieldValues(formField)
  //       .subscribe((response: any) => {
  //         console.log(response);
  //         if (response.success == true) {
  //           const selectData = [];
  //           response.data.forEach(element => {
  //               selectData.push({label:element, value: element});
  //           });
  //           console.log(selectData);
  //           event.component.values = selectData;
  //           //event.component.values = selectData;
  //           //event.form.components[event.index].values = selectData;
  //           console.log(event.component);
  //           //this.getFormRelatedFieldValues(event);              
  //         }
  //         if (response.success == false) {

  //         }
  //       });
  //     }
  // }

  getFormRelatedFieldValues(event) {
    console.log(event);
    // if(event.component.formName !== '' && event.component.fieldName!== '') {
    const formRelatedField = new FormRelatedFieldValue();
    // formRelatedField.FormName = event.component.selectedFormName;
    // formRelatedField.KeyName =  event.component.fieldName;

    formRelatedField.FormName = 'Total sales';
    formRelatedField.KeyName = 'qtySalesMt';
    formRelatedField.KeyValue = '100';
    formRelatedField.FieldNames = ["branch", "vessel", "dateTime2", "qtySalesMt", "salesInr", "finishedProduct"]
      ;

    this.formService
      .GetFormRelatedFieldValues(formRelatedField)
      .subscribe((response: any) => {
        console.log(response);
        if (response.success == true) {

        }
        if (response.success == false) {

        }
      });
    // }
  }

}