import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ToastrService } from 'ngx-toastr';
import { CookieService } from 'ngx-cookie-service';
import { Guid } from 'guid-typescript';
import * as moment from 'moment';
import _ from 'lodash';
import * as formUtils from 'formiojs/utils/formUtils.js';
import { CreateForm } from 'src/app/models/createForm';
import { FormSubmitted } from 'src/app/models/formSubmitted';
import { CustomApplicationSearchModel } from 'src/app/models/customApplicationSearchModel';
import { FormCreationService } from 'src/app/services/form-creation.service';
import { StoreManagementService } from 'src/app/services/store-management.service';
import { LocalStorageProperties } from '../globaldependencies/constants/localstorage-properties';

@Component({
  selector: 'app-dynamic-submit-form-unauth-component',
  templateUrl: './dynamic-submit-form-unauth.component.html'
})
export class DynamicSubmitFormUnAuthComponent implements OnInit {
  submittedData: any;
  @ViewChild("formio") formio: any;
  customApplicationSearchModel: CustomApplicationSearchModel;
  applicationForms: any;
  isEdit: boolean =false;
  formDataLoaded: boolean = false;
  customApplicationsLoaded: boolean = false;
  formBgColor: any;
  uniquedatetimes: any = [];
  status: any;
  mylinkdatetimeFields: any = [];
  tempSubmissionData: any;
  load: boolean=true;
  upsertForm: CreateForm;
  isUpdateGenericForm: boolean;
  genericFormModelDetails: any;
  isEditMains: any = true;
  genericFormSubmittedId: any = null;
  formIds: any;
  formSubmittedId: any = null;
  isNewRecord: boolean = false;
  fileUploadKeys: any = [];
   @Output() formsubmitted = new EventEmitter<any>();
  customApplicationId: any;
  formInputDetails: any;
  dataSourceId: any;
  uniqueNumber: any;
  form: any = { components: [] };
  formOutput: any = { components: [] };
  getFormModel = new FormSubmitted();
  formModelDetails: any;
  formModel = new FormSubmitted();
  formName: any = "";
  submission: any = { data: {} };
  genericForm = new FormSubmitted();
  user: any;
  keyName: string;
  refreshForm = new EventEmitter();
  dateComponent : any = {};
  templateViewOnly:boolean =false;
  formMode:string ="view";
  testValue:string = "component initialised";

  constructor( private storeManagementService: StoreManagementService,
    private formCreationService: FormCreationService,
    private snackbar: MatSnackBar,
    private toastr: ToastrService,
    private cdRef: ChangeDetectorRef,
    private cookieService: CookieService) {
      this.load=true;
      
  }

  ngOnInit() {
    console.log('entered dynamic submit form unauth constructor')
    var customApplicationId = JSON.parse(localStorage.getItem(LocalStorageProperties.DynamicCustomApplicationId));
    var formId = JSON.parse(localStorage.getItem(LocalStorageProperties.DynamicFormId));
    this.formMode =localStorage.getItem(LocalStorageProperties.DynamicFormMode);
    console.log('customApplicationId : ' + customApplicationId +' formId :' + formId + ' and formmode :' + this.formMode);
    this.templateViewOnly = this.formMode =="view"? true :false;
    if(customApplicationId && formId)
    {
     console.log('calling getCustomApplicationUnAuth '+  'customApplicationId : ' +customApplicationId +' formId :'+  formId);
    this.customApplicationsLoaded = false;
    this.customApplicationId = customApplicationId;
    this.formIds = formId;
    this.getCustomApplicationUnAuth(customApplicationId, formId);
    }
  }

