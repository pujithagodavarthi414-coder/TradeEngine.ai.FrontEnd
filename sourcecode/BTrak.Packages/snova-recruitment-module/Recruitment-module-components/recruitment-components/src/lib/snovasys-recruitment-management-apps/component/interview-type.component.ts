import { Component, ViewChildren, OnInit, ChangeDetectorRef, Input, ViewChild, TemplateRef } from '@angular/core';
import { FormGroup, FormControl, Validators, FormGroupDirective } from '@angular/forms';
import { CustomAppBaseComponent } from '../../globaldependencies/components/componentbase';
import { MatDialog } from '@angular/material/dialog';
import { MatOption } from '@angular/material/core';
import { TranslateService } from '@ngx-translate/core';
import { DashboardFilterModel } from '../models/dashboardFilter.model';
import '../../globaldependencies/helpers/fontawesome-icons';
import { RecruitmentService } from '../services/recruitment.service';
import { InterviewTypeUpsertModel } from '../models/InterviewTypeUpsertModel';
import { RoleModel } from '../models/rolesdropdown.model';
import * as _ from 'underscore';
import * as $_ from 'jquery';
import { ToastrService } from 'ngx-toastr';
import { CustomFormFieldModel } from '../../snovasys-recruitment-management/models/custom-field.model';
import { CustomFieldsActionTypes, UpsertCustomFieldTriggered } from '@snovasys/snova-custom-fields';
import { Store } from '@ngrx/store';
import { State } from '../../snovasys-recruitment-management-apps/store/reducers/index';
import { Actions, ofType } from '@ngrx/effects';
import { takeUntil, tap } from 'rxjs/operators';
import { Subject } from 'rxjs';

const $ = $_;
@Component({
    selector: 'app-am-component-interview-type',
    templateUrl: `interview-type.component.html`
})

export class InterviewTypeComponent extends CustomAppBaseComponent implements OnInit {
    @ViewChildren('upsertInterviewTypePopUp') upsertInterviewTypePopover;
    @ViewChildren('deleteInterviewTypePopup') deleteInterviewTypePopover;
    @ViewChild('allRolesSelected') private allRolesSelected: MatOption;
    @ViewChild('customFormsComponent') customFormsComponent: TemplateRef<any>;
    @ViewChild('formDirective') formGroupDirective: FormGroupDirective;
    @Input('dashboardFilters')
    set _dashboardFilters(data: DashboardFilterModel) {
        if (data && data !== undefined) {
            this.dashboardFilters = data;
        }
    }

    @Input('fromRoute')
    set _fromRoute(data: boolean) {
        if (data || data === false) {
            this.isFromRoute = data; } else {
            this.isFromRoute = true; }
    }
    role: any;
    interviewTypeRoleCofigurationId: any;
    selectType: any;
    isPhone = false;
    modeOfInterview: any;
    selectRoles: FormGroup;
    roleIds: any;
    roleList: any;
    roles: any;
    rolelist: any;
    selectLocations: any;
    selectedRoles: any;
    moduleTypeId: number;
    isButtonVisible: boolean;
    isFormType: boolean;
    isEdit: boolean;
    isEditForm: boolean;
    interviewtypeId: string;
    referenceId: string;
    isrecruitment: boolean;
    dashboardFilters: DashboardFilterModel;
    isAnyOperationIsInprogress = true;
    isArchived = false;
    interviewType: InterviewTypeUpsertModel[];
    isFromRoute = false;
    validationMessage: string;
    isFiltersVisible = false;
    isThereAnError: boolean;
    interviewTypeForm: FormGroup;
    timeStamp: any;
    temp: any;
    searchText: string;
    interviewTypeId: string;
    interviewTypeName: string;
    loading = false;
    interviewTypeTitle: string;
    isVideo = false;
    color = '';
    roleId: string;
    customFormComponent: CustomFormFieldModel;
    isreload: string;
    list = [
        { id: 1, name: 'INTERVIEWTYPES.ISPHONE' },
        { id: 2, name: 'INTERVIEWTYPES.ISVIDEO' },
        { id: 3, name: 'INTERVIEWTYPES.OTHER' }
    ];
    chosenItem = this.list[0].name;
    public ngDestroyed$ = new Subject();

