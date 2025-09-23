import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { CreateForm } from '../models/createForm';
import { FormSubmitted } from '../models/formSubmitted';
import { FormService } from '../services/formService';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { ConstantVariables } from '../globaldependencies/constants/constant-variables';
import { CustomApplicationSearchModel } from '../models/customApplicationSearchModel';
import { CookieService } from 'ngx-cookie-service';
import { LocalStorageProperties } from '../globaldependencies/constants/localstorage-properties';
import { FormCreationService } from '../services/form-creation.service';
import { Guid } from 'guid-typescript';
import { StoreManagementService } from '../services/store-management.service';
import * as moment from 'moment';
import _ from 'lodash';
import * as formUtils from 'formiojs/utils/formUtils.js';

@Component({
  selector: 'app-submit-form-component-dup',
  templateUrl: './submit-form.component.html'
})
export class SubmitFormComponentDup {
  submittedData: any;
  @ViewChild("formio") formio: any;
  customApplicationSearchModel: CustomApplicationSearchModel;
  applicationForms: any;
  isEdit: boolean;
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
  selectedCompanyId: any;
  selectedUserId: any;
  @Input() set formDetails(data: any) {
    this.formInputDetails = data;
  }
  @Input() set formsubmittedid(id: any) {
    if (id) {
      this.formDataLoaded = false;
      this.genericFormSubmittedId = id;
      this.getCustomApplication(this.customApplicationId, this.formIds);
    }
  }
  genericFormSubmittedId: any = null;
  formIds: any;
  formSubmittedId: any = null;
  isNewRecord: boolean = false;
  fileUploadKeys: any = [];
  @Input() set companyId(id: any) {
    console.log('in ca', id);
    this.customApplicationsLoaded = false;
    this.selectedCompanyId = id;
    this.selectedUserId = JSON.parse(localStorage.getItem("UserModel"))?.companiesList?.find(x=>x.companyId==this.selectedCompanyId)?.userId;
    this.getCustomApplication(id, this.formIds);
  }
  @Input() set customapplicationid(id: any) {
    console.log('in ca', id);
    this.customApplicationsLoaded = false;
    this.customApplicationId = id;
    this.getCustomApplication(id, this.formIds);
  }
  @Input() set formId(id: any) {
    console.log('in id', id);
    this.customApplicationsLoaded = false;
    this.formIds = id;
    this.getCustomApplication(this.customApplicationId, id);
  }
  @Output() formsubmitted = new EventEmitter<any>();
  customApplicationId: any;
  formInputDetails: any;
  dataSourceId: any;
  uniqueNumber: any;
  form: any = { components: [] };
  formOutput: any = { components: [] };
  getFormModel = new FormSubmitted();
  formModelDetails: any;
  userId: any;
  formModel = new FormSubmitted();
  formName: any = "";
  submission: any = { data: {} };
  genericForm = new FormSubmitted();
  user: any;
  refreshForm = new EventEmitter();
  //roleIds :string[]=[];
  constructor(private formService: FormService, private storeManagementService: StoreManagementService,
    private formCreationService: FormCreationService,
    private snackbar: MatSnackBar,
    private toastr: ToastrService,
    private cdRef: ChangeDetectorRef,
    private cookieService: CookieService,
    private translateService: TranslateService) {
      this.load=true;
  }

  ngOnInit() {
    this.userId = this.cookieService.get(LocalStorageProperties.CurrentUserId);
    this.user = JSON.parse(localStorage.getItem('UserModel'));
    console.log('user', this.user);
    // // this.getCustomApplication(this.customApplicationId, this.formIds);
    // if(this.user && this.user.roleIds)
    // {
    //   this.roleIds=this.user.roleIds.split(',');
    // }
  }

