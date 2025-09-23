import { Component, OnInit, Input, Inject, ChangeDetectionStrategy, ChangeDetectorRef, ViewChild, TemplateRef, ViewChildren } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { Router, ActivatedRoute } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import * as formUtils from 'formiojs/utils/formUtils.js';
import { ConstantVariables } from "../../../globaldependencies/constants/constant-variables";
import { CustomAppBaseComponent } from "../../../globaldependencies/components/componentbase";
import { DashboardFilterModel } from "../../models/dashboardFilterModel";
import { RoleModel } from "../../models/role-model";
import { GenericFormService } from "../../services/generic-form.service";
import { CreateGenericForm } from "../../models/createGenericForm";
import { PageChangeEvent } from "@progress/kendo-angular-grid";
import { EmployeeListService } from "../../services/employee-list.service";
import { EmployeeFieldsModel } from "../../models/employee-fields.model";
import { CustomFormFieldModel } from "../../models/custom-form-field.model";
import { SoftLabelPipe } from "../../pipes/softlabels.pipes";
import { LocalStorageProperties } from "../../../globaldependencies/constants/localstorage-properties";
const msg = ConstantVariables.FormNameMaxLength100;

@Component({
  selector: "app-form-creator",
  templateUrl: "./form-creator.component.html",
  providers: [SoftLabelPipe]
})
export class FormCreatorComponent extends CustomAppBaseComponent implements OnInit {
  employeeFields: { fieldName: string; hide: boolean; edit: boolean; mandatory: boolean; }[];
  skip: number = 0;
  pageSize: number = 15;
  gridView: { data: { fieldName: string; hide: boolean; edit: boolean; mandatory: boolean; }[]; total: number; };
  @ViewChildren("editEmployeeFieldDetailsPopover") editEmployeeFieldDetailsPopover;
  editFields: FormGroup;
  editEmployeeField: any;
  isHide: any;
  isRequired: any;
  fieldName: any;
  customFieldId: string;
  softLabels: any;
  isLoaded: boolean;
  @Input("dashboardFilters")
  set _dashboardFilters(data: DashboardFilterModel) {
    if (data && data !== undefined) {
      this.dashboardFilters = data;
    }
  }
  @Input("data")
  set _data(data: any) {
    if (data && data !== undefined) {
      this.matData = data[0];
      this.clearForm();
      this.isFromModal = this.matData.isFromModal;
      this.currentDialogId = this.matData.formPhysicalId;
      this.currentDialog = this.dialog.getDialogById(this.currentDialogId);
      this.createGenericForm = new CustomFormFieldModel();
      this.createGenericForm.moduleTypeId = 79;
      this.createGenericForm.referenceId = '21455f5f-26d2-433c-80c7-a227948763ec';
      this.createGenericForm.referenceTypeId = '21455f5f-26d2-433c-80c7-a227948763ec';
      this.genericFormService.searchCustomFields(this.createGenericForm).subscribe((result: any) => {
        if (result) {
          if (result.data.length > 0) {
            this.genericFormListDetails = result.data;
            this.customFieldId = this.genericFormListDetails[0].customFieldId;
            this.selectedFormType = this.genericFormListDetails[0].formTypeId;
            this.formName = this.genericFormListDetails[0].formName;
            this.workflowTrigger = this.genericFormListDetails[0].workflowTrigger;
            this.timeStamp = this.genericFormListDetails[0].timeStamp;
            this.isAbleToLogin.setValue(this.genericFormListDetails[0].isAbleToLogin);
            this.formObject = {};
            this.formObject.Components = JSON.parse(this.genericFormListDetails[0].formJson)
            this.forms = this.formObject;
          }

        } else {
          this.customFieldId = null;
        }
      });
    }
  }

  @ViewChild("formTypeDialogComponent") formTypeDialogComponent: TemplateRef<any>;

  matData: any;
  isFromModal: boolean = false;
  dashboardFilters: DashboardFilterModel;
  formObject: any;
  formName: string = "";
  workflowTrigger: string = "";
  formTypes: any;
  selectedFormType: any;
  timeStamp: any;
  isFormEdit: boolean = false;
  isFormCompleted: boolean = false;
  msgConst = msg;
  currentDialogId: any;

  public basicForm = { components: [] };

  public defaultForm = {
    components: [
      {
        input: true,
        tableView: true,
        inputType: "text",
        inputMask: "",
        label: "Text Field",
        key: "textField",
        placeholder: "",
        prefix: "",
        suffix: "",
        multiple: false,
        defaultValue: "",
        protected: false,
        unique: false,
        persistent: true,
        validate: {
          required: false,
          minLength: "",
          maxLength: "",
          pattern: "",
          custom: "",
          customPrivate: false
        },
        conditional: {
          show: false,
          when: null,
          eq: ""
        },
        type: "textfield",
        $$hashKey: "object:249",
        autofocus: false,
        hidden: false,
        clearOnHide: true,
        spellcheck: true
      }
    ]
  };
  selectedType = new FormControl("", [Validators.required]);
  nameFormControl = new FormControl("", [
    Validators.required,
    Validators.maxLength(100)
  ]);
  isAbleToLogin = new FormControl("", []);
  workflowTriggerField = new FormControl("", []);
  createGenericForm: CustomFormFieldModel;
  genericFormListDetails: any;
  formButtonDisable: boolean = false;
  editFormId: any;
  forms = { components: [] };
  formFromMyProfile: any;
  currentDialog: any;

  rolesList: RoleModel[];