  onChange(event: any) {
  }
  customEvent(event: any) {
    //lookup custom event add code to submission object
    if(event.type == 'myrq') {
      var key = event.key + 'rqchilddata';
      var a = this.submission.data.hasOwnProperty(key);
      var b = _.isEqual(event.data, this.submission.data[key]);
      if (!a || (a && !_.isEqual(event.data, this.submission.data[key]))) {
        this.submission.data[key] = event.data;
        this.refreshForm.emit({
          form: this.form,
          submission: {
            data: this.submission.data
          }
        });
      }
    }
    if (event.type == 'mylookup') {
      var key = event.key + event.value + 'lookupchilddata';
      var a = this.submission.data.hasOwnProperty(key);
      var b = _.isEqual(event.data, this.submission.data[key]);
      if(a && event.isDelete) {
        delete this.submission.data[key];
        delete this.submission.data[event.key];
        // this.refreshForm.emit({
        //   form: this.form,
        //   submission: {
        //     data: this.submission.data
        //   }
        // });
      }
      else if (!a || (a && !_.isEqual(event.data, this.submission.data[key]))) {
        this.submission.data[key] = event.data;
        this.refreshForm.emit({
          form: this.form,
          submission: {
            data: this.submission.data
          }
        });
      }
    }
    if(event.type == 'myCustomSelect'){
      this.isUpdateGenericForm = true;
      this.isEdit=false;
      let key = event.key;
      let data = event.data;
      // let camelKey = this.toCamelCase(data);
      formUtils.eachComponent(this.form.components, function (component) {
        if(component.type=='myCustomSelect' && component.key == key){
          component.data.values.push({label:data, value:data});
        }
      }, true);
      
      this.refreshForm.emit({
        form: this.form,
        submission: {
          data: this.submission.data
        }
      });
      this.updateGenericForm();
    }
    // if (event.type == 'refresh') {
    // this.load=!this.load;
    // this.isEdit=true;
    // this.cdRef.detectChanges();
    // }
  }
  toCamelCase(str){
    return str
        .replace(/\s(.)/g, function($1) { return $1.toUpperCase(); })
        .replace(/\s/g, '')
        .replace(/^(.)/, function($1) { return $1.toLowerCase(); });
}
  onSubmit(data: any) {
    if (data.data != undefined) {
      this.status = data.state;
      this.submittedData = data.data;
      if (this.fileUploadKeys.length == 0) {
        this.submitForm();
      } else {
        this.getFileDetailsBeforeSubmit();
      }
    }
  }
  getFormSubmittedUnAuth(formId) {
    this.getFormModel = new FormSubmitted();
    //this.getFormModel.genericFormSubmittedId = data;
    this.formCreationService
      .GetLatestSubmittedReportByFormIdUnAuth(this.customApplicationId, this.formIds,   null,   false,  1,  1,null,  null,  null,  null, null,  null)
      .subscribe((result: any) => {
        if (result.success) {
          this.formModelDetails = result.data[0];
          this.genericFormSubmittedId = result.data[0].genericFormSubmittedId;
          const genericFormDetails = result.data[0].formJson;
          this.uniqueNumber = this.formModelDetails.uniqueNumber;
          let parseDetails = JSON.parse(genericFormDetails);
          if(this.dateComponent) {
            let keyName = this.keyName;
            let dateOutput = parseDetails[keyName];
            let dateFormat = new Date(dateOutput);
            parseDetails[keyName] = dateFormat;
          }
          this.submission.data = parseDetails;
          this.tempSubmissionData = parseDetails;
          this.customApplicationsLoaded = true;
          this.formDataLoaded = true;
          this.isEdit = true;
          this.cdRef.detectChanges();
        } else {
          this.customApplicationsLoaded = true;
          this.formDataLoaded = true;
          //this.isEdit = false;
        }
        this.cdRef.detectChanges();
      });
  }

