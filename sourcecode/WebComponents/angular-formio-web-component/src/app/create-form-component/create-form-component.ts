import { ChangeDetectorRef, Component, EventEmitter, Injector, Input, OnInit, Output, TemplateRef, ViewChild, ElementRef, DoCheck, AfterContentInit, AfterContentChecked, AfterViewInit, AfterViewChecked, OnDestroy, ViewEncapsulation, Inject, HostListener } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { CreateForm } from '../models/createForm';
import { FormService } from '../services/formService';
import * as formUtils from 'formiojs/utils/formUtils.js';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { ConstantVariables } from '../globaldependencies/constants/constant-variables';
import { CustomAppBaseComponent } from '../globaldependencies/components/componentbase';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilderService } from '../services/formBuilderService';
import { Subject } from "rxjs";
import { Guid } from 'guid-typescript';
import { FormCreationService } from '../services/form-creation.service';
import { Formio } from 'angular-formio';
import { ColorPickerService } from 'ngx-color-picker';
import { Components, FormioCustomComponentInfo, registerCustomFormioComponent } from 'angular-formio';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import _ from 'lodash';
import { MatOption } from '@angular/material/core';

@Component({
  selector: 'app-create-form-component',
  templateUrl: './create-form-component.html',
  providers: [ColorPickerService]
})
export class CreateFormComponent extends CustomAppBaseComponent implements OnInit {
  form: any;
  formModelDetails = new CreateForm();
  timeStamp: any;
  @Input() isFormEdit: boolean = false;
  getFormModel = new CreateForm();
  @ViewChild("formio") formio: any;
  @ViewChild("formTypeDialogComponent") formTypeDialogComponent: TemplateRef<any>;
  @ViewChild("allSelected") private allSelected: MatOption;
  @ViewChild("allEditSelected") private allEditSelected: MatOption;
  isFormLoaded: boolean = true;
  formOutput: { components: any[]; };
  yourColor: any;
  submitCheckClass = 'submit-formio-true';
  defaultSubmitObject: any = {"type": "button","label": "Submit","key": "submit","disableOnInvalid": true,"input": true,"tableView": false};
  rolesList: any;
  @Input()
  set companyModuleId(data: any) {
    console.log(data);
    if (data) {
      console.log(data);
      this.moduleId = data;
      this.generateFormTypes();
    }
    else {
      this.getFormTypes();
    }
  }

  dataSourceId: any;
  @Input() set dataSourceType(data: any) {
    if (data) {
      this.dataSourceTypeNumber = data;
    }
  }
  @Input() set formid(data: any) {
    console.log("data", data);
    if (data) {
      this.isFormEdit = true;
      this.isFormLoaded = false;
      this.getForm(data);
    }
  }
  @Output() formsubmitted = new EventEmitter<any>();
  formTypes: any;
  formName: any;
  moduleId: string;
  selectedFormType: any;
  dataSourceTypeNumber: any;
  formBgColor: any;
  workflowTrigger: any;
  editFormRoleIds = new FormControl(null, [Validators.required]);
  viewFormRoleIds = new FormControl(null, [Validators.required]);
  selectedType = new FormControl("", [Validators.required]);
  nameFormControl = new FormControl("", [
    Validators.required,
    Validators.maxLength(100)
  ]);
  isAbleToLogin = new FormControl("", []);
  allowAnnonymous = new FormControl("", []);
  workflowTriggerField = new FormControl("", []);
  formButtonDisable: boolean = false;
  createForm: CreateForm;
  formJson: any;
  render = false;
  dataSrc: any;
  basicForm: { components: any[]; };
  dataValue = [];
  options: any;
  eventData$ = new Subject();
  constructor(public dialog: MatDialog, private formService: FormService,
    private snackbar: MatSnackBar,
    private toastr: ToastrService,
    private cdRef: ChangeDetectorRef,
    injector: Injector,
    private formBuilderService: FormBuilderService,
    private formCreationService: FormCreationService,
    private translateService: TranslateService
    ) {
    super();
    this.options = this.formBuilderService.getOptions();
  }

