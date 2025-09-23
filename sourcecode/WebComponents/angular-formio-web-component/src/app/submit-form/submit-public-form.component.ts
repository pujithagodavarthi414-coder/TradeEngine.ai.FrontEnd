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
import { FormBuilderService } from '../services/formBuilderService';

@Component({
  selector: 'app-submit-public-form-component',
  templateUrl: './submit-public-form.component.html'
})
export class SubmitPublicFormComponent {
  submittedData: any;
  @ViewChild("formio") formio: any;
  customApplicationSearchModel: CustomApplicationSearchModel;
  applicationForms: any;
  isEdit: boolean;
  formDataLoaded: boolean = false;
  customApplicationsLoaded: boolean = false;
  submission: any = { data: {} };;
  
  @Input() set formJson(data: any) {
    // this.updateData(data);
    this.form = data;
    this.updateData(data);
    this.submission = {data: {}};
  }

  @Input() set customApplicationId(data: any){
    this.applicationId = data;
  }

  @Input() set submissionData(data: any){
    this.submission = {data: {}};
  }

  applicationId: any= null;
  genericFormSubmittedId: any = null;
  formIds: any;
  formSubmittedId: any = null;
  isNewRecord: boolean = false;
  fileUploadKeys: any = [];
  
  @Output() formsubmitted = new EventEmitter<any>();
  @Output() formValueChange = new EventEmitter<any>();
//   customApplicationId: any;
  formInputDetails: any;
  dataSourceId: any;
  uniqueNumber: any;
  form: any;
  formOutput: any = { components: [] };
  getFormModel = new FormSubmitted();
  formModelDetails: any;
  userId: any;
  formModel = new FormSubmitted();
  formName: any = "";
  genericForm = new FormSubmitted();
  constructor(private formService: FormService, private storeManagementService: StoreManagementService,
    private formCreationService: FormCreationService,private formBuilderService: FormBuilderService,
    private snackbar: MatSnackBar,
    private toastr: ToastrService,
    private cdRef: ChangeDetectorRef,
    private cookieService: CookieService,
    private translateService: TranslateService) {
  }

  ngOnInit() { this.userId = this.cookieService.get(LocalStorageProperties.CurrentUserId) }

  onChange(event: any) {
    if(event.data != undefined){
        this.formValueChange.emit(event);
    }
  }
  
  onSubmit(data: any) {
    // this.formsubmitted.emit(data);
    if(data.data != undefined){
        this.submittedData = data.data;
        this.formsubmitted.emit(this.submittedData);
    }
  }

    updateData(data) {
        this.formOutput = { components: [] };
        let updatedNewComponents = [];
        if (data.Components) {
            let components = data.Components;
            console.log(components);
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
                    updatedNewComponents.push(updatedModel);
                })
            }
            this.formOutput.components = updatedNewComponents;
            this.form = this.formOutput;
        }
        else if (data.components) {
            this.form = data;
        }
    }
}