  getCustomApplicationUnAuth(id, formId) {
    console.log('in ca m', id, formId);
    if (id != null && id != undefined && formId != null && formId != undefined) {
      this.formOutput = { components: [] };
      this.customApplicationSearchModel = new CustomApplicationSearchModel();
      this.customApplicationSearchModel.customApplicationId = id;
      this.customApplicationSearchModel.formId = formId; 
      this.formCreationService.getCustomApplicationUnAuth(this.customApplicationSearchModel).subscribe((result: any) => {
        if (result.data && result.data.length > 0) {
          this.applicationForms = result.data[0];
          this.formName = result.data[0].customApplicationName;
          // this.formBgColor = result.data[0].formBgColor;
          this.dataSourceId = result.data[0].dataSourceId;
          let formOutput = JSON.parse(result.data[0].formJson);
          let updatedNewComponents = [];
          this.fileUploadKeys = [];
          if (this.genericFormSubmittedId == null && this.formDataLoaded == false) {
            this.isNewRecord = true;
            this.genericFormSubmittedId = Guid.create();
            if (("value" in this.genericFormSubmittedId)) {
              this.genericFormSubmittedId = this.genericFormSubmittedId["value"];
            }
          }
          if (formOutput) {
            console.log('in form output');
            let components = formOutput.Components;
            if (components && components.length > 0) {
              components.forEach((comp) => {
                let values = [];
                let keys = Object.keys(comp);
                keys.forEach((key) => {
                  values.push(comp[key]);
                  let updatedKeyName = key.charAt(0).toLowerCase() + key.substring(1);
                  let idx = keys.indexOf(key);
                  if (idx > -1) {
                    keys[idx] = updatedKeyName;
                  }
                })
                var updatedModel = {};
                for (let i = 0; i < keys.length; i++) {
                  updatedModel[keys[i]] = values[i];
                }

                if (updatedModel["type"] == "myfileuploads" ) {
                  updatedModel["properties"]["referenceTypeId"] = this.genericFormSubmittedId;
                  updatedModel["properties"]["referenceTypeName"] = updatedModel["key"];
                  this.fileUploadKeys.push(updatedModel["key"]);
                }

                if (updatedModel["type"] == 'livesimageupload') {
                  updatedModel["properties"]["referenceTypeId"] = this.genericFormSubmittedId;
                  updatedModel["properties"]["referenceTypeName"] = updatedModel["key"];
                  this.fileUploadKeys.push(updatedModel["key"]);
                }

                if (updatedModel["type"] == "mydatetime") {
                  this.uniquedatetimes.push(updatedModel["key"]);
                }
                updatedNewComponents.push(updatedModel);
              })
            }
          
            this.formOutput.components = updatedNewComponents;
           
            this.form = this.getcaseObj(this.formOutput);
            if((this.form && !this.applicationForms?.editForm) || !this.isEditMains) {
              formUtils.eachComponent(this.form.components, function (component) {
                component.disabled = true;
              }, true);
            }
            if (this.form) {
              this.getFormDetailsUnAuth(formId);
            }
          }
        } else {
          this.formName = this.formInputDetails.formName;
          this.form = JSON.parse(this.formInputDetails.formJson);
          this.form = this.getcaseObj(this.formOutput);
          let keyName;
          if((this.form && !this.applicationForms?.editForm) || !this.isEditMains) {
            formUtils.eachComponent(this.form.components, function (component) {
              component.disabled = true;
              if(component.type == "datetime") {
               keyName = component.key;
              }
            }, true);
          }
        }
        // if (this.genericFormSubmittedId != null && this.genericFormSubmittedId != undefined && !this.isNewRecord) {
          if(this.formMode != 'submit') {
          let keyName;
          this.isNewRecord =false;
          formUtils.eachComponent(this.form.components, function (component) {
            if(component.type == "datetime") {
              keyName = component.key;
            }
          }, true);
          this.keyName = keyName;
          this.getFormSubmittedUnAuth(this.genericFormSubmittedId);
        } else {
          if(this.formMode == 'submit')
          {
          this.isNewRecord = true;
          }
          this.customApplicationsLoaded = true;
          this.formDataLoaded = true;
          this.isEdit = false;
        }
        this.cdRef.detectChanges();
        // this.customApplicationsLoaded = true;
        // this.isEdit = false;
        // this.cdRef.detectChanges();
      });
    }
  }
  getFormDetailsUnAuth(id) {
    var getFormModel = new CreateForm();
    getFormModel.Id = id;
    this.formCreationService
      .GetGenericFormsUnAuth(getFormModel)
      .subscribe((result: any) => {
        this.genericFormModelDetails = result.data;
        // console.log('1',this.genericFormModelDetails);
        this.formName = this.genericFormModelDetails[0].formName;
        this.formBgColor = this.genericFormModelDetails[0].formBgColor;
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
        if (obj.type && obj.type == "mylinkdatetime") {
          if (!this.mylinkdatetimeFields.some(x => x.key == obj.key)) {
            this.mylinkdatetimeFields.push({ key: obj.key, dateTimeForLinkedFields: obj.dateTimeForLinkedFields });
          }
        }
        if (components && components.length >= 1) {
          components.forEach((comp) => {
            let values = [];
            let keys = Object.keys(comp);
            keys.forEach((key) => {
              values.push(comp[key]);
              let updatedKeyName = key.charAt(0).toLowerCase() + key.substring(1);
              // console.log(updatedKeyName);
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
        updatedNewComponents && updatedNewComponents.length > 0 ? obj.components = updatedNewComponents : null;
      }
    }
    return obj;
  }
  submitForm() {
    this.genericForm = new FormSubmitted();
    var dt = this.submittedData;
    var date = moment().format();
    if (this.isNewRecord) {
      dt["Created User"] = this.user?.fullName;
      dt["Created Date"] = moment(date).format('DD MMM YYYY h:mm A');
       dt["createdBy"] = null;
    } else {
      dt["Updated User"] = this.user?.fullName;
      dt["Updated Date"] = moment(date).format('DD MMM YYYY h:mm A');
       dt["updatedBy"] = null;
      if (this.uniquedatetimes && this.uniquedatetimes.length > 0) {
        this.uniquedatetimes.forEach((key: any) => {
          this.submittedData[key] = moment(date).format();
        });
      }
    }
    if (this.mylinkdatetimeFields && this.mylinkdatetimeFields.length > 0) {
      this.mylinkdatetimeFields.forEach((x: any) => {
        var key = x.dateTimeForLinkedFields;
        if (!this.tempSubmissionData || !this.tempSubmissionData.hasOwnProperty(key) || (this.submittedData[key] != this.tempSubmissionData[key])) {
          this.submittedData[x.key] = moment(date).format();
        }
      });
    }
    this.submittedData = dt;
    this.tempSubmissionData = JSON.parse(JSON.stringify(this.submittedData));
    // console.log('data:', this.submittedData);
    this.genericForm.status = this.status;
    this.genericForm.formJson = JSON.stringify(this.submittedData);
    if (this.applicationForms) {
      this.genericForm.customApplicationId = this.applicationForms.customApplicationId;
      this.genericForm.formId = this.applicationForms.formId;
      this.genericForm.isAbleToLogin = this.applicationForms.isAbleToLogin;
      this.genericForm.dataSourceId = this.dataSourceId;
    } else {
      this.genericForm.customApplicationId = this.customApplicationId;
      this.genericForm.formId = this.formInputDetails.id;
      this.genericForm.isAbleToLogin = this.formInputDetails.isAbleToLogin;
      this.genericForm.dataSourceId = this.formInputDetails.dataSourceId;
    }

    if (this.isNewRecord) {
      this.genericForm.genericFormSubmittedId = this.genericFormSubmittedId;
      this.genericForm.dataSetId = this.genericFormSubmittedId;
      this.genericForm.isNewRecord = true;
    } else {
      this.genericForm.isNewRecord = false;
    }

    if (this.genericFormSubmittedId && !this.isNewRecord) {
      this.genericForm.genericFormSubmittedId = this.genericFormSubmittedId;
      this.genericForm.timeStamp = this.formModelDetails.timeStamp;
      this.genericForm.dataSetId = this.formModelDetails.dataSetId;
      this.genericForm.uniqueNumber = this.uniqueNumber;
    }
    this.formCreationService.submitGenericApplicationUnAuth(this.genericForm).subscribe((result: any) => {
      if (result.success == true) {
        this.snackbar.open('Form details submitted successfully', "Ok", { duration: 3000 });
        // this.snackbar.open(this.translateService.instant(ConstantVariables.SuccessMessageForFormSubmission), "Ok", { duration: 3000 });
        if(this.formMode =='submit')
        {
        this.submission = { data: {} };
      }
      this.refreshForm.emit({
        form: this.form,
        submission: {
          data: this.submission.data
        }
      });
        //this.cdRef.detectChanges();
      }
      if (result.success == false) {
        const validationMessage = result.apiResponseMessages[0].message;
        this.toastr.error(validationMessage);
      }
      this.status = null;
      this.formsubmitted.emit();
    })
  }

  getFileDetailsBeforeSubmit() {
    this.storeManagementService.searchFiles(null, this.genericFormSubmittedId, null).subscribe((response: any) => {
      if (response.success) {
        if (response.data.length > 0) {
          var files = response.data;
          var file = [];
          this.fileUploadKeys.forEach(x => {
            files.forEach((y: any) => {
              if (y.referenceTypeName == x) {
                file.push(y.fileName);
              }
              if (file.length > 0) {
                if(y.referenceId == "466ae1aa-6a42-414e-b5b6-3ddadc87d81f")
                {
                  this.submittedData[y.referenceTypeName] = y.filePath;  
                }
                else{
                this.submittedData[x] = file.toString();
                }
              } else {
                this.submittedData[x] = "";
              }
              file = [];
            });
          });
        } else {
          this.fileUploadKeys.forEach(x => {
            this.submittedData[x] = "";
          });
        }
        this.submitForm();
      }
    });
  }

  onButtonSubmit(event) {
    alert('in submit');
  }
  formLoad(event) {
    // console.log('in formLoad', event);
    //this.submission.data['tf1'] = "";
    // this.refreshForm.emit({
    //   submission: {
    //     data: this.submission.data
    //   }
    // });
  }
  render(event: any) {
    // console.log('render', event);
  }
  initialized(event: any) {
    // console.log('initialized', event);
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
  updateGenericForm() {
    if (this.form.components && this.form.components.length >= 1) {
      var formOutput = this.getObjects(this.form, 'type', 'table');
      this.form = formOutput;
      var formKeys = [];
      formUtils.eachComponent(this.form.components, function (component) {
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
        formKeys.push({ key: component.key, label: component.label, type: component.type, delimiter: component.delimiter, requireDecimal: component.requireDecimal, decimalLimit: component.decimalLimit, format: ( component.type == 'datetime' || component.type == 'mydatetime' || component.type == 'mylinkdatetime')? component?.widget?.format : undefined  });
      }, true);
      this.upsertForm = new CreateForm();
      console.log(this.genericFormModelDetails);
        this.upsertForm.Id = this.genericFormModelDetails[0].id;
        this.upsertForm.dataSourceId = this.genericFormModelDetails[0].id;
        this.upsertForm.TimeStamp = this.genericFormModelDetails[0].timeStamp;
      this.upsertForm.formName = this.genericFormModelDetails[0].formName;
      this.upsertForm.FormTypeId = this.genericFormModelDetails[0].fields.formTypeId;
      this.upsertForm.workflowTrigger = this.genericFormModelDetails[0].workflowTrigger;
      this.upsertForm.isAbleToLogin = this.genericFormModelDetails[0].isAbleToLogin;
      this.upsertForm.dataSourceId = this.genericFormModelDetails[0].id;
      this.upsertForm.companyModuleId = this.genericFormModelDetails[0].companyModuleId;
      this.upsertForm.formBgColor = this.genericFormModelDetails[0].formBgColor;
      this.upsertForm.viewFormRoleIds = this.genericFormModelDetails[0].viewFormRoleIds;
      this.upsertForm.editFormRoleIds = this.genericFormModelDetails[0].editFormRoleIds;
      this.upsertForm.formJson = this.form.components;
      this.upsertForm.formKeys = JSON.stringify(formKeys);
      this.formCreationService
        .UpsertGenericForm(this.upsertForm)
        .subscribe((response: any) => {
          if (response.success == true) {
            this.isUpdateGenericForm=false;
          }
          if (response.success == false) {
            var validationmessage = response.apiResponseMessages[0].message;
            this.toastr.error(validationmessage);
          }
        });
    } else {
      this.toastr.warning("Form should contain atlest one compoenet");
    }

  }

  
}