    constructor(
        private recruitmentService: RecruitmentService, private cdRef: ChangeDetectorRef, private actionUpdates$: Actions,
        private store: Store<State>, private translateService: TranslateService,
        private toastr: ToastrService, public dialog: MatDialog) {
        super();
        this.moduleTypeId = 24;
        this.isrecruitment = true;
        this.actionUpdates$
            .pipe(
                takeUntil(this.ngDestroyed$),
                ofType(CustomFieldsActionTypes.UpsertCustomFieldCompleted),
                tap(() => {
                    if (!this.isEditForm) {
                        this.upsertInterviewTypePopover.forEach((p) => p.closePopover());
                        this.isThereAnError = false;
                        this.customFormComponent = null;
                        this.clearForm();
                        this.formGroupDirective.resetForm();
                        this.getInterviewType();
                    } else {
                        this.isThereAnError = false;
                        this.customFormComponent = null;
                    }
                })
            )
            .subscribe();
    }

    ngOnInit() {
        this.clearForm();
        super.ngOnInit();
        this.getInterviewType();
        this.getRoles();
    }

    getInterviewType() {
        this.isAnyOperationIsInprogress = true;
        const interviewTypeModel = new InterviewTypeUpsertModel();
        interviewTypeModel.isArchived = this.isArchived;
        this.recruitmentService.getInterviewType(interviewTypeModel).subscribe((response: any) => {
            if (response.success === true) {
                this.isThereAnError = false;
                this.clearForm();
                this.interviewType = response.data;
                this.temp = this.interviewType;
                this.isAnyOperationIsInprogress = false;
                this.cdRef.detectChanges();
            } else {
                this.isThereAnError = true;
                this.validationMessage = response.apiResponseMessages[0].message;
                this.isAnyOperationIsInprogress = false;
                this.cdRef.detectChanges();
            }
        });
    }

    getRoles() {
        this.isAnyOperationIsInprogress = true;
        const roleModel = new RoleModel();
        this.recruitmentService.getAllRolesDropDown(roleModel).subscribe((response: any) => {
            if (response.success === true) {
                this.isThereAnError = false;
                this.clearForm();
                this.roleList = response.data;

                this.isAnyOperationIsInprogress = false;
                this.cdRef.detectChanges();
            } else {
                this.isThereAnError = true;
                this.validationMessage = response.apiResponseMessages[0].message;
                this.isAnyOperationIsInprogress = false;
                this.cdRef.detectChanges();
            }
        });
    }

    bindRoleIds(roleIds) {
        if (roleIds) {
            const rolesList = this.roleList;
            // tslint:disable-next-line: only-arrow-functions
            const filteredList = _.filter(rolesList, function(member: any) {
                return roleIds.toString().includes(member.roleId);
            });
            const selectedRoles = filteredList.map((x: any) => x.roleName);
            this.selectedRoles = selectedRoles.toString();
        } else {
            this.selectedRoles = '';
        }
    }

    toggleRolesPerOne() {
        if (this.allRolesSelected.selected) {
            this.allRolesSelected.deselect();
            return false;
        }
        if (
            this.interviewTypeForm.get('roleId').value.length === this.roleList.length
        ) {
            this.allRolesSelected.select();
        }
    }

    toggleAllRolesSelection() {
        if (this.allRolesSelected.selected && this.roleList) {
            this.interviewTypeForm.get('roleId').patchValue([
                ...this.roleList.map((item) => item.roleId),
                0
            ]);
            this.selectedRoles = this.roleList.map((item) => item.roleId);
        } else {
            this.interviewTypeForm.get('roleId').patchValue([]);
        }
    }

    createInterviewType(upsertInterviewTypePopUp) {
        upsertInterviewTypePopUp.openPopover();
        this.interviewTypeTitle = this.translateService.instant('INTERVIEWTYPES.ADDINTERVIEWTYPETITLE');
    }

    closeUpsertInterviewTypePopup(formDirective: FormGroupDirective) {
        formDirective.resetForm();
        this.clearForm();
        this.isFormType = !this.isFormType;
        this.upsertInterviewTypePopover.forEach((p) => p.closePopover());
    }

    editInterviewType(row, upsertInterviewTypePopUp) {
        this.isEditForm = true;
        row.selectType = row.isAudio === true ? 1 : row.isVideo === true ? 2 : 3;
        this.interviewTypeForm.get('interviewTypeName').patchValue(row.interviewTypeName);
        this.interviewTypeForm.get('color').patchValue(row.color);
        this.interviewTypeForm.get('selectType').patchValue(row.selectType);
        this.interviewTypeForm.get('interviewTypeId').patchValue(row.interviewTypeId);
        if (row.roleId != null) {
            const role = row.roleId.split(',');
            this.interviewTypeForm.get('roleId').patchValue(role);
        } else {
            this.interviewTypeForm.get('roleId').patchValue(null);
        }
        this.interviewTypeId = row.interviewTypeId;
        this.interviewTypeName = row.interviewTypeName;
        this.color = row.color;
        this.timeStamp = row.timeStamp;
        this.isPhone = row.isAudio;
        this.isVideo = row.isVideo;
        this.isEdit = true;
        this.isButtonVisible = true;
        this.isFormType = true;
        this.interviewTypeTitle = this.translateService.instant('INTERVIEWTYPES.EDITINTERVIEWTYPETITLE');
        upsertInterviewTypePopUp.openPopover();
    }