  constructor(
    public formCreateDialog: MatDialogRef<FormCreatorComponent>,
    public dialog: MatDialog,
    private genericFormService: GenericFormService,
    private snackbar: MatSnackBar,
    private employeeService: EmployeeListService,
    private toastr: ToastrService,
    private route: Router,
    private translateService: TranslateService,
    private activatedRoute: ActivatedRoute,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    super();
    this.clearForm();
    this.getEmployeeFields();
    this.currentDialog = this.dialog.getDialogById(this.currentDialogId);
    this.createGenericForm = new CustomFormFieldModel();
  }

  ngOnInit() {
    super.ngOnInit();
    this.getSoftLabelConfigurations();
    this.activatedRoute.params.subscribe(routeParams => {
      this.createGenericForm = new CustomFormFieldModel();
      this.formFromMyProfile = routeParams.profile;
      this.editFormId = this.editFormId ? this.editFormId : routeParams.id;
      this.formObject = Object.assign({}, this.basicForm);
    });
  }

  onNoClick() {
    this.currentDialog.close();
  }
  public pageChange(event: PageChangeEvent): void {
    this.skip = event.skip;
    this.loadItems();
  }
  loadItems() {
    this.gridView = {
      data: this.employeeFields.slice(this.skip, this.skip + this.pageSize),
      total: this.employeeFields.length,
    };
  }
  editEmployeeFieldDetails(row, editEmployeeFieldDetailsPopover) {
    this.editEmployeeField = row;
    this.isHide = row.isHide;
    this.isRequired = row.isRequired;
    this.fieldName = row.fieldName;
    this.editFields = new FormGroup({
      isHide: new FormControl(row.isHide,
        Validators.compose([
        ])
      ),
      isRequired: new FormControl(row.isRequired,
        Validators.compose([
        ])
      ),
    });
    editEmployeeFieldDetailsPopover.openPopover();
  }
  closeFieldsDialog() {
    this.editEmployeeFieldDetailsPopover.forEach((p) => p.closePopover());
  }
  clearForm() {
    this.isHide = null;
    this.isRequired = null;
    this.editFields = new FormGroup({
      isHide: new FormControl("",
        Validators.compose([
        ])
      ),
      isRequired: new FormControl("",
        Validators.compose([
        ])
      ),
    });
  }
  upsertEmployeeFields() {
    let fieldDetails = new EmployeeFieldsModel();
    fieldDetails.id = this.editEmployeeField.id;
    fieldDetails.fieldName = this.editEmployeeField.fieldName;
    fieldDetails.isHide = this.isHide;
    fieldDetails.isRequired = this.isRequired;
    this.employeeService.upsertEmployeeFields(fieldDetails).subscribe((response: any) => {
      if (response.data) {
        this.clearForm();
        this.getEmployeeFields();
        this.editEmployeeFieldDetailsPopover.forEach((p) => p.closePopover());
      } else {

      }
      this.editEmployeeFieldDetailsPopover.forEach((p) => p.closePopover());
    })
  }
  getEmployeeFields() {
    let fieldDetails = new EmployeeFieldsModel();
    this.employeeService.getEmployeeFields(fieldDetails).subscribe((response: any) => {
      if (response.data) {
        this.employeeFields = response.data;
        this.isLoaded = true;
        this.gridView = {
          data: this.employeeFields.slice(this.skip, this.skip + this.pageSize),
          total: this.employeeFields.length,
        };
        this.clearForm();
      } else {

      }
      this.editEmployeeFieldDetailsPopover.forEach((p) => p.closePopover());
    })
  }

  onSubmit(event) {
    console.log(event);
  }

  onChange(event) {
    if (event.form != undefined) this.formObject = event.form;
  }

  checkDisable() {
    if (this.formButtonDisable == true) return false;
    if (this.selectedFormType && this.formName && this.formName.length <= 100)
      return false;
    else return false;
  }

  createAGenericForm() {
    this.formButtonDisable = true;
    this.createGenericForm = new CustomFormFieldModel();
    this.createGenericForm.moduleTypeId = 79;
    this.createGenericForm.referenceId = '21455f5f-26d2-433c-80c7-a227948763ec';
    this.createGenericForm.referenceTypeId = '21455f5f-26d2-433c-80c7-a227948763ec';
    this.createGenericForm.formName = 'add employee';
    this.createGenericForm.timeStamp = this.timeStamp;
    this.createGenericForm.customFieldId = this.customFieldId;

    var formKeys = [];
    formUtils.eachComponent(this.formObject.components, function (component) {
      formKeys.push({ key: component.key, label: component.label });
    }, false);

    this.createGenericForm.formJson = JSON.stringify(this.formObject);
    this.createGenericForm.formKeys = JSON.stringify(formKeys);
    this.genericFormService
      .updatecustomField(this.createGenericForm)
      .subscribe((response: any) => {
        if (response.success == true) {
          this.snackbar.open(this.translateService.instant(ConstantVariables.FormUpdationMessage), "ok", {
            duration: 3000
          });
          this.currentDialog.close();
          this.onNoClick();
        }
        if (response.success == false) {
          this.formButtonDisable = false;
          var validationmessage = response.apiResponseMessages[0].message;
          this.toastr.error(validationmessage);
        }
      });
  }

  emitEvent(event) {
    this.formObject = event.detail;
  }
  getEdit(dataItem) {
    if (dataItem != undefined)
      return dataItem.isEdit;
  }
  getSoftLabelConfigurations() {
    if (localStorage.getItem(LocalStorageProperties.SoftLabels)) {
      this.softLabels = JSON.parse(localStorage.getItem(LocalStorageProperties.SoftLabels));
    }
  }
}