  ngOnInit() {
    this.selectedType = new FormControl("", [Validators.required]);
    this.nameFormControl = new FormControl("", [
      Validators.required,
      Validators.maxLength(100)
    ]);
    this.form = { components: []};
    this.formJson = { components: []};
    this.formOutput = { components: []};
    this.options = this.formBuilderService.getOptions();
    console.log('in comp', this.options);
    this.getFormTypes();
    this.getRoles();
    //  this.getForm("d4b5cf55-3cfd-494d-84a9-d203b8691ae6");
  }

  generateFormTypes() {
    this.formTypes = [
      {
        "id": "8b27353c-2e78-4297-9446-d36a6440a9f0",
        "formTypeName": "Form"
      }
    ]
  }

  onChange(event) {
    if (event.form != undefined) {
      if (event.component.type == 'datasource') {
        event = this.formBuilderService.getDataSourceComponent(event);
      }
      if (event.component.type == 'mylookup' && event.type == 'addComponent') {
        let lastIndex = 0;
        if (event.component.relatedfield.length > 0) {
          for (let i = 0; i < event.component.relatedfield.length; i++) {
            const comp = {
              input: true,
              key: event.component.key + "_related_" + event.component.relatedfield[i],
              label: event.component.relatedFieldsLabel[i],
              tableView: true,
              type: "textfield",
              disabled: true,
            }
            event.form.components.splice(event.index + 1, 0, comp);
            lastIndex = event.index + 1;
          }
        }

        if (event.component.relatedFormsFields.length > 0) {
          for (let i = 0; i < event.component.relatedFormsFields.length; i++) {
            const comp = {
              input: true,
              key: event.component.key + "_related_" + event.component.relatedFormsFields[i],
              label: event.component.relatedFormFieldsLabel[i],
              tableView: true,
              type: "textfield",
              disabled: true,
            }
            event.form.components.splice(lastIndex + 1, 0, comp);
          }
        }
      }
      if (event.component.type == 'myfileuploads') {
        if (Object.keys(event.component.properties).length >= 0) {
          if (event.component.properties.referenceTypeId != undefined) {
            if (!Guid.isGuid(event.component.properties.referenceTypeId)) {
              let guid = Guid.create();
              event.component.properties.referenceTypeId = guid['value'];
            }
          } else {
            event.component.properties['referenceTypeId'] = Guid.create()['value'];
          }

          // if (event.component.properties.referenceTypeName != null && event.component.properties.referenceTypeName != undefined 
          //   && event.component.properties.referenceTypeName.trim().length != 0) {
          //   if (event.component.properties.referenceTypeName != null && event.component.properties.referenceTypeName != undefined 
          //       && event.component.properties.referenceTypeName.trim().length != 0) {
          // event.component.properties.referenceTypeName = event.component.properties.referenceTypeName;
          event.component.properties['referenceTypeName'] = event.component.key;
        }
        //   } else {
        //     event.component.properties['referenceTypeName'] = event.component.key;
        //   }
        // }
      }

      if (event.component.type == 'livesimageupload') {
        if (Object.keys(event.component.properties).length >= 0) {
          if (event.component.properties.referenceTypeId != undefined) {
            if (!Guid.isGuid(event.component.properties.referenceTypeId)) {
              let guid = Guid.create();
              event.component.properties.referenceTypeId = guid['value'];
            }
          } else {
            event.component.properties['referenceTypeId'] = Guid.create()['value'];
          }
          event.component.properties['referenceTypeName'] = event.component.key;
        }
      }
      this.formOutput = event.form;
    }
  }

  getFormTypes() {
    this.formService.GetFormTypes().subscribe((response: any) => {
      this.formTypes = response.data;
      console.log(this.formTypes);
      this.cdRef.detectChanges();
    });
  }