    showFilters() {
        this.isFiltersVisible = !this.isFiltersVisible;
    }
    upsertInterviewType(formDirective: FormGroupDirective) {
        this.isAnyOperationIsInprogress = true;
        let interviewType = new InterviewTypeUpsertModel();
        interviewType = this.interviewTypeForm.value;
        interviewType.interviewTypeName = interviewType.interviewTypeName.toString().trim();
        interviewType.isPhone = this.isPhone;
        interviewType.isVideo = this.isVideo;
        interviewType.color = interviewType.color;
        interviewType.selectType = this.selectType;
        interviewType.interviewTypeRoleCofigurationId = interviewType.interviewTypeRoleCofigurationId;
        interviewType.timeStamp = this.timeStamp;
        if (interviewType.interviewTypeId) {
            this.isEditForm = true;
        } else {
            this.isEditForm = false;
        }
        this.recruitmentService.upsertInterviewType(interviewType).subscribe((response: any) => {
            if (response.success === true) {
                if (!this.isEdit && this.customFormComponent) {
                    this.customFormComponent.referenceId = response.data;
                    this.customFormComponent.referenceTypeId = response.data;
                    this.customFormComponent.moduleTypeId = 24;
                    this.store.dispatch(new UpsertCustomFieldTriggered(this.customFormComponent));
                    this.upsertInterviewTypePopover.forEach((p) => p.closePopover());
                    this.clearForm();
                    formDirective.resetForm();
                    this.getInterviewType();
                } else {
                    this.upsertInterviewTypePopover.forEach((p) => p.closePopover());
                    this.clearForm();
                    formDirective.resetForm();
                    this.getInterviewType();
                }
            } else {
                this.isThereAnError = true;
                this.validationMessage = response.apiResponseMessages[0].message;
                this.isAnyOperationIsInprogress = false;
            }
            this.cdRef.detectChanges();
        });
    }

    onClick(value) {
        if (value === 3) {
            this.isPhone = false;
            this.isVideo = false;
        } else if (value === 1) {
            this.isPhone = true;
            this.isVideo = false;
        } else {
            this.isPhone = false;
            this.isVideo = true;
        }
    }

    clearForm() {
        this.interviewTypeName = null;
        this.color = null;
        this.interviewTypeId = null;
        this.isThereAnError = false;
        this.validationMessage = null;
        this.timeStamp = null;
        this.isAnyOperationIsInprogress = false;
        this.searchText = null;
        this.customFormComponent = null;
        this.interviewTypeForm = new FormGroup({
            interviewTypeName: new FormControl(null,
                Validators.compose([
                    Validators.required,
                    Validators.maxLength(50)
                ])
            ),
            color: new FormControl(null,
                Validators.compose([
                    Validators.required,
                    Validators.maxLength(50)
                ])
            ),

            roleId: new FormControl(null,
                Validators.compose([
                ])
            ),
            selectType: new FormControl(null,
                Validators.compose([
                    Validators.required
                ])
            ),
            isPhone: new FormControl(null,
                Validators.compose([

                ])
            ),
            isVideo: new FormControl(null,
                Validators.compose([
                ])
            ),
            interviewTypeId: new FormControl(null,
                Validators.compose([
                ])
            ),
            roles: new FormControl(null,
                Validators.compose([
                ])
            ),
            interviewTypeRoleCofigurationId: new FormControl(null,
                Validators.compose([
                ]))
        });

        this.selectRoles = new FormGroup({
            roleId: new FormControl('')
        });
    }

    deleteInterviewTypePopupOpen(row, deleteInterviewTypePopup) {
        this.interviewTypeId = row.interviewTypeId;
        this.interviewTypeName = row.interviewTypeName;
        this.color = row.color;
        this.selectType = row.selectType;
        this.isPhone = row.isAudio;
        this.isVideo = row.isVideo;
        this.timeStamp = row.timeStamp;
        this.roleId = row.roleId;
        this.interviewTypeRoleCofigurationId = row.interviewTypeRoleCofigurationId;
        deleteInterviewTypePopup.openPopover();
    }

