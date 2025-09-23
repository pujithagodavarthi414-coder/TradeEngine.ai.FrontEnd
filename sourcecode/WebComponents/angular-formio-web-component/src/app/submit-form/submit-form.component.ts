import $ from "jquery";
import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { CreateForm } from '../models/createForm';
import { FormSubmitted } from '../models/formSubmitted';
import { FormService } from '../services/formService';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
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
  selector: 'app-submit-form-component',
  templateUrl: './submit-form.component.html'
})
export class SubmitFormComponent {
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
  workflowsList: any[] = [];
  notificationWorkflows: any[] = [];
  formKeysList: any[] = [];
  tempSubmissionData: any;
  load: boolean = true;
  upsertForm: CreateForm;
  isUpdateGenericForm: boolean;
  genericFormModelDetails: any;
  options: any;
  isEditMains: any;
  message: string;
  subject: string;
  notificationMessage: string;
  stages: any = [];
  @Input() set isEditMain(data: any) {
    this.isEditMains = data;
  }
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
    this.getAllFormKeys();
    this.getAllWorkflows();
    this.getCustomApplication(this.customApplicationId, id);
  }
  @Input() set isFromRedirection(data: any) {
    console.log(data);
    this.isPageRedirect = data;
  }

  @Input() set allowAnnonymous(data: any) {
    console.log(data);
    this.allowAnms = data;
  }
  genericFormSubmittedId: any = null;
  formIds: any;
  formSubmittedId: any = null;
  isNewRecord: boolean = false;
  fileUploadKeys: any = [];
  conditionalEnum: number;
  @Output() formsubmitted = new EventEmitter<any>();
  dataSourceid: any;
  customApplicationId: any;
  formInputDetails: any;
  dataSourceId: any;
  recordPermissionKey: string;
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
  keyName: string;
  refreshForm = new EventEmitter();
  dateComponent: any = {};
  isApproved: boolean;
  isPageRedirect: boolean;
  allowAnms: boolean = false;
  //roleIds :string[]=[];

  constructor(private formService: FormService, private storeManagementService: StoreManagementService,
    private formCreationService: FormCreationService,
    private snackbar: MatSnackBar,
    private toastr: ToastrService,
    private cdRef: ChangeDetectorRef,
    private cookieService: CookieService,
    private translateService: TranslateService) {
    this.load = true;
  }

  ngOnInit() {
    console.log('entered submit form auth');
    this.userId = this.cookieService.get(LocalStorageProperties.CurrentUserId);
    this.options = {
      hooks: {
        beforeSubmit: (submission, next) => {
          //Make a custom ajax call.
          $.ajax({
            url: (document.location.hostname == 'localhost' ? 'http://localhost:55228/' : document.location.origin + '/backend/') + 'GenericForm/GenericFormApi/GetUniqueValidation',
            method: 'POST',
            data: { dataJson: JSON.stringify(submission.data), CustomApplicationId: this.customApplicationId, formId: this.formIds, genericFormSubmittedId: this.genericFormSubmittedId },
            headers: {
              'Authorization': `Bearer ${this.cookieService.get(LocalStorageProperties.CurrentUser)}`
            },
            complete: (res) => {
              let submitErrors = null;
              if (res && res.responseJSON && res.responseJSON.data && res.responseJSON.data.length > 0) {
                submitErrors = res.responseJSON.data.map(key => ({
                  message: `${key} must be unique`
                }));
                next(submitErrors);
              }
              else {
                next(null, submission);
              }
            }
          });
        }
      }
    }
    this.user = JSON.parse(localStorage.getItem('UserModel'));
    console.log('user', this.user);
    // // this.getCustomApplication(this.customApplicationId, this.formIds);
    // if(this.user && this.user.roleIds)
    // {
    //   this.roleIds=this.user.roleIds.toLowerCase().split(',');
    // }
  }

  onChange(event: any) {
  }
  customEvent(event: any) {
    //lookup custom event add code to submission object
    if (event.type == 'myrq') {
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
      if (a && event.isDelete) {
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
    if (event.type == 'myCustomSelect') {
      this.isUpdateGenericForm = true;
      this.isEdit = false;
      let key = event.key;
      let data = event.data;
      // let camelKey = this.toCamelCase(data);
      formUtils.eachComponent(this.form.components, function (component) {
        if (component.type == 'myCustomSelect' && component.key == key) {
          component.data.values.push({ label: data, value: data });
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
  toCamelCase(str) {
    return str
      .replace(/\s(.)/g, function ($1) { return $1.toUpperCase(); })
      .replace(/\s/g, '')
      .replace(/^(.)/, function ($1) { return $1.toLowerCase(); });
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
    if (this.allowAnms) {
      this.formCreationService
        .getSubmittedReportByFormReportIdUnAuth(this.getFormModel)
        .subscribe((result: any) => {
          if (result.success) {
            if (result.data != null && result.data.length > 0) {
              this.formModelDetails = result.data[0];
              const genericFormDetails = result.data[0].formJson;
              this.uniqueNumber = this.formModelDetails.uniqueNumber;
              this.isApproved = this.formModelDetails.isApproved;
              let parseDetails = JSON.parse(genericFormDetails);
              if (this.dateComponent) {
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
              this.isNewRecord = true;
              this.customApplicationsLoaded = true;
              this.formDataLoaded = true;
              this.isEdit = false;
            }

          } else {
            this.customApplicationsLoaded = true;
            this.formDataLoaded = true;
            this.isEdit = false;
          }
          this.cdRef.detectChanges();
        });

    }
    else {
      this.formCreationService
        .getSubmittedReportByFormReportId(this.getFormModel)
        .subscribe((result: any) => {
          if (result.success) {
            if (result.data != null && result.data.length > 0) {
              this.formModelDetails = result.data[0];
              const genericFormDetails = result.data[0].formJson;
              this.uniqueNumber = this.formModelDetails.uniqueNumber;
              this.isApproved = this.formModelDetails.isApproved;
              let parseDetails = JSON.parse(genericFormDetails);
              if (this.dateComponent) {
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
              this.isNewRecord = true;
              this.customApplicationsLoaded = true;
              this.formDataLoaded = true;
              this.isEdit = false;
            }

          } else {
            this.customApplicationsLoaded = true;
            this.formDataLoaded = true;
            this.isEdit = false;
          }
          this.cdRef.detectChanges();
        });
    }
  }

  getCustomApplication(id, formId) {
    console.log('in ca m', id, formId);
    if (id != null && id != undefined && formId != null && formId != undefined) {
      this.formOutput = { components: [] };
      this.customApplicationSearchModel = new CustomApplicationSearchModel();
      this.customApplicationSearchModel.customApplicationId = id;
      this.customApplicationSearchModel.formId = formId;
      this.formCreationService.getCustomApplication(this.customApplicationSearchModel).subscribe((result: any) => {
        if (result.data && result.data.length > 0) {
          this.applicationForms = result.data[0];
          this.formName = result.data[0].customApplicationName;
          //this.allowAnnonymous = result.data[0].allowAnnonymous;
          // this.formBgColor = result.data[0].formBgColor;
          this.dataSourceId = result.data[0].dataSourceId;
          this.recordPermissionKey = result.data[0].recordLevelPermissionFieldName;
          this.conditionalEnum = result.data[0].conditionalEnum;
          if(result.data[0].stageScenariosJson) {
            this.stages = JSON.parse(result.data[0].stageScenariosJson);
          } else {
            this.stages = [];
          }
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

                if (updatedModel["type"] == "myfileuploads") {
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
            this.form = this.disableTexbox(this.form);
            if ((this.form && !this.applicationForms?.editForm) || !this.isEditMains) {
              formUtils.eachComponent(this.form.components, function (component) {
                component.disabled = true;
              }, true);
            }
            if (this.form) {
              this.getFormDetails(formId);
            }
          }
        } else {
          this.formName = this.formInputDetails.formName;
          this.allowAnms = false;
          this.form = JSON.parse(this.formInputDetails.formJson);
          this.form = this.getcaseObj(this.formOutput);
          this.form = this.disableTexbox(this.form);
          let keyName;
          if ((this.form && !this.applicationForms?.editForm) || !this.isEditMains) {
            formUtils.eachComponent(this.form.components, function (component) {
              component.disabled = true;
              if (component.type == "datetime") {
                keyName = component.key;
              }
            }, true);
          }
        }
        // this.disableTexbox();
        if (this.genericFormSubmittedId != null && this.genericFormSubmittedId != undefined && !this.isNewRecord) {
          let keyName;
          formUtils.eachComponent(this.form.components, function (component) {
            if (component.type == "datetime") {
              keyName = component.key;
            }
          }, true);
          this.keyName = keyName;
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
    this.formCreationService
      .GetGenericForms(getFormModel)
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
    formUtils.eachComponent(this.form.components, function (component, path) {
      //code for new lookup child
      if (component.type == "datetime" && dt[path] == null) {
        dt[path] = "";
      }
    }, false);
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
    //new lookupchild
    let lookups = [];
    formUtils.eachComponent(this.form.components, function (component, path) {
      //code for new lookup child
      if (component.type == "mylookup") {
        lookups.push({ key: component.key, path: path });
      }
    }, true);
    if (lookups.length > 0) {
      lookups.forEach(element => {
        let path = this.findPathsToKey({ obj: this.submittedData, key: element.key });
        if (path && path.length > 0) {
          let paths = path.filter(x => !x.includes('lookupchilddata'));
          paths.forEach(el => {
            let value = _.get(this.submittedData, el, '');
            let lookupchilddata = _.get(this.submittedData, element.key + value + 'lookupchilddata', '');
            let val = { value: value, lookupchilddata: lookupchilddata };
            _.set(this.submittedData, el + 'lookup', val);
          });
        }
      });
    }
    this.tempSubmissionData = JSON.parse(JSON.stringify(this.submittedData));
    // console.log('data:', this.submittedData);
    this.genericForm.status = this.status;
    this.genericForm.formJson = JSON.stringify(this.submittedData);
    let workflowsList = this.workflowsList;
    workflowsList.forEach((flow) => {
      var jsonItems = JSON.parse(flow.dataJson.workflowItems);
      if(this.isNewRecord) {
        let filteredList = _.filter(jsonItems, function (item) {
          return item.type == 1 && ((flow.dataJson.action == "Create") || (flow.dataJson.action == "Create Or Edit"))
        })
        if(filteredList.length > 0) {
          this.message = filteredList[0].message;
          this.subject = filteredList[0].subject;
        }
      } else {
        let filteredList = _.filter(jsonItems, function (item) {
          return item.type == 1 && ((flow.dataJson.action == "Edit") || (flow.dataJson.action == "Create Or Edit") || (flow.dataJson.action == "Field Update"))
        })
        if(filteredList.length > 0) {
          this.message = filteredList[0].message;
          this.subject = filteredList[0].subject;
        }
      }
     
    })
    let notificationWorkflows = this.notificationWorkflows;
    notificationWorkflows.forEach((flow) => {
      var jsonItems = JSON.parse(flow.dataJson.workflowItems);
      if(this.isNewRecord) {
        let filteredList = _.filter(jsonItems, function (item) {
          return item.type == 21 && ((flow.dataJson.action == "Create") || (flow.dataJson.action == "Create Or Edit"))
        })
        if(filteredList.length > 0) {
          this.notificationMessage = filteredList[0].notificationText;
        }
      } else {
        let filteredList = _.filter(jsonItems, function (item) {
          return item.type == 21 && ((flow.dataJson.action == "Edit") || (flow.dataJson.action == "Create Or Edit") || (flow.dataJson.action == "Field Update"))
        })
        if(filteredList.length > 0) {
          this.notificationMessage = filteredList[0].notificationText;
        }
      }
     
    })
    let keys = this.formKeysList.map(x=>x.key);
    keys.forEach((key1) => {
      if (this.subject && this.subject.includes(key1)) {
        this.subject = this.subject.replace("##" + key1 + "##", this.submittedData[key1]);
      }
      if(this.message && this.message.includes(key1)){
        this.message = this.message.replace("##" + key1 + "##", this.submittedData[key1]);
      }
      if(this.notificationMessage && this.notificationMessage.includes(key1)){
        this.notificationMessage = this.notificationMessage.replace("##" + key1 + "##", this.submittedData[key1]);
      }
    })
    if (this.recordPermissionKey) {
      let submittedKeyValue = this.submittedData[this.recordPermissionKey];
      var obj = {};
      if (Array.isArray(submittedKeyValue)) {
        let commaSeperatedValue = submittedKeyValue.join(",");
        obj[this.recordPermissionKey] = commaSeperatedValue;
        this.genericForm.recordAccessibleUsers = commaSeperatedValue;
      }
      else {
        obj[this.recordPermissionKey] = submittedKeyValue;
        this.genericForm.recordAccessibleUsers = submittedKeyValue;
      }
    }
    this.genericForm.conditionalEnum = this.conditionalEnum;
    this.genericForm.stagesScenarios = this.stages;
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
      //this.genericForm.isApproved = this.isApproved;
    }

    if (this.genericFormSubmittedId && !this.isNewRecord) {
      this.genericForm.genericFormSubmittedId = this.genericFormSubmittedId;
      this.genericForm.timeStamp = this.formModelDetails.timeStamp;
      this.genericForm.dataSetId = this.formModelDetails.dataSetId;
      this.genericForm.uniqueNumber = this.uniqueNumber;
    }

    this.genericForm.workflowMessage = this.message;
    this.genericForm.workflowSubject = this.subject;
    this.genericForm.notificationMessage = this.notificationMessage;

    if (this.allowAnms == true) {
      this.formCreationService.submitGenericApplicationUnAuth(this.genericForm).subscribe((result: any) => {
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
        if (this.isPageRedirect) {
          this.refreshForm.emit({
            form: this.form,
            submission: {
              data: this.submission.data
            }
          });
          //this.getCustomApplication(this.customApplicationId, this.formIds);
        }

      })

    }
    else {
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
        if (this.isPageRedirect) {
          this.refreshForm.emit({
            form: this.form,
            submission: {
              data: this.submission.data
            }
          });
          //this.getCustomApplication(this.customApplicationId, this.formIds);
        }

      })
    }
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
                if (y.referenceId == "466ae1aa-6a42-414e-b5b6-3ddadc87d81f") {
                  this.submittedData[y.referenceTypeName] = y.filePath;
                }
                else {
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
    var permissionComponents = ['textfield', 'textarea', 'number', 'select', 'button', 'phoneNumber', 'currency', 'signature', 'myfileuploads', 'myCustomSelect', 'table', 'well', 'address'];
    inputFormJson = inputFormJson;
    console.log(inputFormJson, 'beforeper')
    inputFormJson = this.getObjectsForperm(inputFormJson, 'type', this.userId, false, ['textfield', 'textarea', 'number', 'password', 'checkbox', 'selectboxes', 'select', 'radio', 'button', 'email', 'url', 'phoneNumber', 'tags', 'address', 'mydatetime', 'mylinkdatetime', 'datetime', 'day', 'time', 'currency', 'survey', 'signature', 'myfileuploads', 'mylookup', 'fieldconcatenation', 'myrq', 'myCustomSelect', 'htmlelement', 'content', 'columns', 'fieldset', 'panel', 'table', 'tabs', 'well', 'container', 'datamap', 'datagrid', 'editgrid', 'tree']);
    return inputFormJson;
    // var inputFormJson = this.form;
    // for (var i = 0; i < inputFormJson.components.length; i++) {
    //   if (inputFormJson.components[i].userView) {
    //     for (var j = 0; j < inputFormJson.components[i].userView.length; j++) {
    //       if (inputFormJson.components[i].userView[j].toLowerCase() == this.userId.toLowerCase()) {
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
          obj['hidden'] = !obj['userView'].includes(this.userId);
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
        if (component.type == 'button' && !component.action) {
          component.action = 'submit';
        }
        if (component.type == "datetime" || component.type == "mydatetime" || component.type == "mylinkdatetime") {
          component.format = component?.widget?.format;
        }
        if (component.elseLogic == true && component.logic && component.logic.length > 0) {
          var trigger = { type: 'javascript', javascript: "" };
          var actions = [{ name: "elseAction", type: "value", value: `value = ${component.valueForElse}` }];
          var logic = { name: 'else' };
          var logicJsStr = "result = ";
          var coms = component.logic.filter(x => (x.name != 'emptyOrNull' && x.name != 'else'));
          coms.forEach((l: any, i: any) => {
            if (l.trigger.type == "simple" && l.name != "emptyOrNull") {
              i == (coms.length - 1) ? logicJsStr = logicJsStr + `(data.${l.trigger.simple.when} != ${l.trigger.simple.eq})` : logicJsStr = logicJsStr + `(data.${l.trigger.simple.when} != ${l.trigger.simple.eq}) && `;
            } else if (l.trigger.type == "javascript" && l.name != "emptyOrNull") {
              i == (coms.length - 1) ? logicJsStr = logicJsStr + `(!(${l.trigger.javascript.charAt(l.trigger.javascript.length - 1) == ";" ? l.trigger.javascript.substring(0, l.trigger.javascript.length - 1) : l.trigger.javascript}))` : logicJsStr = logicJsStr + `(!(${l.trigger.javascript.charAt(l.trigger.javascript.length - 1) == ";" ? l.trigger.javascript.substring(0, l.trigger.javascript.length - 1) : l.trigger.javascript})) && `;
            }
          });
          trigger.javascript = logicJsStr;
          logic['trigger'] = trigger;
          logic['actions'] = actions;
          if (!(component.logic.find(x => x.name == 'else'))) {
            component.logic.push(logic);
          } else {
            var index = component.logic.findIndex(x => x.name == 'else');
            component.logic[index] = logic;
          }
        }
        if (component.emptyOrNull == true && component.logic && component.logic.length > 0) {
          var trigger = { type: 'javascript', javascript: "" };
          var actions = [{ name: "EmptyOrNullAction", type: "value", value: `value = ${component.valueForEmptyOrNull}` }];
          var logic = { name: 'emptyOrNull' };
          var logicJsStr = "result = ";
          var datas = [];
          component.logic.forEach((l: any, i: any) => {
            if (l.trigger.type == "simple" && l.name != "else" && l.name != "emptyOrNull") {
              datas.push(`data.${l.trigger.simple.when}`);
            } else if (l.trigger.type == "javascript" && l.name != "else" && l.name != "emptyOrNull") {
              var arr = [];
              arr = l.trigger.javascript.split(" ")?.filter(x => x.includes("data."));
              datas.push(...arr);
            }
          });
          datas = [...new Set(datas)]
          if (datas.length > 0) {
            datas.forEach((l: any, i: any) => {
              i == (datas.length - 1) ? logicJsStr = logicJsStr + `(${l} == null || ${l} == undefined || ${l} == "")` : logicJsStr = logicJsStr + `(${l} == null || ${l} == undefined || ${l} == "") && `;
            });
            trigger.javascript = logicJsStr;
            logic['trigger'] = trigger;
            logic['actions'] = actions;
            if (!(component.logic.find(x => x.name == 'emptyOrNull'))) {
              component.logic.push(logic);
            } else {
              var index = component.logic.findIndex(x => x.name == 'emptyOrNull');
              component.logic[index] = logic;
            }
          }
        }
        formKeys.push({ key: component.key, label: component.label, type: component.type, delimiter: component.delimiter, requireDecimal: component.requireDecimal, decimalLimit: component.decimalLimit, format: (component.type == 'datetime' || component.type == 'mydatetime' || component.type == 'mylinkdatetime') ? component?.widget?.format : undefined });
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
            this.isUpdateGenericForm = false;
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

  findPathsToKey(options) {
    const results = [];
    (function findKey({
      key,
      obj,
      pathToKey,
    }) {
      const oldPath = `${pathToKey ? pathToKey + "." : ""}`;
      if (obj.hasOwnProperty(key)) {
        results.push(`${oldPath}${key}`);
      }
      if (obj !== null && typeof obj === "object" && !Array.isArray(obj)) {
        for (const k in obj) {
          if (obj.hasOwnProperty(k)) {
            if (Array.isArray(obj[k])) {
              for (let j = 0; j < obj[k].length; j++) {
                findKey({
                  obj: obj[k][j],
                  key,
                  pathToKey: `${oldPath}${k}[${j}]`,
                });
              }
            }

            if (obj[k] !== null && typeof obj[k] === "object") {
              findKey({
                obj: obj[k],
                key,
                pathToKey: `${oldPath}${k}`,
              });
            }
            continue;
          }
        }
      }
    })(options);
    return results;
  }

  getAllFormKeys() {
    this.formCreationService.getFormKeysByFormId(this.formIds).subscribe((genericFormKeys: any) => {
      const formAllKeys = genericFormKeys.data;
      this.formKeysList = formAllKeys;
    });
  }

  getAllWorkflows() {
    var searchModel: any = {};
    searchModel.isArchived = false;
    searchModel.formIds = this.formIds;
    this.formCreationService.getWorkflows(searchModel).subscribe((response: any) => {
      let workflowsList = response.data;
      this.getMailWorkflows(workflowsList);
      this.getNotificationWorkflows(workflowsList);
    })
  }

  getMailWorkflows(workflows) {
    workflows.forEach((flow) => {
      let workflowItems = JSON.parse(flow.dataJson.workflowItems);
      let filteredList = _.filter(workflowItems, function (item) {
        return item.type == 1
      })
      if (filteredList.length > 0) {
        this.workflowsList.push(flow);
      }
    })
  }

  getNotificationWorkflows(workflows) {
    workflows.forEach((flow) => {
      let workflowItems = JSON.parse(flow.dataJson.workflowItems);
      let filteredList = _.filter(workflowItems, function (item) {
        return item.type == 21
      })
      if (filteredList.length > 0) {
        this.notificationWorkflows.push(flow);
      }
    })
  }

}