  checkDisable() {
    return false;
  }
  convertStringToArray(customApplicationByIdData) {
    if(customApplicationByIdData) {
        const customApplicationRoleIds = customApplicationByIdData.split(",");
        const roleIds = [];
        customApplicationRoleIds.forEach((id) => {
            roleIds.push(id.toLowerCase());
        });

        if (this.rolesList && customApplicationRoleIds.length == this.rolesList.length) {
            roleIds.push(0);
            return roleIds;
        } else {
            return roleIds;
        }
      }
}
  getForm(data) {
    this.getFormModel = new CreateForm();
    this.getFormModel.Id = data;
    this.formCreationService
      .GetGenericForms(this.getFormModel)
      .subscribe((result: any) => {
        this.formModelDetails = result.data;
        this.formName = this.formModelDetails[0].formName;
        this.dataSourceId = this.formModelDetails[0].dataSourceId;
        this.workflowTrigger = this.formModelDetails[0].workflowTrigger;
        this.dataSourceId = this.formModelDetails[0].dataSourceId;
        this.timeStamp = this.formModelDetails[0].timeStamp;
        let formOutput = JSON.parse(this.formModelDetails[0].formJson);
        this.viewFormRoleIds = new FormControl(this.formModelDetails[0].viewFormRoleIds);
        this.editFormRoleIds = new FormControl(this.formModelDetails[0].editFormRoleIds);
        this.formJson = formOutput;
        this.formBgColor = this.formModelDetails[0].formBgColor;
        let updatedNewComponents = [];
        if (formOutput) {
          let formTypeId = formOutput.FormTypeId;
          this.selectedFormType = formTypeId;
          this.selectedType.setValue(formTypeId);
          let isAbleToLogin = formOutput.isAbleToLogin;
          this.isAbleToLogin.setValue(isAbleToLogin);

          let allowAnnonymous = formOutput.AllowAnnonymous;
          this.allowAnnonymous.setValue(allowAnnonymous);

          let components = formOutput.Components;
          if (components && components.length > 0) {
            components.forEach((comp) => {
              let values = [];
              let keys = Object.keys(comp);
              keys.forEach((key) => {
                values.push(comp[key]);
                let updatedKeyName = key.charAt(0).toLowerCase() + key.substring(1);
                console.log(updatedKeyName);
                let idx = keys.indexOf(key);
                if (idx > -1) {
                  keys[idx] = updatedKeyName;
                }
              })
              var updatedModel = {};
              for (let i = 0; i < keys.length; i++) {
                updatedModel[keys[i]] = values[i];
              }
              updatedNewComponents.push(updatedModel);
            })
          }
          this.formOutput.components = updatedNewComponents;
        }
        this.form = this.getcaseObj(this.formOutput)

        // this.form = this.formOutput;
        this.isFormLoaded = true;
        console.log("form", this.form);
        this.formBuilderService.setDataSourceComponentInEdit(this.form);
        console.log(this.form);
        this.cdRef.detectChanges();
      });
  }
  getcaseObj(obj) {
    var objects = [];
    for (var i in obj) {
      if (!obj.hasOwnProperty(i)) continue;
      if (typeof obj[i] == 'object') {
        objects = objects.concat(this.getcaseObj(obj[i]));
      } else if (i) {
        var updatedNewComponents = [], components;
        components = obj.components;
        if (components && components.length >= 1) {
          components.forEach((comp) => {
            let values = [];
            let keys = Object.keys(comp);
            keys.forEach((key) => {
              values.push(comp[key]);
              let updatedKeyName = key.charAt(0).toLowerCase() + key.substring(1);
              console.log(updatedKeyName);
              let idx = keys.indexOf(key);
              if (idx > -1) {
                keys[idx] = updatedKeyName;
              }
            })
            var updatedModel = {};
            for (let i = 0; i < keys.length; i++) {
              updatedModel[keys[i]] = values[i];
            }
            updatedNewComponents.push(updatedModel);
          })
        }
        obj.components = updatedNewComponents;
      }
    }
    return obj;
  }
  getObjects(obj, key, val) {
    var objects = [];
    for (var i in obj) {
      if (!obj.hasOwnProperty(i)) continue;
      if (typeof obj[i] == 'object') {
        objects = objects.concat(this.getObjects(obj[i], key, val));
      } else if (i == key && obj[key] == val) {
        if ((!obj.hasOwnProperty("numCols")) || (!obj.hasOwnProperty("numRows")) && (val == "table")) {
          obj['numRows'] = obj['rows'].length;
          obj['numCols'] = obj['rows'][0].length;
        }
      }
    }
    return obj;
  }
  createAGenericForm() {
    // this.formio.builder.options.editForm.redraw();
    // this.render = true;
    if (this.formOutput.components && this.formOutput.components.length >= 1) {
     // var index = this.formOutput.components.findIndex((x: any) => _.isEqual(x, this.defaultSubmitObject));
      // var index = this.formOutput.components.findIndex((x: any) => { 
      //   if(x.customClass) {
      //     var str = x.customClass.split(" ");
      //     return str.includes(this.submitCheckClass);
      //   }
      //   return false;
      // } );
      // if(index != -1) {
      //   this.formOutput.components[index]['action'] = 'submit';
      // }
      var formOutput = this.getObjects(this.formOutput, 'type', 'table');
      this.formOutput = formOutput;
      console.log(this.formOutput);
      console.log(typeof this.formOutput);
      var formKeys = [];
      formUtils.eachComponent(this.formOutput.components, function (component, path, i, j, k) {
        if(component.type == 'button' && !component.action) {
          component.action = 'submit';
        }
        if(component.type == "datetime" || component.type == "mydatetime" || component.type == "mylinkdatetime") {
          component.format = component?.widget?.format;
        }
        if(component.elseLogic == true && component.logic && component.logic.length > 0) {
          var trigger = {type: 'javascript', javascript: ""};
          var actions = [{name: "elseAction", type: "value", value: `value = ${component.valueForElse}`}];
          var logic = {name: 'else'};
          var logicJsStr = "result = ";
          var coms = component.logic.filter(x => (x.name != 'emptyOrNull' && x.name != 'else'));
          coms.forEach((l: any, i: any) => {
            if(l.trigger.type == "simple" && l.name != "emptyOrNull") {
              i == (coms.length - 1) ? logicJsStr = logicJsStr + `(data.${l.trigger.simple.when} != ${l.trigger.simple.eq})` : logicJsStr = logicJsStr + `(data.${l.trigger.simple.when} != ${l.trigger.simple.eq}) && `;
            } else if(l.trigger.type == "javascript" && l.name != "emptyOrNull") {
              i == (coms.length - 1) ? logicJsStr = logicJsStr + `(!(${l.trigger.javascript.charAt(l.trigger.javascript.length-1) == ";" ? l.trigger.javascript.substring(0, l.trigger.javascript.length - 1) : l.trigger.javascript}))` : logicJsStr = logicJsStr + `(!(${l.trigger.javascript.charAt(l.trigger.javascript.length-1) == ";" ? l.trigger.javascript.substring(0, l.trigger.javascript.length - 1) : l.trigger.javascript})) && `;
            }
          });
          trigger.javascript = logicJsStr;
          logic['trigger'] = trigger;
          logic['actions'] = actions;
          if(!(component.logic.find(x => x.name == 'else'))) {
            component.logic.push(logic);
          } else {
            var index = component.logic.findIndex(x => x.name == 'else');
            component.logic[index] = logic;
          }
        }
        if(component.emptyOrNull == true && component.logic && component.logic.length > 0) {
          var trigger = {type: 'javascript', javascript: ""};
          var actions = [{name: "EmptyOrNullAction", type: "value", value: `value = ${component.valueForEmptyOrNull}`}];
          var logic = {name: 'emptyOrNull'};
          var logicJsStr = "result = ";
          var datas = [];
          component.logic.forEach((l: any, i: any) => {
            if(l.trigger.type == "simple" && l.name != "else" && l.name != "emptyOrNull") {
              datas.push(`data.${l.trigger.simple.when}`);
            } else if(l.trigger.type == "javascript" && l.name != "else" && l.name != "emptyOrNull") {
              var arr = [];
              arr = l.trigger.javascript.split(" ")?.filter(x => x.includes("data."));
              datas.push(...arr);
            }
          });
          datas = [...new Set(datas)]
          if(datas.length > 0) {
            datas.forEach((l: any, i: any) => {
                i == (datas.length - 1) ? logicJsStr = logicJsStr + `(${l} == null || ${l} == undefined || ${l} == "")` : logicJsStr = logicJsStr + `(${l} == null || ${l} == undefined || ${l} == "") && `;
            });
            trigger.javascript = logicJsStr;
            logic['trigger'] = trigger;
            logic['actions'] = actions;
            if(!(component.logic.find(x => x.name == 'emptyOrNull'))) {
              component.logic.push(logic);
            } else {
              var index = component.logic.findIndex(x => x.name == 'emptyOrNull');
              component.logic[index] = logic;
            }
          }
        }
        formKeys.push({ key: component.key, 
                        label: component.label, 
                        type: component.type, 
                        delimiter: component.delimiter, 
                        requireDecimal: component.requireDecimal, 
                        decimalLimit: component.decimalLimit, 
                        format: ( component.type == 'datetime' || component.type == 'mydatetime' || component.type == 'mylinkdatetime')? component?.widget?.format : undefined, 
                        path: path, 
                        relatedFieldsfinalData: component.relatedFieldsfinalData ? component.relatedFieldsfinalData : null,
                        selectedFormName: component.selectedFormName, 
                        selectedForm: component.selectedForm, 
                        formName: component.formName, 
                        relatedfield: component.relatedfield ? component.relatedfield : null,
                        fieldName: component.fieldName, 
                        valueSelection: component.valueSelection,
                        calculateValue: component.calculateValue,
                        unique: component.unique,
                        properties: component.properties
                      });
      }, true);
      this.basicForm = Object.assign({}, this.formOutput);
      this.formButtonDisable = true;
      this.createForm = new CreateForm();
      if (this.isFormEdit) {
        this.createForm.Id = this.getFormModel.Id;
        this.createForm.DataSourceId = this.dataSourceId;
        this.createForm.TimeStamp = this.timeStamp;
      }
      this.createForm.formName = this.formName;
      this.createForm.FormTypeId = this.selectedFormType;
      this.createForm.workflowTrigger = this.workflowTrigger;
      this.createForm.isAbleToLogin = this.isAbleToLogin.value;
      this.createForm.allowAnnonymous = this.allowAnnonymous.value;
      this.createForm.dataSourceId = this.dataSourceId;
      this.createForm.companyModuleId = this.moduleId;
      this.createForm.dataSourceTypeNumber = this.dataSourceTypeNumber;
      this.createForm.formBgColor = this.formBgColor;
      this.createForm.viewFormRoleIds = this.viewFormRoleIds.value;
      this.createForm.editFormRoleIds = this.editFormRoleIds.value;
      this.createForm.formJson = this.formOutput.components;
      this.createForm.formKeys = JSON.stringify(formKeys);
      this.formCreationService
        .UpsertGenericForm(this.createForm)
        .subscribe((response: any) => {
          if (response.success == true) {
            if (this.isFormEdit == true)
              this.snackbar.open('Form updated successfully', "ok", {
                duration: 3000
              });
            else
              this.snackbar.open('Form added successfully', "ok", {
                duration: 3000
              });
            // this.snackbar.open(this.translateService.instant(ConstantVariables.FormCreationMessage), "ok", {
            //     duration: 3000
            // });
            this.selectedType = new FormControl("", [Validators.required]);
            this.nameFormControl = new FormControl("", [
              Validators.required,
              Validators.maxLength(100)
            ]);
            this.isAbleToLogin = new FormControl("", []);
            this.allowAnnonymous = new FormControl("", []);
            this.formJson = { Components: [] };
            this.formButtonDisable = false;
            this.selectedFormType = null;
            this.formName = null;
            this.workflowTrigger = null;
            this.timeStamp = null;
            this.formJson = Object.assign({}, { Components: [] });
            this.form = Object.assign({}, { Components: [] });
            this.formsubmitted.emit();
          }
          if (response.success == false) {
            this.formButtonDisable = false;
            var validationmessage = response.apiResponseMessages[0].message;
            this.toastr.error(validationmessage);
          }
        });
    } else {
      this.toastr.warning("Form should contain atlest one compoenet");
    }

  }