    closeDeleteInterviewTypePopup() {
        this.clearForm();
        this.deleteInterviewTypePopover.forEach((p) => p.closePopover());
    }

    deleteInterviewType() {
        this.isAnyOperationIsInprogress = true;
        const interviewTypeInputModel = new InterviewTypeUpsertModel();
        interviewTypeInputModel.interviewTypeId = this.interviewTypeId;
        interviewTypeInputModel.interviewTypeName = this.interviewTypeName;
        interviewTypeInputModel.color = this.color;
        interviewTypeInputModel.isPhone = this.isPhone;
        interviewTypeInputModel.isVideo = this.isVideo;
        interviewTypeInputModel.selectType = this.selectType;
        interviewTypeInputModel.timeStamp = this.timeStamp;
        interviewTypeInputModel.isArchived = !this.isArchived;
        interviewTypeInputModel.roleId = this.roleId;
        interviewTypeInputModel.interviewTypeRoleCofigurationId = this.interviewTypeRoleCofigurationId;
        this.recruitmentService.upsertInterviewType(interviewTypeInputModel).subscribe((response: any) => {
            if (response.success === true) {
                this.deleteInterviewTypePopover.forEach((p) => p.closePopover());
                this.clearForm();
                this.getInterviewType();
            } else {
                this.isThereAnError = true;
                this.validationMessage = response.apiResponseMessages[0].message;
                this.toastr.error(response.apiResponseMessages[0].message);
                this.isAnyOperationIsInprogress = false;
            }
        });
    }

    filterByName(event) {
        if (event != null) {
            this.searchText = event.target.value.toLowerCase();
            this.searchText = this.searchText.trim();
        } else {
            this.searchText = '';
        }
        const temp = this.temp.filter(interviewType =>
            (interviewType.interviewTypeName == null ? null : interviewType.interviewTypeName.toLowerCase().indexOf(this.searchText) > -1)
            || (interviewType.roleName == null ? null : interviewType.roleName.toLowerCase().indexOf(this.searchText) > -1)
            || (interviewType.modeOfInterview == null ? null : interviewType.modeOfInterview.toLowerCase().indexOf(this.searchText) > -1)
        );
        this.interviewType = temp;
    }

    closeSearch() {
        this.filterByName(null);
    }

    closeUpsertInterviewTypePopUpPopup(formDirective: FormGroupDirective) {
        formDirective.resetForm();
        this.clearForm();
        this.upsertInterviewTypePopover.forEach((p) => p.closePopover());
    }

    fitContent(optionalParameters?: any) {
        try {
            if (optionalParameters) {
                let parentElementSelector = '';
                let minHeight = '';
                if (optionalParameters['popupView'.toString()]) {
                    parentElementSelector = optionalParameters['popupViewSelector'.toString()];
                    minHeight = `calc(90vh - 200px)`;
                } else if (optionalParameters['gridsterView'.toString()]) {
                    parentElementSelector = optionalParameters['gridsterViewSelector'.toString()];
                    minHeight = `${$(parentElementSelector).height() - 40}px`;
                } else if (optionalParameters['individualPageView'.toString()]) {
                    parentElementSelector = optionalParameters['individualPageSelector'.toString()];
                    minHeight = `calc(100vh - 85px)`;
                }
            }
        } catch (err) {
            console.log(err);
        }
    }

    openCustomForm() {
        const dialogId = 'app-custom-form-component';
        const formsDialog = this.dialog.open(this.customFormsComponent, {
            height: '70%',
            width: '60%',
            hasBackdrop: true,
            direction: 'ltr',
            id: dialogId,
            data: {
                moduleTypeId: this.moduleTypeId, referenceId: this.interviewTypeId, referenceTypeId: this.interviewTypeId,
                customFieldComponent: this.customFormComponent,
                isButtonVisible: this.isButtonVisible, formPhysicalId: dialogId, dialogId
            },
            disableClose: true,
            panelClass: 'custom-modal-box'
        });
    }

    editFormComponent() {
        this.openCustomForm();
    }

    closeDialog(result) {
        result.dialog.close();
        if (!result.emitString) {
            this.isFormType = true;
            // tslint:disable-next-line: quotemark
            const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890,./;'[]\=-)(*&^%$#@!~`";
            this.isreload = 'reload' + possible.charAt(Math.floor(Math.random() * possible.length));
            this.cdRef.detectChanges();
        }
    }

    submitFormComponent(result) {
        result.dialog.close();
        if (result.emitData) {
            this.customFormComponent = result.emitData;
            this.cdRef.detectChanges();
        }
    }

}
