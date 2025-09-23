import { Injectable, Type } from "@angular/core";
import { FormService } from '../services/formService';
import { CookieService } from 'ngx-cookie-service';
import { LocalStorageProperties } from "../globaldependencies/constants/localstorage-properties";
import { FormFieldValue } from '../models/formFieldValue';
import { FormRelatedFieldValue } from '../models/formRelatedFieldValues';
const APIEndpoint = document.location.hostname == 'localhost' ? 'http://localhost:55228/' : document.location.origin + '/backend/';
const Get_Form_Field_Values = APIEndpoint + 'GenericForm/GenericFormApi/GetFormFieldValues';
const Get_User_Valu_ByRole = APIEndpoint + 'GenericForm/GenericFormApi/GetUsersBasedonRole?roles=';
import { HttpHeaders } from '@angular/common/http';
import * as moment from 'moment';
import * as formUtils from 'formiojs/utils/formUtils.js';
var userCompanyIds = JSON.parse(localStorage.getItem("UserModel"))?.companiesList?.map(x => x?.companyId).toString();
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
    this.options = {
      builder: {
        advanced: {
          components: {
            file: false,
            mydatetime: true,
            mylinkdatetime: true
          }
        },
        premium: false,
        custom: {
          title: 'Custom',
          weight: 200,
          components: {
            datasource: true,
            mylookup: true,
            fieldconcatenation: true,
            myrq: true
          }
        },
      },
      editForm: {
        mylinkdatetime: [
          {
            key: 'data',
            ignore: false,
            components: this.selectPermissionFormyLinkDateTime(this.textDataSource, 'mylinkdatetime')
          }, {
            key: "logic",
            ignore: false,
            components: this.setElseLogic(),
          }
        ],
        fieldconcatenation: [
          {
            key: "data",
            ignore: false,
            components: this.selectPermission(this.textDataSource, 'fieldconcatenation')
          },
          {
            key: 'display',
            // {"label":"Text Field","tableView":true,"key":"textField","type":"textfield","input":true}
            components: [
              {
                type: 'textfield',
                input: true,
                key: 'concatSplitKey',
                label: 'Enter Key for split',
                tooltip: 'The entered key is used for splitting selected fields',
                tableView: true,
              },
              {
                type: 'select',
                multiple: true,
                input: true,
                label: 'Select form fields to concatenate: ',
                key: 'concateFormFields',
                dataSrc: 'custom',
                valueProperty: 'value',
                refreshOn: 'data',
                data: {
                  custom(context) {
                    const values = [];

                    context.utils.eachComponent(context.instance.options.editForm.components, (component, path) => {
                      if (component.key != context.data.key) {
                        ;
                        values.push({
                          label: `${component.label || component.key} (${path})`,
                          //value: {key: component.key, path: path, type: component.type, format: component?.widget?.format, delimiter: component?.delimiter, decimalLimit: component?.decimalLimit},
                          value: path
                        });
                      }
                    });
                    console.log('values', values);
                    return values;
                  }
                },
                onChange(context) {
                  console.log('onchange', context);
                  if (context.data.concateFormFields && context.data.concateFormFields.length > 0) {
                    var str = "value = ";
                    context.data.concateFormFields.forEach((el, i) => {
                      // console.log('in custom fc el', el);
                      // var comps = formUtils.searchComponents(context.instance.options.editForm.components, {key: el});
                      var field = context.instance.options.editForm.components.find(x => x.key == el);
                      var isDateTime = (field.type == "datetime" || field.type == "mydatetime" || field.type == "mylinkdatetime") ? true : false;
                      if (isDateTime) {
                        // var format;
                        // format = field.format ? field.format : field.widget.format;
                        if (i == 0) {
                          str += `((data.${el} === null || data.${el} === undefined || data.${el} == "") ? "" : moment(data.${el}).format("DD-MMM-YYYY"))`;
                        }
                        else if (i == context.data.concateFormFields.length - 1) {
                          str += `+ ((data.${el} === null || data.${el} === undefined || data.${el} == "") ? "" : "${context.data.concatSplitKey}" + moment(data.${el}).format("DD-MMM-YYYY"));`;
                        } else {
                          str += `+ ((data.${el} === null || data.${el} === undefined || data.${el} == "") ? "" : "${context.data.concatSplitKey}" + moment(data.${el}).format("DD-MMM-YYYY"))`;
                        }
                      } else {
                        if (i == 0) {
                          str += `((data.${el} === null || data.${el} === undefined || data.${el} == "") ? "" : data.${el})`;
                        }
                        else if (i == context.data.concateFormFields.length - 1) {
                          str += `+ ((data.${el} === null || data.${el} === undefined || data.${el} == "") ? "" : "${context.data.concatSplitKey}" + data.${el});`;
                        } else {
                          str += `+ ((data.${el} === null || data.${el} === undefined || data.${el} == "") ? "" : "${context.data.concatSplitKey}" + data.${el})`;
                        }
                      }
                    });
                    context.data.calculateValue = '';
                    // context.data.customDefaultValue = '';
                    context.data.calculateValue = str;
                    // context.data.customDefaultValue = str;
                    console.log(str)
                  }
                },
                onSetItems(component, form) {
                  // console.log('onSetItems component', component);
                  // console.log('onSetItems form', form);
                },
              }
            ]
          }, {
            key: "logic",
            ignore: false,
            components: this.setElseLogic(),
          }
        ],
        mylookup: [
          {
            key: 'form',
            components: this.selectPermissionForMyLookUpAndForm(this.textDataSource, 'mylookup')
          }, {
            key: "logic",
            ignore: false,
            components: this.setElseLogic(),
          }
        ],
        myrq: [
          {
            key: 'form',
            components: this.selectPermissionforRQAndFormFields(this.textDataSource, 'myrq')
          },
          {
            key: "display",
            ignore: false,
            components: this.selectDataSourceField(this.textDataSource, 'myrq')
          }, {
            key: "logic",
            ignore: false,
            components: this.setElseLogic(),
          }
        ],
        textfield: [
          {
            key: "data",
            ignore: false,
            components: this.setPermissionsAndDataSource(this.textDataSource, 'textfield')
          }, {
            key: "logic",
            ignore: false,
            components: this.setElseLogic(),
          }
        ],
        datetime: [
          {
            key: "data",
            ignore: false,
            components: this.selectPermission(this.textDataSource, 'datetime')
          }, {
            key: "logic",
            ignore: false,
            components: this.setElseLogic(),
          }
        ],
        day: [
          {
            key: "data",
            ignore: false,
            components: this.selectPermission(this.textDataSource, 'day')
          }, {
            key: "logic",
            ignore: false,
            components: this.setElseLogic(),
          }
        ],
        time: [
          {
            key: "data",
            ignore: false,
            components: this.selectPermission(this.textDataSource, 'time')
          }, {
            key: "logic",
            ignore: false,
            components: this.setElseLogic(),
          }
        ],
        currency: [
          {
            key: "data",
            ignore: false,
            components: this.selectPermission(this.textDataSource, 'currency')
          }, {
            key: "logic",
            ignore: false,
            components: this.setElseLogic(),
          }
        ],
        htmlelement: [
          {
            key: "display",
            ignore: false,
            components: this.selectPermission(this.textDataSource, 'htmlelement')
          }
        ],
        content: [
          {
            key: "display",
            ignore: false,
            components: this.selectPermission(this.textDataSource, 'content')
          }
        ],
        columns: [
          {
            key: "display",
            ignore: false,
            components: this.selectPermission(this.textDataSource, 'columns')
          }
        ],
        fieldset: [
          {
            key: "display",
            ignore: false,
            components: this.selectPermission(this.textDataSource, 'fieldset')
          }
        ],
        panel: [
          {
            key: "display",
            ignore: false,
            components: this.selectPermission(this.textDataSource, 'panel')
          }
        ],
        table: [
          {
            key: "display",
            ignore: false,
            components: this.selectPermission(this.textDataSource, 'table')
          }, {
            key: "logic",
            ignore: false,
            components: this.setElseLogic(),
          }
        ],
        tabs: [
          {
            key: "display",
            ignore: false,
            components: this.selectPermission(this.textDataSource, 'tabs')
          }
        ],
        well: [
          {
            key: "display",
            ignore: false,
            components: this.selectPermission(this.textDataSource, 'well')
          }, {
            key: "logic",
            ignore: false,
            components: this.setElseLogic(),
          }
        ],
        container: [
          {
            key: "display",
            ignore: false,
            components: this.selectPermission(this.textDataSource, 'container')
          }
        ],
        datamap: [
          {
            key: "display",
            ignore: false,
            components: this.selectPermission(this.textDataSource, 'datamap')
          }
        ],
        datagrid: [
          {
            key: "display",
            ignore: false,
            components: this.selectPermission(this.textDataSource, 'datagrid')
          }, {
            key: "logic",
            ignore: false,
            components: this.setElseLogic(),
          }
        ],
        editgrid: [
          {
            key: "display",
            ignore: false,
            components: this.selectPermission(this.textDataSource, 'editgrid')
          }
        ],
        tree: [
          {
            key: "display",
            ignore: false,
            components: this.selectPermission(this.textDataSource, 'tree')
          }
        ],
        textarea: [
          {
            key: "data",
            ignore: false,
            components: this.setPermissionsAndDataSource(this.textDataSource, 'textarea')
          }, {
            key: "logic",
            ignore: false,
            components: this.setElseLogic(),
          }
        ],
        phoneNumber: [
          {
            key: "data",
            ignore: false,
            components: this.selectPermission(this.textDataSource, 'phoneNumber')
          }, {
            key: "logic",
            ignore: false,
            components: this.setElseLogic(),
          }
        ],
        number: [
          {
            key: "data",
            ignore: false,
            components: this.setPermissionsAndDataSource(this.numberDataSource, 'number')
          }, {
            key: "logic",
            ignore: false,
            components: this.setElseLogic(),
          }
        ],
        password: [
          {
            key: "data",
            ignore: false,
            components: this.selectPermission(this.textDataSource, 'password')
          }, {
            key: "logic",
            ignore: false,
            components: this.setElseLogic(),
          }
        ],
        email: [
          {
            key: "data",
            ignore: false,
            components: this.selectPermission(this.textDataSource, 'email')
          }, {
            key: "logic",
            ignore: false,
            components: this.setElseLogic(),
          }
        ],
        url: [
          {
            key: "data",
            ignore: false,
            components: this.selectPermission(this.textDataSource, 'url')
          }, {
            key: "logic",
            ignore: false,
            components: this.setElseLogic(),
          }
        ],
        tags: [
          {
            key: "data",
            ignore: false,
            components: this.selectPermission(this.textDataSource, 'tags')
          }, {
            key: "logic",
            ignore: false,
            components: this.setElseLogic(),
          }
        ],
        address: [
          {
            key: "data",
            ignore: false,
            components: this.selectPermission(this.textDataSource, 'address')
          }, {
            key: "logic",
            ignore: false,
            components: this.setElseLogic(),
          }
        ],
        mydatetime: [
          {
            key: "data",
            ignore: false,
            components: this.selectPermission(this.textDataSource, 'mydatetime')
          }, {
            key: "logic",
            ignore: false,
            components: this.setElseLogic(),
          }
        ],
        survey: [
          {
            key: "data",
            ignore: false,
            components: this.selectPermission(this.textDataSource, 'survey')
          }, {
            key: "logic",
            ignore: false,
            components: this.setElseLogic(),
          }
        ],
        checkbox: [
          {
            key: "data",
            ignore: false,
            components: this.selectPermission(this.textDataSource, 'checkbox')
          },
          {
            key: "display",
            ignore: false,
            components: this.selectDataSourceField(this.textDataSource, 'checkbox')
          }, {
            key: "logic",
            ignore: false,
            components: this.setElseLogic(),
          }
        ],
        radio: [
          {
            key: "data",
            ignore: false,
            components: this.selectPermission(this.textDataSource, 'radio')
          },
          {
            key: "display",
            ignore: false,
            components: this.selectDataSourceField(this.textDataSource, 'radio')
          }, {
            key: "logic",
            ignore: false,
            components: this.setElseLogic(),
          }
        ],
        select: [
          {
            key: "data",
            ignore: false,
            components: this.setPermissionsAndDataSource(this.listDataSource, 'select')
          }, {
            key: "logic",
            ignore: false,
            components: this.setElseLogic(),
          }
        ],
        myCustomSelect: [
          {
            key: "data",
            ignore: false,
            components: this.setPermissionsAndDataSourceforMyCustomSelect(this.listDataSource, 'myCustomSelect')
          }, {
            key: "logic",
            ignore: false,
            components: this.setElseLogic(),
          }
        ],
        selectboxes: [
          {
            key: "data",
            ignore: false,
            components: this.selectPermission(this.textDataSource, 'selectboxes')
          },
          {
            key: "display",
            ignore: false,
            components: this.selectDataSourceField(this.textDataSource, 'selectboxes')
          }, {
            key: "logic",
            ignore: false,
            components: this.setElseLogic(),
          }
        ],
        signature: [
          {
            key: "data",
            ignore: false,
            components: this.selectPermission(this.textDataSource, 'signature')
          }, {
            key: "logic",
            ignore: false,
            components: this.setElseLogic(),
          }
        ],
        myfileuploads: [
          {
            key: "data",
            ignore: false,
            components: this.selectPermission(this.textDataSource, 'myfileuploads')
          }, {
            key: "logic",
            ignore: false,
            components: this.setElseLogic(),
          }
        ],
        livesimageupload: [
          {
            key: "data",
            ignore: false,
            components: this.selectPermission(this.textDataSource, 'livesimageupload')
          }, {
            key: "logic",
            ignore: false,
            components: this.setElseLogic(),
          }
        ],
        button: [
          {
            key: "display",
            ignore: false,
            components: this.selectPermission(this.textDataSource, 'button')
          }, {
            key: "logic",
            ignore: false,
            components: this.setElseLogic(),
          }
        ]

      }
    }
    console.log(this.currentUser);
    console.log(this.options);
    return this.options;
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
      },
      {
        type: 'select',
        input: true,
        key: 'upsertDataConfig',
        label: 'Upsert API Name',
        weight: 20,
        tooltip: 'The apis list from that we fetch data.',
        dataSrc: 'url',
        lazyLoad: false,
        refreshOn: 'customAppName',
        redrawOn: "data",
        data: {
          url: this.formService.Get_UpsertApi_Config,
          headers:
            [
              { key: 'Content-Type', value: 'application/json' },
              { key: 'Authorization', value: 'Bearer ' + this.currentUser }
            ]
        },
        valueProperty: 'id',
        template: '<span>{{ item.apiName }}</span>',
        selectValues: 'data',
        conditional: {
          json: { '===': [{ var: 'data.dataSrc' }, 'url'] },
        },
        onChange(context) {
          context.self.defaultDownloadedResources.findIndex(function (item, index) {
            if (item.formId == context.data.formName) {
              context.data['selectedUpsertDataConfig'] = item;
              return;
            }
          });
        }
      },
    ];
  }
  setPermissionsAndDataSourceforMyCustomSelect(dataValues, type) {
    let tooltip = 'The source to get the data. You can fetch from data source component.';
    if (type == 'checkbox' || type == 'radio') {
      tooltip = 'The source to get the data. If selected then data of selected data source component is assigned to label.';
    }

    return [
      {
        type: 'select',
        input: true,
        key: 'companyName',
        label: 'Company Name',
        weight: 0,
        tooltip: 'The company list from that we fetch data.',
        dataSrc: 'url',
        lazyLoad: false,
        refreshOn: 'data',
        redrawOn: "data",
        data: {
          url: this.formService.Get_Company_List,
          headers:
            [
              { key: 'Content-Type', value: 'application/json' },
              { key: 'Authorization', value: 'Bearer ' + this.currentUser }
            ]
        },
        valueProperty: 'companyId',
        template: '<span>{{ item.companyName }}</span>',
        selectValues: 'data',
        conditional: {
          json: { '===': [{ var: 'data.dataSrc' }, 'custom'] },
        },
        onChange(context) {
          context.self.defaultDownloadedResources.findIndex(function (item, index) {
            if (item.companyName == context.data.companyId) {
              context.data['companyId'] = item.companyId;
              return;
            }
          });
        }
      },
      {
        type: 'select',
        input: true,
        key: 'customAppName',
        label: 'Custom Application Name',
        weight: 0,
        tooltip: 'The custom app list from that we fetch data.',
        dataSrc: 'url',
        lazyLoad: true,
        refreshOn: 'companyName',
        data: {
          url: this.formService.Get_Custom_Application+'?CustomApplicationId='+'null&CompanyId='+"{{row.companyName}}",
          headers:
            [
              { key: 'Content-Type', value: 'application/json' },
              { key: 'Authorization', value: 'Bearer ' + this.currentUser }
            ]
        },
        valueProperty: 'customApplicationId',
        template: '<span>{{ item.formName}} ({{item.customApplicationName}})</span>',
        selectValues: 'data',
        conditional: {
          json: { '===': [{ var: 'data.dataSrc' }, 'custom'] },
        },
        onChange(context) {
          context.self.defaultDownloadedResources.findIndex(function (item, index) {
            if (item.customApplicationId == context.data.customAppName) {
              context.data.selectedCustomApplicationName = item.customApplicationName;
              context.data['selectedCustomApplicationId'] = item.customApplicationId;
              context.data['formName'] = item.formId;
              context.data.selectedFormName = item.formName;
              context.data['selectedFormId'] = item.formId;
              context.data['selectedForm'] = item;
              return;
            }
          });
        }
      },
      {
        type: 'select',
        input: true,
        multiple: false,
        key: 'fieldName',
        label: 'Field Name',
        weight: 0,
        tooltip: 'The selected field list will display in the form.',
        dataSrc: 'url',
        lazyLoad: true,
        data: {
          url: this.formService.Get_Form_Fields + '{{row.formName}}' + `&companyIds=`+`{{row.companyName.toString()}}`,
          headers:
            [
              { key: 'Content-Type', value: 'application/json' },
              { key: 'Authorization', value: 'Bearer ' + this.currentUser }
            ]
        },
        valueProperty: 'path',
        template: '<span>{{ item.label }} ({{ item.path }})</span>',
        selectValues: 'data',
        refreshOn: 'customAppName',
        conditional: {
          json: { '===': [{ var: 'data.dataSrc' }, 'custom'] },
        },
        onChange(context) {
          context.self.defaultDownloadedResources.findIndex(function (item, index) {
            if (item.id == context.data.fieldName) {
              context.data.selectedFieldLabel = item.label;
              context.data['selectedFieldKey'] = item.key;
              return;
            }
          });
        }
      },
      {
        label: "Is Add Option Required",
        tableView: false,
        key: "isAddOptionRequired",
        emptyOrNull: false,
        elseLogic: false,
        type: "checkbox",
        input: true,
        index: 0,
        defaultValue: false,
        onChange(context) {
        }
      }, {
        label: "Is Multi Select Option Required",
        tableView: false,
        key: "isMultiSelectOptionRequired",
        emptyOrNull: false,
        elseLogic: false,
        type: "checkbox",
        input: true,
        index: 0,
        defaultValue: false,
        onChange(context) {
        }
      },
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
      },
      {
        type: 'select',
        input: true,
        key: 'upsertDataConfig',
        label: 'Upsert API Name',
        weight: 20,
        tooltip: 'The apis list from that we fetch data.',
        dataSrc: 'url',
        lazyLoad: false,
        refreshOn: 'customAppName',
        redrawOn: "data",
        data: {
          url: this.formService.Get_UpsertApi_Config,
          headers:
            [
              { key: 'Content-Type', value: 'application/json' },
              { key: 'Authorization', value: 'Bearer ' + this.currentUser }
            ]
        },
        valueProperty: 'id',
        template: '<span>{{ item.apiName }}</span>',
        selectValues: 'data',
        conditional: {
          json: { '===': [{ var: 'data.dataSrc' }, 'url'] },
        },
        onChange(context) {
          context.self.defaultDownloadedResources.findIndex(function (item, index) {
            if (item.formId == context.data.formName) {
              context.data['selectedUpsertDataConfig'] = item;
              return;
            }
          });
        }
      },
    ];
  }

  selectPermissionForMyLookUpAndForm(dataValues, type) {

    return [
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
          url: this.formService.Get_Forms_List + `?companyIds=${userCompanyIds}`,
          headers:
            [
              { key: 'Content-Type', value: 'application/json' },
              { key: 'Authorization', value: 'Bearer ' + this.currentUser }
            ]
        },
        valueProperty: 'id',
        template: '<span>{{ item.formName }}</span>',
        selectValues: 'data',
        conditional: {
          json: { '===': [{ var: 'data.importDataType' }, 'form'] },
        },
        onChange(context) {
          context.self.defaultDownloadedResources.findIndex(function (item, index) {
            if (item.id == context.data.formName) {
              context.data.selectedFormName = item.formName;
              context.data['selectedFormId'] = item.id;
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
          url: this.formService.Get_Form_Fields + '{{row.formName}}' + `&companyIds=${userCompanyIds}`,
          headers:
            [
              { key: 'Content-Type', value: 'application/json' },
              { key: 'Authorization', value: 'Bearer ' + this.currentUser }
            ]
        },
        valueProperty: 'path',
        template: '<span>{{ item.label }} ({{item.path}})</span>',
        selectValues: 'data',
        refreshOn: 'formName',
        onChange(context) {
          // let token = '';
          // const name = 'CurrentUser';
          // const nameLenPlus = (name.length + 1);
          // token = document.cookie
          //   .split(';')
          //   .map(c => c.trim())
          //   .filter(cookie => {
          //     return cookie.substring(0, nameLenPlus) === `${name}=`;
          //   })
          //   .map(cookie => {
          //     return decodeURIComponent(cookie.substring(nameLenPlus));
          //   })[0] || null;

          // let selectData = [];
          // const formField = new FormFieldValue();
          // formField.FormId = context.data.formName;
          // formField.Key = context.data.fieldName;

          // const httpOptions = {
          //   headers: new HttpHeaders({ 'Content-Type': 'application/json' })
          // };
          // fetch(Get_Form_Field_Values, {
          //   method: 'POST',
          //   headers: {
          //     'Content-Type': 'application/json',
          //     'authorization': 'Bearer ' + token
          //   },
          //   body: JSON.stringify(formField),
          // })
          //   .then((response) => response.json())
          //   .then((data) => {
          //     for (let i = 0; i < data.data.length; i++) {
          //       selectData.push({ label: data.data[i], value: data.data[i] });
          //     }

          //   })
          //   .catch((error) => {
          //     console.error('Error:', error);
          //   });
        }
      },
      {
        type: 'number',
        input: true,
        key: 'valueSelectionLimit',
        label: 'Enter Limit',
        weight: 80,
        tooltip: 'The entered limit values are fetched and displyed on form.',
        mask: false,
        tableView: false,
        delimiter: false,
        requireDecimal: false,
        inputFormat: 'plain',
        conditional: {
          json: {
            and: [
              { '===': [{ var: 'data.valueSelection' }, 'more'] },
              { '===': [{ var: 'data.importDataType' }, 'form'] }
            ]
          }
        },
        validate: {
          required: true
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
          url: this.formService.Get_Form_Fields + '{{row.formName}}' + `&companyIds=${userCompanyIds}`,
          headers:
            [
              { key: 'Content-Type', value: 'application/json' },
              { key: 'Authorization', value: 'Bearer ' + this.currentUser }
            ]
        },
        valueProperty: 'path',
        template: '<span>{{ item.label }} ({{ item.path }})</span>',
        selectValues: 'data',
        refreshOn: 'formName',
        onChange(context) {
          context.data.relatedFieldsLabel = [];
          context.data.relatedFieldsData1 = [];
          console.log('in on change of rf');
          context.data.relatedfield.forEach(element => {
            console.log('in on change of rf rf', context.data.relatedfield);
            console.log('in on change of self rf', context.self.defaultDownloadedResources);
            const index = context.self.defaultDownloadedResources.findIndex(i => i.path === element);
            if (index !== -1) {
              context.data.relatedFieldsLabel.push(context.self.defaultDownloadedResources[index].label);
            }
            context.data.relatedFieldsData1.push({
              FormName: context.data.selectedFormName,
              KeyName: context.self.defaultDownloadedResources[index].key,
              label: context.self.defaultDownloadedResources[index].label,
              path: context.self.defaultDownloadedResources[index].path
            });
          });
          // context.data.relatedFieldsfinalData = context.data.relatedFieldsData1.concat(context.data.relatedFieldsData2);
          const lookupVlaue = context.data.relatedFieldsData1.concat(context.data.relatedFieldsData2 != undefined ? context.data.relatedFieldsData2 : []);

          const uniqueAddresses = Array.from(new Set(lookupVlaue.map(a => a.path))).map(path => { return lookupVlaue.find(a => a.path === path) })
          context.data.relatedFieldsfinalData = uniqueAddresses;
          console.log('context.data.relatedFieldsLabel', context.data.relatedFieldsLabel);
          console.log('context.data.relatedFormsFields', context.data.relatedFormsFields);
          console.log('context.data.relatedFormsFields', context.data.relatedFormsFields);
          console.log('context.data.relatedfield', context.data.relatedfield);
        }
      },
      // {
      //   type: 'select',
      //   input: true,
      //   multiple: true,
      //   key: 'relatedForm',
      //   label: 'Select Related Forms',
      //   weight: 100,
      //   tooltip: 'This is the list of related forms which have the above selected field.',
      //   conditional: {
      //     json: {
      //       and: [
      //         {
      //           in: [
      //             { var: 'data.displayAs' },
      //             [
      //               'dropdown_single_select',
      //               'radio',
      //             ],
      //           ]
      //         },
      //         { '===': [{ var: 'data.importDataType' }, 'form'] }
      //       ]
      //     }
      //   },
      //   dataSrc: 'url',
      //   lazyLoad: false,
      //   data: {
      //     url: this.formService.Get_related_Forms + '?FormId={{row.formName}}&KeyName={{row.fieldName}}',
      //     headers:
      //       [
      //         { key: 'Content-Type', value: 'application/json' },
      //         { key: 'Authorization', value: 'Bearer ' + this.currentUser }
      //       ]
      //   },
      //   valueProperty: 'id',
      //   template: '<span>{{ item.formName }}</span>',
      //   selectValues: 'data',
      //   refreshOn: 'fieldName',
      //   onChange(context) {
      //     context.data.selectedRelatedFormNames = [];
      //     context.data.relatedForm.forEach(element => {
      //       context.self.defaultDownloadedResources.findIndex(function (item, index) {
      //         if (item.id == element) {
      //           //context.data.selectedFormName = item.formName;
      //           context.data.selectedRelatedFormNames.push(item.formName);
      //           return;
      //         }
      //       });
      //     });
      //     console.log(context.data.selectedRelatedFormNames);
      //   }
      // },
      // {
      //   type: 'select',
      //   input: true,
      //   multiple: true,
      //   key: 'relatedFormsFields',
      //   label: 'Select Related Forms Fields',
      //   weight: 120,
      //   tooltip: 'We can also display related forms fields with primary form fields by selecting from here.',
      //   conditional: {
      //     json: {
      //       and: [
      //         {
      //           in: [
      //             { var: 'data.displayAs' },
      //             [
      //               'dropdown_single_select',
      //               'radio',
      //             ],
      //           ]
      //         },
      //         { '===': [{ var: 'data.importDataType' }, 'form'] }
      //       ]
      //     }
      //   },
      //   dataSrc: 'url',
      //   lazyLoad: false,
      //   data: {
      //     url: this.formService.Get_Related_Form_Field + '?FormIds={{row.relatedForm}}',
      //     headers:
      //       [
      //         { key: 'Content-Type', value: 'application/json' },
      //         { key: 'Authorization', value: 'Bearer ' + this.currentUser }
      //       ]
      //   },
      //   valueProperty: 'key',
      //   template: '<span>{{ item.label }}</span>',
      //   selectValues: 'data',
      //   refreshOn: 'relatedForm',
      //   onChange(context) {
      //     context.data.relatedFormFieldsLabel = [];
      //     context.data.relatedFormsFields.forEach(element => {
      //       const index = context.self.defaultDownloadedResources.findIndex(i => i.key === element);
      //       //console.log(index);
      //       if (index !== -1) {
      //         context.data.relatedFormFieldsLabel.push({
      //           FormName: context.self.defaultDownloadedResources[index].formName,
      //           KeyName: context.self.defaultDownloadedResources[index].key,
      //           label: context.self.defaultDownloadedResources[index].label
      //         });
      //       }
      //     });
      //     context.data.relatedFieldsfinalData = context.data.relatedFieldsData1.concat(context.data.relatedFieldsData2);
      //   }
      // },
      {
        label: "Filter Fields Based On Form",
        tableView: false,
        key: "filterFieldsBasedOnForm",
        emptyOrNull: false,
        elseLogic: false,
        type: "checkbox",
        input: true,
        index: 0,
        defaultValue: false,
        onChange(context) {
        }
      },
      {
        type: 'textfield',
        input: true,
        key: 'filterFormName',
        label: 'Enter Filter FormName',
        customConditional: "show = !!data.filterFieldsBasedOnForm;",
        tooltip: 'The entered key is used for filtering form fields',
        tableView: true,
      },
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
  selectPermissionforRQAndFormFields(dataValues, type) {

    return [
              // {
              //   type: 'select',
              //   input: true,
              //   key: 'customAppName',
              //   label: 'Custom Application Name',
              //   weight: 20,
              //   tooltip: 'The custom app list from that we fetch data.',
              //   dataSrc: 'url',
              //   lazyLoad: false,
              //   data: {
              //     url: this.formService.Get_Custom_ApplicationForForms + '?id=' + 'null',
              //     headers:
              //       [
              //         { key: 'Content-Type', value: 'application/json' },
              //         { key: 'Authorization', value: 'Bearer ' + this.currentUser }
              //       ]
              //   },
              //   valueProperty: 'customApplicationId',
              //   template: '<span>{{ item.customApplicationName }}</span>',
              //   selectValues: 'data',
              //   onChange(context) {
              //     console.log('in customAppName on change', context);
              //     context.self.defaultDownloadedResources.findIndex(function (item, index) {
              //       if (item.customApplicationId == context.data.customAppName) {
              //         context.data.selectedCustomApplicationName = item.customApplicationName;
              //         context.data['selectedCustomApplicationId'] = item.customApplicationId;
              //         return;
              //       }
              //     });
              //   }
              // },
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
                  url: this.formService.Get_Forms_List + `?companyIds=${userCompanyIds}`,
                  headers:
                    [
                      { key: 'Content-Type', value: 'application/json' },
                      { key: 'Authorization', value: 'Bearer ' + this.currentUser }
                    ]
                },
                valueProperty: 'id',
                template: '<span>{{ item.formName }}</span>',
                selectValues: 'data',
                onChange(context) {
                  context.self.defaultDownloadedResources.findIndex(function (item, index) {
                    if (item.id == context.data.formName) {
                      context.data.selectedFormName = item.formName;
                      context.data['selectedFormId'] = item.id;
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
                dataSrc: 'url',
                lazyLoad: false,
                data: {
                  url: this.formService.Get_Form_Fields + '{{row.formName}}' + `&companyIds=${userCompanyIds}`,
                  headers:
                    [
                      { key: 'Content-Type', value: 'application/json' },
                      { key: 'Authorization', value: 'Bearer ' + this.currentUser }
                    ]
                },
                valueProperty: 'path',
                template: '<span>{{ item.label }} ({{item.path}})</span>',
                selectValues: 'data',
                refreshOn: 'formName',
                onChange(context) {
                }
              },
              {
                type: 'select',
                input: true,
                multiple: true,
                key: 'calculateFieldName',
                label: 'Calculate Field Name',
                weight: 30,
                tooltip: 'The field list of selected form. This selected field value will display in the form. By selecting a field we will fetch the other fields data.',
                dataSrc: 'url',
                lazyLoad: false,
                data: {
                  url: this.formService.Get_Form_Fields + '{{row.formName}}' + `&companyIds=${userCompanyIds}`,
                  headers:
                    [
                      { key: 'Content-Type', value: 'application/json' },
                      { key: 'Authorization', value: 'Bearer ' + this.currentUser }
                    ]
                },
                valueProperty: 'path',
                template: '<span>{{ item.label }} ({{ item.path }})</span>',
                selectValues: 'data',
                refreshOn: 'formName',
                onChange(context) {
                  context.data.relatedFieldsLabel = [];
                  context.data.relatedFieldsData1 = [];
                  context.data.calculateFieldName.forEach(element => {
                    const index = context.self.defaultDownloadedResources.findIndex(i => i.path === element);
                    if (index !== -1) {
                      context.data.relatedFieldsLabel.push(context.self.defaultDownloadedResources[index].label);
                    }
                    context.data.relatedFieldsData1.push({
                      FormName: context.data.selectedFormName,
                      KeyName: context.self.defaultDownloadedResources[index].key,
                      label: context.self.defaultDownloadedResources[index].label,
                      path: context.self.defaultDownloadedResources[index].path
                    });
                  });
                  // context.data.relatedFieldsfinalData = context.data.relatedFieldsData1.concat(context.data.relatedFieldsData2);
                  const lookupVlaue = context.data.relatedFieldsData1.concat(context.data.relatedFieldsData2 != undefined ? context.data.relatedFieldsData2 : []);

                  const uniqueAddresses = Array.from(new Set(lookupVlaue.map(a => a.path))).map(path => { return lookupVlaue.find(a => a.path === path) })
                  context.data.relatedFieldsfinalData = uniqueAddresses;
                }
              },
              {
                type: 'textfield',
                input: true,
                key: 'operator',
                label: 'Enter operator for operation',
                tooltip: 'The entered operator is used for operations',
                tableView: true,
              },
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
  selectPermissionFormyLinkDateTime(dataValues, type) {

    return [
      {
        type: 'select',
        multiple: false,
        input: true,
        label: 'Select form field to link: ',
        key: 'dateTimeForLinkedFields',
        dataSrc: 'custom',
        valueProperty: 'value',
        refreshOn: 'data',
        data: {
          custom(context) {
            const values = [];
            context.utils.eachComponent(context.instance.options.editForm.components, (component, path) => {
              if (component.key != context.data.key) {
                values.push({
                  label: `${component.label || component.key} (${path})`,
                  value: path,
                });
              }
            });
            console.log('values', values);
            return values;
          }
        }
      },
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

  setDefaultDate() {
    return [
      {
        "label": "Date / Time",
        "tableView": false,
        "enableMinDateInput": false,
        "datePicker": {
          "disableWeekends": false,
          "disableWeekdays": false
        },
        "enableMaxDateInput": false,
        "key": "dateTime",
        "type": "datetime",
        "input": true,
        "widget": {
          "type": "calendar",
          "displayInTimezone": "viewer",
          "locale": "en",
          "useLocaleSettings": false,
          "allowInput": true,
          "mode": "single",
          "enableTime": true,
          "noCalendar": false,
          "format": "yyyy-MM-dd hh:mm a",
          "hourIncrement": 1,
          "minuteIncrement": 1,
          "time_24hr": false,
          "minDate": null,
          "disableWeekends": false,
          "disableWeekdays": false,
          "maxDate": null
        },
        "keyModified": false,
        "defaultValue": new Date(),
      }
    ];
  }

  setElseLogic() {
    return [
      {
        "label": "emptyOrNull",
        "tableView": false,
        "key": "emptyOrNull",
        "type": "checkbox",
        "input": true
      },
      {
        "label": "Value for empty or null",
        "tableView": true,
        "key": "valueForEmptyOrNull",
        "customConditional": "show = !!data.emptyOrNull;",
        "type": "textfield",
        "input": true
      },
      {
        "label": "Else",
        "tableView": false,
        "key": "elseLogic",
        "type": "checkbox",
        "input": true
      },
      {
        "label": "Value for else",
        "tableView": true,
        "key": "valueForElse",
        "customConditional": "show = !!data.elseLogic;",
        "type": "textfield",
        "input": true
      }
    ];
  }

}