  createFormType() {
    let dialogId = "create-form-type-dialog-component";
    const dialogRef = this.dialog.open(this.formTypeDialogComponent, {
      minWidth: "85vw",
      minHeight: "85vh",
      height: "70%",
      id: dialogId,
      data: { formPhysicalId: dialogId }
    });

    dialogRef.afterClosed().subscribe(() => {
      this.formService.GetFormTypes().subscribe((response: any) => {
        this.formTypes = response.data;
      });
    });
  }
  onChangeColor(value) {

    this.formBgColor = value;
  }
  getRoles() {
    this.formService.getAllRoles().subscribe((result: any) => {
        if (result.success) {
            this.rolesList = result.data;
        }
    });
}
  compareSelectedRoles(rolesList: any, selectedRoles: any) {
        if (rolesList === selectedRoles) {
            return true;
        } else {
            return false;
        }
    }
    toggleAllRolesSelected() {
      if (this.allSelected.selected) {
          if (this.rolesList.length === 0) {
              this.viewFormRoleIds.patchValue([]);
          } else {
            this.viewFormRoleIds.patchValue([
                  ...this.rolesList.map((item) => item.roleId),
                  0
              ]);
          }
      } else {
        this.viewFormRoleIds.patchValue([]);
      }
  }
  toggleUserPerOne() {
    if (this.allSelected.selected) {
        this.allSelected.deselect();
        return false;
    }
    if (this.viewFormRoleIds.value.length === this.rolesList.length) {
        this.allSelected.select();
    }
}
toggleAllEditRolesSelected() {
  if (this.allEditSelected.selected) {
      if (this.rolesList.length === 0) {
          this.editFormRoleIds.patchValue([]);
      } else {
        this.editFormRoleIds.patchValue([
              ...this.rolesList.map((item) => item.roleId),
              0
          ]);
      }
  } else {
    this.editFormRoleIds.patchValue([]);
  }
}
toggleEditUserPerOne() {
if (this.allEditSelected.selected) {
    this.allEditSelected.deselect();
    return false;
}
if (this.editFormRoleIds.value.length === this.rolesList.length) {
    this.allEditSelected.select();
}
}
  // onChangeColor(colorPicker) {
  //   this.yourColor = colorPicker.value;
  //   console.log(document.getElementsByClassName('formarea'));
  //   const formbuilderElements = Array.from(
  //     document.getElementsByClassName('formarea')
  //   );m

  //   console.log(formbuilderElements);

  //   formbuilderElements.forEach((x) => {
  //     x.id = 'colorId';
  //     let myElement = document.getElementById("colorId");
  //   myElement.style.backgroundColor = this.yourColor;
  //   })
  // }
  ngAfterViewInit() {
    // if(this.formio.builder.instance) {
    //   this.formio.builder.instance.redraw();
      
    //   this.formio.builder.setForm();
    //}
  }

  // @HostListener('unloaded')
  // ngOnDestroy() {
  //   console.log('Items destroyed');
  // }

}