  onChange(event: any) {
  }
  customEvent(event: any) {
    //lookup custom event add code to submission object
    if (event.type == 'mylookup') {
      var key = event.key + event.value + 'lookupchilddata';
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
    if(event.type == 'myCustomSelect'){
      this.isUpdateGenericForm = true;
      this.isEdit=false;
      let key = event.key;
      let data = event.data;
      // let camelKey = this.toCamelCase(data);
      formUtils.eachComponent(this.form.components, function (component) {
        if(component.type=='myCustomSelect' && component.key == key){
          component.data.values.push({label:data, value:data});
          this.updateGenericForm();
        }
      }, true);
    }
    if (event.type == 'refresh') {
    this.load=!this.load;
    this.isEdit=true;
    this.cdRef.detectChanges();
    }
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
  getFormSubmitted(data) {
    this.getFormModel = new FormSubmitted();
    this.getFormModel.genericFormSubmittedId = data;
    this.formCreationService
      .getSubmittedReportByFormReportId(this.getFormModel)
      .subscribe((result: any) => {
        if (result.success) {
          this.formModelDetails = result.data[0];
          const genericFormDetails = result.data[0].formJson;
          this.uniqueNumber = this.formModelDetails.uniqueNumber;
          this.submission.data = JSON.parse(genericFormDetails);
          this.tempSubmissionData = JSON.parse(genericFormDetails);
          this.customApplicationsLoaded = true;
          this.formDataLoaded = true;
          this.isEdit = true;
          this.cdRef.detectChanges();
        } else {
          this.customApplicationsLoaded = true;
          this.formDataLoaded = true;
          this.isEdit = false;
        }
        this.cdRef.detectChanges();
      });
  }

  getCustomApplication(id, formId) {
    console.log('in ca m', id, formId);
    if (id != null && id != undefined && formId != null && formId != undefined) {
      this.formOutput = { components: [] };
      this.customApplicationSearchModel = new CustomApplicationSearchModel();
      this.customApplicationSearchModel.customApplicationId = id;
      this.customApplicationSearchModel.formId = formId;
      this.customApplicationSearchModel.companyId = this.selectedCompanyId;
      this.formCreationService.getCustomApplication(this.customApplicationSearchModel).subscribe((result: any) => {
        if (result.data && result.data.length > 0) {
          this.applicationForms = result.data[0];
          this.formName = result.data[0].customApplicationName;
          let selectedCompanyUserRoles = JSON.parse(localStorage.getItem("UserModel"))?.companiesList?.find(x=>x.companyId==this.selectedCompanyId)?.roleIds !=null ? JSON.parse(localStorage.getItem("UserModel"))?.companiesList?.find(x=>x.companyId==this.selectedCompanyId)?.roleIds.split(','):[];
          if (this.applicationForms.viewFormRoleIds != null && this.applicationForms.viewFormRoleIds.length > 0)
          {
              let result =false;
              this.applicationForms.viewFormRoleIds.forEach(el=>{
                if(selectedCompanyUserRoles.includes(el.toString())){
                  result=true;
                }
              })
              this.applicationForms.viewForm = result;
          }
          if (this.applicationForms.editFormRoleIds != null && this.applicationForms.editFormRoleIds.length > 0)
          {
              let result =false;
              this.applicationForms.editFormRoleIds.forEach(el=>{
                if(selectedCompanyUserRoles.includes(el.toString())){
                  result=true;
                }
              })
              this.applicationForms.editForm = result;
          }
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
            //this.form = this.disableTexbox(this.form);
            // if(this.form && !this.applicationForms?.editForm) {
            //   formUtils.eachComponent(this.form.components, function (component) {
            //     component.disabled = true;
            //   }, true);
            // }
            if (this.form) {
              this.getFormDetails(formId);
            }
          }
        } else {
          this.formName = this.formInputDetails.formName;
          this.form = JSON.parse(this.formInputDetails.formJson);
          this.form = this.getcaseObj(this.formOutput);
          this.form = this.disableTexbox(this.form);
          if(this.form && !this.applicationForms?.editForm) {
            formUtils.eachComponent(this.form.components, function (component) {
              component.disabled = true;
            }, true);
          }
        }
        // this.disableTexbox();
        if (this.genericFormSubmittedId != null && this.genericFormSubmittedId != undefined && !this.isNewRecord) {
          this.getFormSubmitted(this.genericFormSubmittedId);
        } else {
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
  getFormDetails(id) {
    var getFormModel = new CreateForm();
    getFormModel.Id = id;
    getFormModel.companiesList = this.selectedCompanyId;
    this.formCreationService
      .GetGenericForms(getFormModel)
      .subscribe((result: any) => {
        this.formModelDetails = result.data;
        console.log('1',this.formModelDetails);
        this.formName = this.formModelDetails[0].formName;
        this.formBgColor = this.formModelDetails[0].formBgColor;
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
      dt["createdBy"] = this.userId;
    } else {
      dt["Updated User"] = this.user?.fullName;
      dt["Updated Date"] = moment(date).format('DD MMM YYYY h:mm A');
      dt["updatedBy"] = this.userId;
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
    console.log('data:', this.submittedData);
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
    this.genericForm.submittedCompanyId=this.selectedCompanyId;
    this.genericForm.submittedUserId=this.selectedUserId;
    this.genericForm.submittedByFormDrill=true;

    if (this.genericFormSubmittedId && !this.isNewRecord) {
      this.genericForm.genericFormSubmittedId = this.genericFormSubmittedId;
      this.genericForm.timeStamp = this.formModelDetails.timeStamp;
      this.genericForm.dataSetId = this.formModelDetails.dataSetId;
      this.genericForm.uniqueNumber = this.uniqueNumber;
    }
    this.formCreationService.submitGenericApplication(this.genericForm).subscribe((result: any) => {
      if (result.success == true) {
        this.snackbar.open('Form details submitted successfully', "Ok", { duration: 3000 });
        // this.snackbar.open(this.translateService.instant(ConstantVariables.SuccessMessageForFormSubmission), "Ok", { duration: 3000 });
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

  disableTexbox(inputFormJson) {
    this.userId = this.cookieService.get(LocalStorageProperties.CurrentUserId)
        var permissionComponents = ['textfield', 'textarea', 'number', 'select', 'button', 'phonenumber', 'currency', 'signature', 'myfileuploads' ,'myCustomSelect' , 'table' , 'well'];
        inputFormJson = inputFormJson;
        console.log(inputFormJson,'beforeper')
        inputFormJson = this.getObjectsForperm(inputFormJson, 'type', this.userId, false, ['textfield', 'textarea','number','password','checkbox','selectboxes','select','radio','button','email','url','phoneNumber','tags','address','mydatetime','mylinkdatetime','datetime','day','time','currency','survey','signature','myfileuploads','mylookup','fieldconcatenation','myrq','myCustomSelect','htmlelement','content','columns','fieldset','panel', 'table','tabs', 'well','container','datamap','datagrid','editgrid','tree']);
        return inputFormJson;
    // var inputFormJson = this.form;
    // for (var i = 0; i < inputFormJson.components.length; i++) {
    //   if (inputFormJson.components[i].roleView) {
    //     for (var j = 0; j < inputFormJson.components[i].roleView.length; j++) {
    //       if (inputFormJson.components[i].roleView[j].toLowerCase() == this.userId.toLowerCase()) {
    //         inputFormJson.components[i].disabled = false;
    //       } else {
    //         inputFormJson.components[i].disabled = true;
    //       }
    //     }
    //   }
    // }
    // this.form = { components: inputFormJson.components }
  }
  getObjectsForperm(obj, key, val, newVal, list) {
    var newValue = newVal;
    var objects = [];
    for (var i in obj) {
        if (!obj.hasOwnProperty(i)) continue;
        if (typeof obj[i] == 'object') {
            objects = objects.concat(this.getObjectsForperm(obj[i], key, val, newValue, list));
        }
        else if (i == key && list.includes(obj[key])) {
            if (obj['userView'] && obj['userEdit']) {
                var isTrue = obj['userEdit'].includes(this.userId) == true ? 'write' : (obj['userView'].includes(this.userId) == true ? 'read' : 'none');
                if (isTrue == 'none') {
                    obj['hidden'] = true;
                } else {
                    obj['disabled'] = isTrue == 'write' ? false : true;
                }
            } else if (obj['userView']) {
                obj['disabled'] = obj['userView'].includes(this.userId);
            }
            else if (obj['userEdit']) {
                obj['disabled'] = obj['userEdit'].includes(this.userId) == true ? false : true;
            }
            else {
                //obj['hidden'] = true;
                obj['disabled'] = false;
            }
        }
        else if (i != key && !list.includes(obj[key])) {
            obj['disabled'] = false;
        }
    }
    return obj;
}
  onButtonSubmit(event) {
    alert('in submit');
  }
  formLoad(event) {
    console.log('in formLoad', event);
    //this.submission.data['tf1'] = "";
    // this.refreshForm.emit({
    //   submission: {
    //     data: this.submission.data
    //   }
    // });
  }
  render(event: any) {
    console.log('render', event);
  }
  initialized(event: any) {
    console.log('initialized', event);
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
      console.log(this.formModelDetails);
        this.upsertForm.Id = this.formModelDetails[0].id;
        this.upsertForm.dataSourceId = this.formModelDetails[0].id;
        this.upsertForm.TimeStamp = this.formModelDetails[0].timeStamp;
      this.upsertForm.formName = this.formModelDetails[0].formName;
      this.upsertForm.FormTypeId = this.formModelDetails[0].formTypeId;
      this.upsertForm.workflowTrigger = this.formModelDetails[0].workflowTrigger;
      this.upsertForm.isAbleToLogin = this.formModelDetails[0].isAbleToLogin;
      this.upsertForm.dataSourceId = this.formModelDetails[0].id;
      this.upsertForm.companyModuleId = this.formModelDetails[0].companyModuleId;
      this.upsertForm.formBgColor = this.formModelDetails[0].formBgColor;
      this.upsertForm.formJson = this.form.components;
      this.upsertForm.formKeys = JSON.stringify(formKeys);
      this.formCreationService
        .UpsertGenericForm(this.upsertForm)
        .subscribe((response: any) => {
          if (response.success == true) {
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
