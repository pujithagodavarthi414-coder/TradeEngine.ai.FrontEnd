import { Component, OnInit, ViewChild, ElementRef, ViewChildren, Input, Output, EventEmitter, ComponentFactoryResolver, Compiler, NgModuleRef, NgModuleFactoryLoader, NgModuleFactory, ViewContainerRef, TemplateRef, ChangeDetectorRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {  MatMenuTrigger } from '@angular/material/menu';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { SatPopover } from '@ncstate/sat-popover';
import { ViewformComponent } from './create-form/viewform.component';
import { EditFormDataComponent } from './edit-form-data/edit-form-data.component';
import { GenericFormService } from './services/generic-form.service';
import { CreateGenericForm } from './models/createGenericForm';
import '../../../globaldependencies/helpers/fontawesome-icons';
import { CustomAppBaseComponent } from "../../../globaldependencies/components/componentbase";
import { DatePipe } from '@angular/common';
import { Observable } from 'rxjs';
import { ConstantVariables } from '../../../globaldependencies/constants/constant-variables';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { DashboardFilterModel } from '../../models/dashboard-filter.model';
import { FormCreatorComponent } from './create-form/form-creator.component';
import { BuilderModulesService } from '../../services/builder.modules.service';
import * as _ from 'underscore';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import * as formUtils from 'formiojs/utils/formUtils.js';
import * as $_ from 'jquery';
import { GenericFormType } from './models/generic-form-type-model';
import { LocalStorageProperties } from '../../../globaldependencies/constants/localstorage-properties';
const $ = $_;

@Component({
    selector: 'app-genericform',
    templateUrl: './genericform.component.html'
})

export class GenericformComponent extends CustomAppBaseComponent implements OnInit {
    selectedFormIds: string[] = [];
    selectedForms: any[] = [];
    injector: any;
    duplicateViewRoleIds: any;
    duplicateEditRoleIds: any;
    userRoles:any;
    userModel : any;

    @Input("dashboardFilters")
    set _dashboardFilters(data: DashboardFilterModel) {
        if (data && data !== undefined) {
            this.dashboardFilters = data;
        }
    }

    @Input("searchText")
    set _searchText(data) {
        this.searchText = data;
        this.formTypeId = data;
        this.isFormTypeSearch = true;
        if (!this.temp) {
             this.createGenericForm = new CreateGenericForm();
            // this.getFormsDetails();
             this.getFormTypeName();

        } else {
            this.filterByName(null);
            this.getFormTypeName();
        }
    }


    @Input("isFromWizard")
    set _isFromWizard(data: boolean) {
        this.isFromWizard = data;
    }

    @Input("selectedFormIds")
    set _selectedFormIds(data: string[]) {
        this.selectedFormIds = data;
    }

    @Input("dashboardId")
    set _dashboardId(data: string) {
        if (data != null && data !== undefined && data !== this.dashboardId) {
            this.dashboardId = data;           
        }
    }

    @Output() closeFormSearch = new EventEmitter<boolean>();
    @Output() selectForm = new EventEmitter<any>();
    @Output() onFormType = new EventEmitter<any>();

    isFromWizard: boolean;
    dashboardFilters: DashboardFilterModel;
    @ViewChild('json') jsonElement?: ElementRef;
    @ViewChild(MatMenuTrigger) trigger: MatMenuTrigger;
    @ViewChild("archiveForm") archiveFormPopover: SatPopover;
    @ViewChildren('archiveFormPopover') archiveFormsPopover;
    @ViewChild('formDialogComponent') formCreatorComponentDialog: TemplateRef<any>;
    @ViewChild('viewFormDialogComponent') viewFormDialogComponent: TemplateRef<any>;
    @ViewChild('editFormDataDialogComponent') editFormDataDialogComponent: TemplateRef<any>;
    isAnyOperationIsInprogress: boolean;
    formTypeId: string;
    Arr = Array;
    num: number = 8;
    public form: Object = {
        components: []
    };
    public formJson;
    showCreateForm: any;
    formSrc: any;
    viewFormNew: any;
    formsSearch: string;
    formName: string;
    formId: string;
    searchText: string;
    submittedGenericForms = [];
    createGenericForm: CreateGenericForm;
    genericFormListDetails: any[];
    temp: CreateGenericForm[];
    getFormDetails: CreateGenericForm;
    customApplicationsDialogId: string = 'more-application-popup';
    roleFeaturesIsInProgress$: Observable<boolean>;

    duplicateFormTypeId: string;
    duplicateFormJson: string;
    duplicateIsAbleToLogin: any;
    duplicateWorkflowTrigger: string;

    genericForms = [];
    formtypes: any[] = [];
    confirmationMessage: string;
    canDelete: boolean;
    formsExisted: boolean;
    appsLoadingInProgress = false;
    customApplications: string[] = [];
    isFormTypeSearch = false;
    duplicateFormGroup: FormGroup;
    dashboardId: string;
    fullHeight: boolean = false;

    @ViewChildren("duplicateFormPopover") duplicateFormPopovers;
    @ViewChildren("archiveForm") archivePopovers;
    @ViewChildren('formMenu') formMenuPopovers;
    @ViewChild("openApplicationsPopup") openApplicationsPopup: TemplateRef<any>;

    constructor(public dialog: MatDialog,
        public genericFormService: GenericFormService,
        private snackbar: MatSnackBar,
        private routes: Router,
        private cdRef: ChangeDetectorRef,
        private translateService: TranslateService,
        private toastr: ToastrService,
        private cfr2: ComponentFactoryResolver,
        private compiler: Compiler,
        private _m: NgModuleRef<any>,
        private vcr: ViewContainerRef,
        private ngModuleFactoryLoader: NgModuleFactoryLoader,
        private builderModulesService: BuilderModulesService,
        private router: Router
    ) {
        super();
        this.injector = this.vcr.injector;

        var userModel = JSON.parse(localStorage.getItem(LocalStorageProperties.UserModel));
         if(userModel)
         {
            this.userRoles= userModel.roleIds;
         }
        this.getFormTypes();
    }

    ngOnInit() {
        super.ngOnInit();
        if(this.router.url.includes('/statusreportssettings')) {
            this.dashboardId = null;
            this.fullHeight = false;
        }
        if(this.router.url.includes('/dashboard-management/widgets')) {
            this.dashboardId = null;
            this.fullHeight = true;
        }
        this.createGenericForm = new CreateGenericForm();
        this.getFormsDetails();
        this.isAnyOperationIsInprogress = true;
        this.duplicateFormGroup = new FormGroup({
            formName: new FormControl(null,
                Validators.compose([
                    Validators.required,
                    Validators.maxLength(100)
                ])
            )
        });
         
    }

    getFormTypes() {
        var genericFormTypeModel = new GenericFormType();
        genericFormTypeModel.isArchived = false;
        this.genericFormService.getAllFormTypes(genericFormTypeModel).subscribe((result: any) => {
          this.formtypes = result.data;
        });
    }

    isSelected(formId) {
        if (this.selectedFormIds.findIndex((p) => p.toLowerCase() === formId.toLowerCase()) > -1) {
            return true;
        } else {
            return false;
        }
    }

    pickForm(form) {
        if (this.isFromWizard) {
            form.formId = form.id;
            const formIndex = this.selectedFormIds.findIndex((p) => p.toLowerCase() === form.id.toLowerCase())
            if (formIndex > -1) {
                this.selectedFormIds.splice(formIndex, 1);
            } else {
                this.selectedFormIds.push(form.id);
            }
            this.selectedForms = [];
            this.selectedFormIds.forEach((formId) => {
                const selectedIndex = this.genericFormListDetails.findIndex((p) => p.id.toLowerCase() == formId.toLowerCase());
                if (selectedIndex > -1) {
                    this.genericFormListDetails[selectedIndex].formId = this.genericFormListDetails[selectedIndex].id;
                    this.selectedForms.push(this.genericFormListDetails[selectedIndex]);
                }
            })
            this.selectForm.emit(this.selectedForms);
        } else {
            if(this.checkFormViewPermission(form))
            {
            this.viewForm(form);
            }
        }
    }

    viewForm(row) {        
        this.formMenuPopovers.forEach((p) => p.close());
        this.showCreateForm = false;
        this.formSrc = JSON.parse(row.formJson);
        this.viewFormNew = true;
        let formId = "view-form-dialog";
        const dialogRef = this.dialog.open(this.viewFormDialogComponent, {
            width: '90%',
            height: '90vh',
            hasBackdrop: true,
            direction: 'ltr',
            disableClose: true,
            id: formId,
            data: { formSrc: this.formSrc, formId:row.id, formName: row.formName, formPhysicalId: formId }
        });

        dialogRef.afterClosed().subscribe(() => {
            console.log('The dialog was closed');
        });
    }

    closeArchivePopovers() {
        this.archivePopovers.forEach((p) => p.close());
    }

    createOrEditForm(formId) {
        this.formMenuPopovers.forEach((p) => p.close());
        const dialogRef = this.dialog.open(this.formCreatorComponentDialog, {
            width: "95vw",
            height: "90vh",
            maxWidth: "95vw",
            disableClose: true,
            id: "form-create-dialog",
            data: { isFromModal: true, formId: formId, formPhysicalId: "form-create-dialog" }
        });

        dialogRef.afterClosed().subscribe(result => {
            //console.log(result);
            this.onFormType.emit();
            this.getFormsDetails();
        });

    };

    editFormData(row) {
        this.showCreateForm = false;
        this.formSrc = JSON.parse(row.FormFields);
        this.formJson = JSON.parse(row.FormJSON);
        this.viewFormNew = true;
        let formId = "edit-form-data-component";
        const dialogRef = this.dialog.open(this.editFormDataDialogComponent, {
            width: '50%',
            id: formId,
            data: { formSrc: this.formJson, formFields: this.formSrc, formPhysicalId: formId }
        });

        dialogRef.afterClosed().subscribe(result => {
            var time = new Date();
            var a = {
                No: (this.submittedGenericForms.length + 1).toString(),
                FormName: row.FormName,
                SubmittedTime: time,
                FormJSON: JSON.stringify(result.formJson),
                FormFields: JSON.stringify(result.formFields)
            }
            this.submittedGenericForms.push(a);
            this.submittedGenericForms = [...this.submittedGenericForms];
        });
    }

    openApplications(applications) {
        const dialogRef = this.dialog.open(this.openApplicationsPopup, {
            width: "25vw",
            maxHeight: "50vh",
            disableClose: true,
            id: this.customApplicationsDialogId,
            data: { items: applications }
        });
    }

    onNoClick() {
        let dialog = this.dialog.getDialogById(this.customApplicationsDialogId);
        dialog.close();
    }

    archiveOrUnarchiveForm() {
        this.getFormDetails.IsArchived = true;
        this.genericFormService.UpsertGenericForm(this.getFormDetails).subscribe((response: any) => {
            if (response.success) {
                this.getFormDetails = response.data;
                this.archivePopovers.forEach((p) => p.close());
                this.formMenuPopovers.forEach((p) => p.close());
                this.createGenericForm = new CreateGenericForm();
                this.getFormsDetails();
                this.snackbar.open(this.translateService.instant(ConstantVariables.FormDeletionMessage), "Ok", { duration: 3000 });
            }
            else {
                let validationMessage = response.apiResponseMessages[0].message;
                this.toastr.error(validationMessage);
            }
        });
    }

    getFormsDetails() {
        this.createGenericForm.isInludeTemplateForms = false ;
        this.genericFormService.GetGenericForms(this.createGenericForm).subscribe((result: any) => {
            this.genericFormListDetails = this.loadFormApplications(result.data);
            this.temp = this.genericFormListDetails;
            if (this.searchText) {
                this.filterByName(this.searchText);
            }
            this.isAnyOperationIsInprogress = false
            this.formsExisted = true;
            this.cdRef.detectChanges();
        })
    }

    loadFormApplications(formsList) {
        this.genericFormListDetails = [];
        formsList.forEach(element => {
            var model = new CreateGenericForm();
            model = element;
            model.customApplicationNames = element.customApplications ? element.customApplications.split(',') : null;

            this.genericFormListDetails.push(model);
        });
        return this.genericFormListDetails;
    }

    actionArchive(form, archivePopover) {
        archivePopover.openPopover();
        this.getFormDetails = new CreateGenericForm();
        this.getFormDetails.Id = form.id;
        this.getFormDetails.FormTypeId = form.formTypeId;
        this.getFormDetails.formName = form.formName;
        this.getFormDetails.formJson = form.formJson;
        this.getFormDetails.TimeStamp = form.timeStamp;
        this.getFormDetails.dataSourceId = form.dataSourceId;
        this.getFormDetails.ArchivedDateTime = form.archivedDateTime;
        this.confirmationMessage = 'Are you sure want to delete this form?';
        this.formMenuPopovers.forEach((p) => p.close());
    }

    GetFormslist() {
        this.createGenericForm = new CreateGenericForm();
        this.createGenericForm.formName = this.formsSearch;
        this.getFormsDetails();
    }

    onChange(event) {
        this.formJson = event.form;
    }

    filterByName(event) {
        console.log(event);
        if (this.isFormTypeSearch && this.temp) {
            const temp = this.temp.filter(genericForm => (genericForm.fields && genericForm.fields && genericForm.fields.FormTypeId &&  genericForm.fields.FormTypeId.toString().toLowerCase().indexOf(this.searchText.toString().toLowerCase()) > -1))

            if (temp != null && temp.length > 0) {
                this.formsExisted = true;
            }
            else {
                this.formsExisted = false;
            }
            this.genericFormListDetails = temp;
            this.isFormTypeSearch = false;
        }
        else {
            let datePipe: DatePipe = new DatePipe('en-US');
            let rowValue = this.temp[0].createdDateTime;
            let value = datePipe.transform(rowValue, 'dd-MMM-yyyy').toString().slice(0, 10);
            console.log(value);
            const temp = this.temp.filter(genericForm => (genericForm.formTypeName && genericForm.formTypeName.toString().toLowerCase().indexOf(this.searchText.toString().toLowerCase()) > -1)
                || (genericForm.formName.toString().toLowerCase().indexOf(this.searchText.toString().toLowerCase()) > -1)
                || (datePipe.transform(genericForm.createdDateTime, 'dd-MMM-yyyy').toString().toLowerCase().slice(0, 11).toLowerCase().indexOf(this.searchText.trim()) > -1))

            if (temp != null && temp.length > 0) {
                this.formsExisted = true;
            }
            else {
                this.formsExisted = false;
            }
            this.genericFormListDetails = temp;
        }
    }

    closeSearch() {
        this.searchText = '';
        this.filterByName(null);
        this.closeFormSearch.emit(true);
    }


    openDuplicateFormPopover(form, duplicateFormPopover) {
        this.duplicateFormTypeId = form.formTypeId;
        this.duplicateFormJson = form.formJson;
        this.duplicateIsAbleToLogin = form.isAbleToLogin;
        this.duplicateWorkflowTrigger = form.workflowTrigger;
        this.duplicateViewRoleIds = form.viewFormRoleIds;
        this.duplicateEditRoleIds = form.editFormRoleIds;
        this.duplicateFormGroup = new FormGroup({
            formName: new FormControl(null,
                Validators.compose([
                    Validators.required,
                    Validators.maxLength(100)
                ])
            )
        });
        duplicateFormPopover.openPopover();
        this.formMenuPopovers.forEach((p) => p.close());
    }

    getFormTypeName() {
        let formTypes = this.formtypes;
        let formTypeId = this.formTypeId;
        let filteredList = _.filter(formTypes, function(form) {
            return form.formTypeId == formTypeId
        })
        if(filteredList.length > 0) {
            this.searchText = filteredList[0].formTypeName;
            this.cdRef.detectChanges();
        }
    }

    insertDuplicateForm() {
        const createGenericForm = new CreateGenericForm();
        createGenericForm.FormTypeId = this.duplicateFormTypeId;
        createGenericForm.formName = this.duplicateFormGroup.controls["formName"].value;
        createGenericForm.workflowTrigger = this.duplicateWorkflowTrigger;
        createGenericForm.isAbleToLogin = this.duplicateIsAbleToLogin;
        createGenericForm.viewFormRoleIds = this.duplicateViewRoleIds;
        createGenericForm.editFormRoleIds = this.duplicateEditRoleIds;
        var formKeys = [];
        var formc = JSON.parse(this.duplicateFormJson);
        formUtils.eachComponent(formc.components ? formc.components : formc.Components, function (component, path) {
            formKeys.push({ key: component.key, label: component.label, type: component.type, delimiter: component.delimiter, requireDecimal: component.requireDecimal, decimalLimit: component.decimalLimit, format: ( component.type == 'datetime' || component.type == 'mydatetime' || component.type == 'mylinkdatetime')? component?.widget?.format : undefined, path: path  });
        }, true);

        createGenericForm.formJson = formc.components ? formc.components : formc.Components;
        createGenericForm.formKeys = JSON.stringify(formKeys);
        this.genericFormService.UpsertGenericForm(createGenericForm)
            .subscribe((response: any) => {
                if (response.success == true) {
                    this.closeDuplicateFormDialog();
                    this.createGenericForm = new CreateGenericForm();
                    this.getFormsDetails();
                    this.snackbar.open(this.translateService.instant(ConstantVariables.FormCreationMessage), "ok", {
                        duration: 3000
                    });
                } else {
                    this.toastr.error(response.apiResponseMessages[0].message);
                }
            });
    }

    closeDuplicateFormDialog() {
        this.duplicateFormPopovers.forEach((p) => p.closePopover());
    }
    checkFormViewPermission(form): boolean { 
        if (this.userRoles && form.viewFormRoleIds) {
            for (let item of form.viewFormRoleIds) {
                if (this.userRoles.toLowerCase().includes(item)) {
                    return true;
                }
            }
        }
        if (this.userRoles && form.editFormRoleIds) {
            for (let item of form.editFormRoleIds) {
                if (this.userRoles.toLowerCase().includes(item)) {
                    return true;
                }
            }
        }
        if (form.viewFormRoleIds == null || form.viewFormRoleIds.length == 0) {
            return true;
        }
        return false;
    }

    editFormViewPermission(form): boolean {
        if (this.userRoles && form.editFormRoleIds) {
            for (let item of form.editFormRoleIds) {
                if (this.userRoles.toLowerCase().includes(item)) {
                    return true;
                }
            }
        }
        if (form.editFormRoleIds == null || form.editFormRoleIds.length == 0) {
            return true;
        }
        return false;
    }
}
