import { Component, ChangeDetectionStrategy, OnInit, ChangeDetectorRef, Input, Output, EventEmitter, TemplateRef, ViewChild, ViewChildren, NgModuleFactory, ComponentFactoryResolver, NgModuleRef, ViewContainerRef, Type } from "@angular/core";
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { State } from '../store/reducers/index';
import { Actions, ofType } from '@ngrx/effects';
import { tap, takeUntil } from 'rxjs/operators';
import { MatOption } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { FormControl, Validators, FormGroup, FormBuilder, FormArray, AbstractControl } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { TranslateService } from "@ngx-translate/core";

import * as auditModuleReducer from "../store/reducers/index";
// import * as commonModuleReducers from "../../../common/store/reducers/index";

// import { ConstantVariables } from "../../../common/constants/constant-variables";

import { AuditService } from "../services/audits.service";
import { QuestionModel, QuestionOptions } from "../models/question.model";
import { LoadQuestionTriggered, LoadSingleQuestionByIdTriggered, QuestionActionTypes } from "../store/actions/questions.actions";


import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { MAT_DATE_FORMATS, MAT_DATE_LOCALE, DateAdapter } from '@angular/material/core';
import { UpsertQuestionTypeDialogComponent } from "./upsert-question-type-dialog.component";
import { QuestionType, QuestionTypeOptions } from "../models/question-type.model";
import { ConstantVariables } from '../dependencies/constants/constant-variables';
import { CustomAppBaseComponent } from '../../globaldependencies/components/componentbase';
import { AuditImpactModel, AuditRiskModel } from '../models/audit-impact.module';
import { AuditPriorityModel } from '../models/audit-priority.module';
import { CustomFormFieldModel } from '../dependencies/models/custom-fileds-model';
type ModuleWithComponentService = Type<any> & { componentService: Type<any> };
import * as _ from 'underscore';
import { LocalStorageProperties } from '../../globaldependencies/constants/localstorage-properties';
import { UserService } from '../dependencies/services/user.Service';
import { AppFeatureBaseComponent } from '../../globaldependencies/components/featurecomponentbase';
import { EmployeeService } from '../dependencies/services/employee-service';
import { FeatureIds } from "../../globaldependencies/constants/feature-ids";
import { SoftLabelPipe } from "../dependencies/pipes/softlabels.pipes";
import { SoftLabelConfigurationModel } from "../dependencies/models/softLabels-model";
import { GenericStatusComponent } from "@snovasys/snova-app-builder-creation-components";


export const MY_FORMATS = {
    parse: {
        dateInput: 'YYYY',
    },
    display: {
        dateInput: 'DD-MM-YYYY',
        monthYearLabel: 'DD-MM-YYYY',
        dateA11yLabel: 'LL',
        monthYearA11yLabel: 'MMMM YYYY',
    },
};

@Component({
    selector: "audit-question-edit-view",
    templateUrl: "./audit-question-edit-view.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
        { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
    ],
})

export class AuditQuestionEditViewComponent extends AppFeatureBaseComponent implements OnInit {
    @Output() closeUpsertQuestion = new EventEmitter<any>();
    @ViewChild("customFormsComponent") customFormsComponent: TemplateRef<any>;
    @ViewChild("allSelected") private allSelected: MatOption;
    @ViewChild("allEmployeesSelected") private allEmployeesSelected: MatOption;
    @ViewChild("allPermissionsSelected") private allPermissionsSelected: MatOption;
    @ViewChild("allDeleteSelected") private allDeleteSelected: MatOption;
    @ViewChildren("addDocumentPopUp") addDocumentPopUp;
    @Input("selectedAudit")
    set _selectedAudit(data: any) {
        if (data) {
            this.selectedAudit = data;
            this.auditService.getUpdatedAudit()
                .subscribe((data: any) => {
                    if (data && this.selectedAudit.auditId.toLowerCase() == data.auditId.toLowerCase()) {
                        this.selectedAudit = data;
                    }
                });
            this.getAllMembers();
        }
    }

    @Input("auditCategoryId")
    set _auditCategoryId(data: any) {
        if (data) {
            this.auditCategoryId = data;
        }
        else {
            this.auditCategoryId = null;
        }
    }

    @Input("question")
    set _question(data: any) {
        if (data) {
            this.question = data;            
            this.isEditQuestion = true;
            this.loadQuestionDetails(this.question.questionId);
            this.initializeQuestionForm();
            this.initializeDocumentForm();
            this.questionId = this.question.questionId;
            this.isFormType = true;
            this.enableCustomField = true;
            if(this.question.status) {
                this.loadGenericStatusComponent('AuditQuestion');
            }
        }
        else {
            this.isEditQuestion = false;
            this.singleQuestionData = null;
            this.enableCustomField = false;
            this.initializeQuestionForm();
            this.initializeDocumentForm();
        }
    }

    @Input("isHierarchical")
    set _isHierarchical(data: boolean) {
        if (data || data == false) {
            this.isHierarchical = data;
        }
    }

    anyOperationInProgress$: Observable<boolean>;
    upsertOperationInProgress$: Observable<boolean>;

    public ngDestroyed$ = new Subject();

    questionTypeList = [];
    masterQuestionTypeList = [];
    finalQuestionTypeList = [];
    userList = [];

    questionForm: FormGroup;
    questionOptions: FormArray;
    isFormType: boolean = false;
    isreload: string;
    enableCustomField: boolean = false;
    moduletypeId: number = 90;
    questionTypeForm: FormGroup;
    documentForm: FormGroup;
    documents: FormArray;
    documentsTemp: any;
    questionTypeOptions: FormArray;
    selectedImapct: any;
    selectedRisk: any;
    selectedPriority: any;
    selectedAudit: any;
    auditCategoryId: any;
    question: any;
    singleQuestionData: any;
    originalMasterQuestionTypeId: any;
    masterQuestionTypeId: any;
    questionTypeId: any;
    questionTypeOptionId: any;
    questionOptionId: any;
    questionOptionScore: any;
    intimepicker: any;
    questionTypeResultId: any;
    impacts: any;
    risks: any;
    questionId: any;
    priorities: any;
    isEditQuestion: boolean = false;
    isHierarchical: boolean = false;
    disabledQuestion: boolean = false;
    disableAddAndSave: boolean = false;
    isMasterQuestionType: boolean = false;
    isSaveAndAddForNormalType: boolean = false;
    isSaveAndAddForMasterType: boolean = false;
    anyOperationIsInprogress: boolean = false;
    customFormComponent: CustomFormFieldModel;
    dropdownQuestionTypeId = ConstantVariables.DropdownQuestionTypeId.toLowerCase();
    dateQuestionTypeId = ConstantVariables.DateQuestionTypeId.toLowerCase();
    numericQuestionTypeId = ConstantVariables.NumericQuestionTypeId.toLowerCase();
    textQuestionTypeId = ConstantVariables.TextQuestionTypeId.toLowerCase();
    booleanQuestionTypeId = ConstantVariables.BooleanQuestionTypeId.toLowerCase();
    timeQuestionTypeId = ConstantVariables.TimeQuestionTypeId.toLowerCase();
    questionTypeDetailsId: string;
    estimatedTime: string;
    rolesDropDown = [];
    selectedRoleIds: string[] = [];
    employeesDropDown: any[];
    public initSettings: any = {
        plugins: "paste",
        //powerpaste_allow_local_images: true,
       // powerpaste_word_import: 'prompt',
        //powerpaste_html_import: 'prompt',
        //toolbar: 'link image code'
    };
    employeedLoading: boolean;
    defaultWorkflows: any;
    permissions: any = [
        {
            value: "1",
            name: "AUDIT.CANVIEWQUESTION",
            object: "canView"
        },
        {
            value: "2",
            name: "AUDIT.CANEDITQUESTION",
            object: "canEdit"
        },
        {
            value: "3",
            name: "AUDIT.CANADDACTION",
            object: "canAddAction"
        },
        {
            value: "4",
            name: "HRMANAGAMENT.NONE",
            object: "noPermission"
        }
    ];
    displayStatusComponent: boolean;
    loaded: boolean;
    injector: any;
    dashboard: any;
    workFlow: any;
    canAccessDocs$: Boolean;
    softLabels: SoftLabelConfigurationModel[];
    constructor(private store: Store<State>, private formBuilder: FormBuilder, private toastr: ToastrService, private translateService: TranslateService, private auditService: AuditService, private actionUpdates$: Actions, private routes: Router, private route: ActivatedRoute, public dialog: MatDialog, private cdRef: ChangeDetectorRef,
        private ngModuleFactoryLoader: ComponentFactoryResolver, private vcr: ViewContainerRef, private userService: UserService,
        private ngModuleRef: NgModuleRef<any>, private employeeService: EmployeeService, private softLabelsPipe: SoftLabelPipe
    ) {
        super();
        let roleFeatures = JSON.parse(localStorage.getItem(LocalStorageProperties.RoleFeatures))
        this.canAccessDocs$ = _.find(roleFeatures, function (role: any) { return role.featureId.toLowerCase() == FeatureIds.Feature_AddDocumentsForQuestion.toString().toLowerCase(); }) != null;
        this.GetAllRoles();
        this.injector = this.vcr.injector;
        this.getDefaultWorkflows();


        this.anyOperationInProgress$ = this.store.pipe(select(auditModuleReducer.getSingleQuestionLoading));
        this.upsertOperationInProgress$ = this.store.pipe(select(auditModuleReducer.getUpsertQuestionLoading));

        // this.loadQuestionTypes();
        this.getQuestionTypes();
        this.getAuditImpacts();
        this.getAuditRisks();
        this.getAuditPriority();
        this.actionUpdates$
            .pipe(
                takeUntil(this.ngDestroyed$),
                ofType(QuestionActionTypes.LoadSingleQuestionByIdCompleted),
                tap((result: any) => {
                    if (result && result.searchQuestions.length > 0) {
                        this.singleQuestionData = result.searchQuestions[0];
                        let data = result.searchQuestions[0];
                        this.estimatedTime = data.estimatedTime;
                        this.questionForm.patchValue(data);
                        this.appendEditData(data);
                        this.masterQuestionTypeId = data.masterQuestionTypeId;
                        this.originalMasterQuestionTypeId = data.masterQuestionTypeId;
                        this.questionTypeDetailsId = data.questionTypeId;
                        this.questionTypeId = data.questionTypeId;
                        if (data.isMasterQuestionType) {
                            this.onChangeQuestionTemplate(data.masterQuestionTypeId, false);
                            this.questionForm.get('questionTypeId').setValue(data.masterQuestionTypeId.toLowerCase());
                        }
                        this.documentsTemp = data.documents;
                        if(data.documents && data.documents.length > 0) {
                            this.documents = this.documentForm.get('documents') as FormArray;
                                    this.documents.controls = [];
                                    data.documents.forEach(x => {
                                        this.documents.push(this.formBuilder.group({
                                            documentId: x.documentId,
                                            isDocumentMandatory: x.isDocumentMandatory,
                                            documentName: x.documentName,
                                            documentOrder: x.documentOrder
                                        }));
                                    });
                        }
                        if (data.masterQuestionTypeId.toLowerCase() == this.dropdownQuestionTypeId || data.masterQuestionTypeId == this.booleanQuestionTypeId) {
                            if (data.questionOptions && data.questionOptions.length > 0) {
                                this.questionOptions = this.questionForm.get('questionOptions') as FormArray;
                                this.questionOptions.controls = [];
                                if (!data.isMasterQuestionType) {
                                    data.questionOptions.forEach(x => {
                                        this.questionOptions.push(this.formBuilder.group({
                                            questionId: x.questionId,
                                            questionOptionId: x.questionOptionId,
                                            questionTypeOptionId: x.questionTypeOptionId,
                                            questionOptionName: x.questionOptionName,
                                            questionOptionResult: x.questionOptionResult != null ? x.questionOptionResult : false,
                                            questionOptionScore: x.questionOptionScore,
                                            questionOptionOriginalScore: 0
                                        }));
                                    });
                                } else if (data.isMasterQuestionType) {
                                    this.questionTypeOptions = this.questionTypeForm.get('questionTypeOptions') as FormArray;
                                    this.questionTypeOptions.controls = [];
                                    data.questionOptions.forEach(x => {
                                        this.questionTypeOptions.push(this.formBuilder.group({
                                            questionTypeId: x.questionId,
                                            questionTypeOptionId: x.questionTypeOptionId,
                                            questionTypeOptionResult: x.questionOptionResult,
                                            questionTypeOptionName: x.questionOptionName,
                                            questionTypeOptionOrder: x.questionOptionOrder,
                                            questionTypeOptionScore: x.questionOptionScore,
                                            canQuestionTypeOptionDeleted: x.canQuestionTypeOptionDeleted
                                        }));
                                    });
                                }
                                this.questionForm.controls["questionTypeScore"].clearValidators();
                                this.questionForm.get("questionTypeScore").updateValueAndValidity();
                            }
                        } else if (data.masterQuestionTypeId == this.dateQuestionTypeId ||
                            data.masterQuestionTypeId == this.numericQuestionTypeId ||
                            data.masterQuestionTypeId == this.textQuestionTypeId ||
                            data.masterQuestionTypeId == this.timeQuestionTypeId) {
                            this.bindDateTypeQuestionDetails(data);
                        }
                        this.changeScoreStatus(data.isOriginalQuestionTypeScore);
                    }
                })
            ).subscribe();

        this.actionUpdates$
            .pipe(
                takeUntil(this.ngDestroyed$),
                ofType(QuestionActionTypes.QuestionFailed),
                tap(() => {
                    this.disabledQuestion = false;
                    this.disableAddAndSave = false;
                    this.cdRef.markForCheck();
                })
            ).subscribe();
            this.getSoftLabelConfigurations();
        }
      
        getSoftLabelConfigurations() {
          this.softLabels = JSON.parse(localStorage.getItem(LocalStorageProperties.SoftLabels));
        }

    ngOnInit() {
        super.ngOnInit();
    }

    appendEditData(question) {
        if (question.canView && question.canEdit && question.canAddAction && question.noPermission) {
            this.questionForm.controls["selectedPermissions"].patchValue([
                ...this.permissions.map((item) => item.value),
                0
            ]);
        } else {
            var permissions = [];
            if (question.canView) {
                permissions.push((this.permissions.find(x => x.object == "canView").value));
            }
            if (question.canEdit) {
                permissions.push((this.permissions.find(x => x.object == "canEdit").value));
            }
            if (question.canAddAction) {
                permissions.push((this.permissions.find(x => x.object == "canAddAction").value));
            }
            if (question.noPermission) {
                permissions.push((this.permissions.find(x => x.object == "noPermission").value));
            }
            if (permissions && permissions.length > 0) {
                this.questionForm.controls["selectedPermissions"].patchValue(permissions);
            }
        }
        const selectedEmployees = (question.selectedEmployees != null) ? question.selectedEmployees.split(',') : [];
        if (selectedEmployees != "") {
            this.questionForm.get("selectedEmployees").patchValue(selectedEmployees);
        }
        this.questionForm.get("selectedRoles").patchValue([]);
        if (question.roleIds != null) {
            const roleIds = question.roleIds.toLowerCase().split(",");
            if (roleIds != "")
                this.questionForm.get("selectedRoles").patchValue(roleIds);
        }

        if (this.questionForm.get("selectedRoles").value.length === this.rolesDropDown.length) {
            this.questionForm.get("selectedRoles").patchValue([
                ...this.rolesDropDown.map((item) => item.roleId),
                0
            ]);
        }
        this.getEmployeesByRoleId();
    }

    loadQuestionTypes() {
        let questionTypeModel = new QuestionType();
        questionTypeModel.isArchived = false;
        this.auditService.searchQuestionTypes(questionTypeModel).subscribe((result: any) => {
            if (result.success) {
                this.questionTypeList = result.data;
                this.auditService.assignQuestionTypeData(this.questionTypeList);
                this.loadMasterQuestionTypes();
                this.cdRef.markForCheck();
            }
            else {
                this.toastr.error(result.apiResponseMessages[0].message);
                this.cdRef.markForCheck();
            }
        });
    }

    getQuestionTypes() {
        this.auditService.getQuestionTypeData().subscribe((result: any) => {
            if (result) {
                this.questionTypeList = result;
                this.loadMasterQuestionTypes();
            }
        })
    }

    getAuditImpacts() {
        let auditImpact = new AuditImpactModel();
        auditImpact.isArchive = false;
        this.auditService.getAuditImpact(auditImpact).subscribe((result: any) => {
            this.impacts = result.data
        })
    }

    getAuditRisks() {
        let auditRisk = new AuditRiskModel();
        auditRisk.isArchive = false;
        this.auditService.getAuditRisk(auditRisk).subscribe((result: any) => {
            this.risks = result.data
        })
    }

    getAuditPriority() {
        let auditImpact = new AuditPriorityModel();
        auditImpact.isArchive = false;
        this.auditService.getAuditPriority(auditImpact).subscribe((result: any) => {
            this.priorities = result.data
        })
    }

    getAllMembers() {
        this.employeeService.getAllProjectMembers(this.selectedAudit.projectId).subscribe((response: any) => {
            if (response.success) {
                this.userList = response.data;
                // if (this.userList && this.userList.length > 0) {
                //     let data = { projectMember: { id: null, name: 'Select none' } };
                //     this.userList.push(data);
                // }
                this.cdRef.markForCheck();
            }
            else {
                this.userList = [];
                this.cdRef.markForCheck();
            }
        });
    }

    loadMasterQuestionTypes() {
        this.auditService.getMasterData().subscribe(data => {
            if (data) {
                this.masterQuestionTypeList = data;
                if (this.masterQuestionTypeList) {
                    this.finalQuestionTypeList = [];
                    this.finalQuestionTypeList.push(...this.questionTypeList);
                    this.masterQuestionTypeList.forEach(element => {
                        element.isMasterType = true;
                        element.questionTypeId = element.masterQuestionTypeId;
                        element.questionTypeName = element.masterQuestionTypeName;
                        this.finalQuestionTypeList.push(element);
                    });
                }
                if (this.questionTypeResultId) {
                    this.questionForm.get('questionTypeId').setValue(this.questionTypeResultId);
                    this.onChangeQuestionTemplate(this.questionTypeResultId, false);
                }
            }
        });
    }

    selectDocuments() {

    }
    closePopup() {
      //  this.documents = this.documentsTemp;
        this.addDocumentPopUp.forEach((p) => p.closePopover());
    }
    

    loadQuestionDetails(questionId) {
        let model = new QuestionModel();
        model.questionId = questionId;
        this.store.dispatch(new LoadSingleQuestionByIdTriggered(model));
    }

    onChangeQuestionTemplate(questionTypeId, isEditable) {
        let index = this.finalQuestionTypeList.findIndex(x => x.questionTypeId == questionTypeId);
        this.questionTypeOptionId = null;
        this.questionOptionScore = null;
        if (index != -1) {
            let data = this.finalQuestionTypeList[index];
            this.masterQuestionTypeId = data.masterQuestionTypeId;
            if (data.isMasterType) {
                // if (isEditable && data.masterQuestionTypeId == this.question.masterQuestionTypeId) {
                //     this.bindQuestionTypeDetails();
                // }
                this.isMasterQuestionType = true;
                this.initializeQuestionTypeForm();
                this.onChangMasterQuestionType(this.masterQuestionTypeId);
                if (!this.isEditQuestion && (this.masterQuestionTypeId.toLowerCase() == this.dropdownQuestionTypeId || this.masterQuestionTypeId.toLowerCase() == this.booleanQuestionTypeId)) {
                    this.addQuestionTypeOption();
                }
                else if (this.isEditQuestion && (this.masterQuestionTypeId.toLowerCase() == this.dropdownQuestionTypeId || this.masterQuestionTypeId.toLowerCase() == this.booleanQuestionTypeId)) {
                    this.addQuestionTypeOption();
                }
            } else {
                this.isMasterQuestionType = false;
                this.questionTypeId = data.questionTypeId;
                if (data.questionTypeOptions && data.questionTypeOptions.length > 0) {
                    if (data.masterQuestionTypeId.toLowerCase() == this.dropdownQuestionTypeId || data.masterQuestionTypeId.toLowerCase() == this.booleanQuestionTypeId) {
                        this.questionForm.controls["questionTypeScore"].clearValidators();
                        this.questionForm.get("questionTypeScore").updateValueAndValidity();
                        // this.questionForm.controls["questionOptionDate"].clearValidators();
                        // this.questionForm.get("questionOptionDate").updateValueAndValidity();
                        this.questionOptions = this.questionForm.get('questionOptions') as FormArray;
                        this.questionOptions.controls = [];
                        // while(this.questionOptions.length !== 0) {
                        //     this.questionOptions.removeAt(0);
                        // }
                        data.questionTypeOptions.forEach(x => {
                            this.questionOptions.push(this.formBuilder.group({
                                questionId: null,
                                questionOptionId: null,
                                questionTypeOptionId: x.questionTypeOptionId,
                                questionOptionName: x.questionTypeOptionName,
                                questionOptionResult: false,
                                questionOptionScore: 0,
                                questionOptionOriginalScore: x.questionTypeOptionScore
                            }));
                        });
                    } else if (data.masterQuestionTypeId.toLowerCase() == this.dateQuestionTypeId ||
                        data.masterQuestionTypeId.toLowerCase() == this.numericQuestionTypeId ||
                        data.masterQuestionTypeId.toLowerCase() == this.textQuestionTypeId ||
                        data.masterQuestionTypeId.toLowerCase() == this.timeQuestionTypeId) {
                        this.questionOptionScore = data.questionTypeOptions[0].questionTypeOptionScore;
                        if (this.questionForm.get('isOriginalQuestionTypeScore').value) {
                            this.questionForm.get('questionTypeScore').setValue(this.questionOptionScore);
                        }
                        this.questionTypeOptionId = data.questionTypeOptions[0].questionTypeOptionId;
                        this.questionForm.controls["questionTypeScore"].setValidators([Validators.min(-99), Validators.max(99)]);
                        this.questionForm.get("questionTypeScore").updateValueAndValidity();
                        // this.questionForm.controls["questionOptionDate"].setValidators([Validators.required]);
                        // this.questionForm.get("questionOptionDate").updateValueAndValidity();
                        this.questionForm.get('questionOptionDate').disable();
                        if (data.masterQuestionTypeId.toLowerCase() == this.booleanQuestionTypeId) {
                            this.questionForm.get('questionOptionDate').setValue(false);
                        } else {
                            this.questionForm.get('questionOptionDate').setValue(null);
                        }
                        this.changeScoreStatus(this.questionForm.get('isOriginalQuestionTypeScore').value);
                    }
                }
            }
        }
    }

    changeScoreStatus(value) {
        let typeIndex = this.questionTypeList.findIndex(x => x.questionTypeId == this.questionTypeId);
        if (typeIndex != -1) {
            let data = this.questionTypeList[typeIndex];
            this.questionOptions = this.questionForm.get('questionOptions') as FormArray;
            this.questionOptions.controls.forEach(x => {
                if (value || value == 'true') {
                    let index = data.questionTypeOptions.findIndex(y => y.questionTypeOptionId == x.get('questionTypeOptionId').value);
                    if (index != -1)
                        x.get('questionOptionOriginalScore').patchValue(data.questionTypeOptions[index].questionTypeOptionScore);
                    x.get('questionOptionOriginalScore').disable();
                }
            });

            //bind score for the variable
            if (data.masterQuestionTypeId.toLowerCase() == this.dateQuestionTypeId ||
                data.masterQuestionTypeId.toLowerCase() == this.numericQuestionTypeId ||
                data.masterQuestionTypeId.toLowerCase() == this.textQuestionTypeId ||
                data.masterQuestionTypeId.toLowerCase() == this.timeQuestionTypeId) {
                if (value) {
                    this.questionOptionScore = data.questionTypeOptions[0].questionTypeOptionScore;
                } else if (!value) {
                    if (this.singleQuestionData && this.singleQuestionData.questionOptions && this.singleQuestionData.questionOptions.length > 0)
                        this.questionOptionScore = this.singleQuestionData.questionOptions[0].questionOptionScore;
                }
            }

            if (value) {
                if (this.questionOptionScore) {
                    this.questionForm.get('questionTypeScore').setValue(this.questionOptionScore);
                }
                this.questionForm.get('questionTypeScore').disable();
            } else {
                this.questionForm.get('questionTypeScore').enable();
                if (this.isEditQuestion && this.questionForm.get('questionTypeScore').value == null) {
                    this.questionForm.get('questionTypeScore').setValue(0);
                } else if (!this.isEditQuestion) {
                    this.questionForm.get('questionTypeScore').setValue(0);
                } else if (this.questionOptionScore) {
                    this.questionForm.get('questionTypeScore').setValue(this.questionOptionScore);
                }
            }

        }
    }

    getQuestionTypeOptionControls(): AbstractControl[] {
        return (this.questionForm.get('questionOptions') as FormArray).controls;
    }

    setQuestionVariable(value) {
        if (value) {
            this.isSaveAndAddForNormalType = true;
            this.cdRef.markForCheck();
        }
        else {
            this.isSaveAndAddForNormalType = false;
            this.cdRef.markForCheck();
        }
    }

    setMasterQuestionVariable(value) {
        if (value) {
            this.isSaveAndAddForMasterType = true;
            this.cdRef.markForCheck();
        }
        else {
            this.isSaveAndAddForMasterType = false;
            this.cdRef.markForCheck();
        }
    }

    upsertQuestion() {
        if (!this.isMasterQuestionType && this.isSaveAndAddForNormalType) {
            this.disableAddAndSave = true;
            this.disabledQuestion = false;
        }
        else if (!this.isMasterQuestionType && this.isSaveAndAddForNormalType == false) {
            this.disableAddAndSave = false;
            this.disabledQuestion = true;
        }
        if (this.isMasterQuestionType && this.isSaveAndAddForMasterType) {
            this.disableAddAndSave = true;
            this.disabledQuestion = false;
        }
        else if (this.isMasterQuestionType && this.isSaveAndAddForMasterType == false) {
            this.disableAddAndSave = false;
            this.disabledQuestion = true;
        }
        let questionModel = new QuestionModel();
        questionModel = this.questionForm.getRawValue();
        questionModel.estimatedTime = Number(this.estimatedTime);
        questionModel.isHierarchical = this.isHierarchical;
        questionModel.auditId = this.selectedAudit.auditId;
        questionModel.disableAddAndSave = this.disableAddAndSave;
        questionModel.workFlowId = this.workFlow ? this.workFlow.workflowId : null;
        if (questionModel.questionResponsiblePersonId == '0') {
            questionModel.questionResponsiblePersonId = null;
        }
        if (!this.isEditQuestion)
            questionModel.auditCategoryId = this.auditCategoryId;
        let resultError = false;
        let resultMoreError = false;
        let scoreError = false;
        let resultCount = 0;
        let resultMoreCount = 0;
        if (!this.isMasterQuestionType) {
            questionModel.masterQuestionTypeId = this.questionTypeList.find(x => x.questionTypeId == questionModel.questionTypeId).masterQuestionTypeId
        } else {
            questionModel.masterQuestionTypeId = this.masterQuestionTypeId;
            questionModel.questionTypeId = this.questionTypeId;
        }
        if (this.isMasterQuestionType) {
            if (this.masterQuestionTypeId.toLowerCase() != this.dropdownQuestionTypeId && this.masterQuestionTypeId.toLowerCase() != this.booleanQuestionTypeId) {
                let questionOptions = new QuestionOptions();
                questionOptions.questionTypeOptionId = this.questionTypeOptionId;
                questionOptions.questionOptionScore = this.questionForm.get('questionTypeScore').value;
                questionOptions.questionOptionResult = true;
                if (!this.isEditQuestion) {
                    questionOptions.questionOptionId = null;
                }
                else if (this.isEditQuestion && this.questionTypeDetailsId.toLowerCase() == this.questionTypeId.toLowerCase()) {
                    questionOptions.questionOptionId = this.questionOptionId;
                } else if (this.isEditQuestion && this.questionTypeDetailsId.toLowerCase() != this.questionTypeId.toLowerCase()) {
                    questionOptions.questionOptionId = null;
                }
                questionModel.questionOptions.push(questionOptions);
            }
        }
        else if (questionModel.masterQuestionTypeId.toLowerCase() == this.dropdownQuestionTypeId || questionModel.masterQuestionTypeId.toLowerCase() == this.booleanQuestionTypeId) {
            questionModel.questionOptions.forEach(x => {
                x.questionOptionDate = null;
                if (x.questionOptionResult == false) {
                    resultCount = resultCount + 1;
                }
                if (x.questionOptionResult) {
                    resultMoreCount = resultMoreCount + 1;
                }
                if (questionModel.isOriginalQuestionTypeScore == false) {
                    if (x.questionOptionScore == null || x.questionOptionScore == '') {
                        // scoreError = true;
                        x.questionOptionScore = 0;
                    }
                }
            });
            if (resultCount == questionModel.questionOptions.length) {
                resultError = true;
                this.toastr.warning(this.translateService.instant(ConstantVariables.WarningMessageForResultError));
            }
            // if (resultMoreCount > 1) {
            //     resultMoreError = true;
            //     this.toastr.warning(this.translateService.instant(ConstantVariables.WarningMessageForResultMoreError));
            // }
        } else if (questionModel.masterQuestionTypeId.toLowerCase() == this.dateQuestionTypeId ||
            questionModel.masterQuestionTypeId.toLowerCase() == this.numericQuestionTypeId ||
            questionModel.masterQuestionTypeId.toLowerCase() == this.textQuestionTypeId ||
            questionModel.masterQuestionTypeId.toLowerCase() == this.timeQuestionTypeId) {
            questionModel.questionOptions = [];
            let questionOptions = new QuestionOptions();
            questionOptions.questionOptionScore = this.questionForm.get('questionTypeScore').value;
            if (questionModel.masterQuestionTypeId.toLowerCase() == this.dateQuestionTypeId) {
                questionOptions.questionOptionDate = this.questionForm.get('questionOptionDate').value;
            } else if (questionModel.masterQuestionTypeId.toLowerCase() == this.numericQuestionTypeId) {
                questionOptions.questionOptionNumeric = this.questionForm.get('questionOptionDate').value;
            } else if (questionModel.masterQuestionTypeId.toLowerCase() == this.textQuestionTypeId) {
                questionOptions.questionOptionText = this.questionForm.get('questionOptionDate').value;
            } else if (questionModel.masterQuestionTypeId.toLowerCase() == this.timeQuestionTypeId) {
                questionOptions.questionOptionTime = this.questionForm.get('questionOptionDate').value;
            }
            questionOptions.questionTypeOptionId = this.questionTypeOptionId;
            questionOptions.questionOptionResult = true;
            if (!this.isEditQuestion) {
                questionOptions.questionOptionId = null;
            }
            else if (this.isEditQuestion && this.questionTypeDetailsId.toLowerCase() == this.questionTypeId.toLowerCase()) {
                questionOptions.questionOptionId = this.questionOptionId;
            } else if (this.isEditQuestion && this.questionTypeDetailsId.toLowerCase() != this.questionTypeId.toLowerCase()) {
                questionOptions.questionOptionId = null;
            }
            questionModel.questionOptions.push(questionOptions);
        }
        if (!resultError && !scoreError) {
            let selectedRoleIds = this.questionForm.get("selectedRoles").value;
            if (selectedRoleIds != null) {
                questionModel.selectedRoleIds = selectedRoleIds.filter(x => x != "0").toString();
            }
            let selectedEmployees = this.questionForm.get("selectedEmployees").value;
            if (selectedEmployees != null) {
                questionModel.selectedEmployees = selectedEmployees.filter(x => x != "0").toString();
            }
            // questionModel.canEdit = this.questionForm.get("canEdit").value;
            // questionModel.canView = this.questionForm.get("canView").value;
            // questionModel.canAddAction = this.questionForm.get("canAddAction").value;
            let permissions = this.questionForm.get("selectedPermissions").value;
            if (permissions != null) {
                let perm = permissions.filter(x => x != "0");
                this.permissions.forEach(element => {
                    if (perm.some(x => x == element.value)) {
                        questionModel[element.object] = true;
                    }
                });
            }
            questionModel.documents = this.documentForm.get("documents").value;
            this.store.dispatch(new LoadQuestionTriggered(questionModel));
        }
        else {
            this.disabledQuestion = false;
            this.disableAddAndSave = false;
            this.cdRef.markForCheck();
        }
    }

    checkButtonDisabled() {
        this.questionForm.updateValueAndValidity();
        this.cdRef.detectChanges();
    }

    checkHintButtonDisabled() {
        this.questionForm.updateValueAndValidity();
        this.cdRef.detectChanges();
    }

    closeQuestionDialog() {
        this.closeUpsertQuestion.emit('');
    }

    initializeQuestionForm() {
        this.questionForm = new FormGroup({
            questionId: new FormControl(null, []),
            auditCategoryId: new FormControl(null, []),
            questionTypeId: new FormControl(null, Validators.compose([Validators.required])),
            questionName: new FormControl(null, Validators.compose([Validators.maxLength(800), Validators.required])),
            questionHint: new FormControl(null, Validators.compose([Validators.maxLength(7007)])),
            viewQuestionHint: new FormControl(false, []),
            questionDescription: new FormControl(null, Validators.compose([Validators.maxLength(7007)])),
            viewQuestionDescription: new FormControl(false, []),
            questionResult: new FormControl(null, Validators.compose([])),
            questionTrueOrFalse: new FormControl(false, []),
            questionScore: new FormControl(null, []),
            timeStamp: new FormControl(null, []),
            isArchived: new FormControl(false, []),
            isOriginalQuestionTypeScore: new FormControl(false, []),
            isQuestionMandatory: new FormControl(false, []),
            questionTypeScore: new FormControl(0, Validators.compose([Validators.min(-99), Validators.max(99)])),
            questionOptionDate: new FormControl(null, Validators.compose([])),
            priorityId: new FormControl(null, Validators.compose([])),
            impactId: new FormControl(null, Validators.compose([])),
            riskId:  new FormControl(null, Validators.compose([])),
            questionResponsiblePersonId: new FormControl(null, Validators.compose([])),
            questionOptions: this.formBuilder.array([]),
            selectedRoles: new FormControl(null,
                Validators.compose([
                ])
            ),
            selectedEmployees: new FormControl(null,
                Validators.compose([])),
            selectedPermissions: new FormControl(null,
                Validators.compose([])),
            // canView: new FormControl(false, []),
            // canEdit: new FormControl(false, []),
            // canAddAction: new FormControl(false, []),
        });
    }

    bindDateTypeQuestionDetails(data) {
        if (data.masterQuestionTypeId == this.dateQuestionTypeId) {
            this.questionForm.get('questionOptionDate').setValue(data.questionOptions[0].questionOptionDate);
        } else if (data.masterQuestionTypeId == this.numericQuestionTypeId) {
            this.questionForm.get('questionOptionDate').setValue(data.questionOptions[0].questionOptionNumeric);
        } else if (data.masterQuestionTypeId == this.textQuestionTypeId) {
            this.questionForm.get('questionOptionDate').setValue(data.questionOptions[0].questionOptionText);
        }
        else if (data.masterQuestionTypeId == this.timeQuestionTypeId) {
            this.questionForm.get('questionOptionDate').setValue(data.questionOptions[0].questionOptionTime);
        }
        this.questionForm.get('questionOptionDate').disable();
        this.questionForm.controls["questionTypeScore"].setValidators([Validators.min(-99), Validators.max(99)]);
        this.questionForm.get("questionTypeScore").updateValueAndValidity();
        if (!data.isMasterQuestionType) {
            this.questionForm.get('questionTypeScore').setValue(data.questionOptions[0].questionOptionScore);
        }
        else if (data.isMasterQuestionType) {
            this.questionTypeForm.get('questionTypeScore').setValue(data.questionOptions[0].questionOptionScore);
        }
        this.questionTypeOptionId = data.questionOptions[0].questionTypeOptionId;
        this.questionOptionId = data.questionOptions[0].questionOptionId;
    }

    initializeQuestionTypeForm() {
        this.questionTypeForm = new FormGroup({
            masterQuestionTypeId: new FormControl(null, []),
            masterQuestionTypeName: new FormControl(null, []),
            questionTypeId: new FormControl(null, []),
            questionTypeName: new FormControl(null, []),
            questionTypeOptions: this.formBuilder.array([]),
            isArchived: new FormControl(false, []),
            questionTypeScore: new FormControl(0, Validators.compose([Validators.min(-99), Validators.max(99)])),
            questionTypeDate: new FormControl(null, []),
            timeStamp: new FormControl(null, [])
        });
    }

    initializeDocumentForm() {
        this.documentForm = new FormGroup({
            documents: this.formBuilder.array([])
        });
    }

    onChangMasterQuestionType(masterQuestionTypeId) {
        if (masterQuestionTypeId.toLowerCase() == this.dropdownQuestionTypeId.toLowerCase() || masterQuestionTypeId.toLowerCase() == this.booleanQuestionTypeId) {
            this.questionTypeForm.controls["questionTypeScore"].clearValidators();
            this.questionTypeForm.get("questionTypeScore").updateValueAndValidity();
        } else if (masterQuestionTypeId.toLowerCase() == this.dateQuestionTypeId ||
            masterQuestionTypeId.toLowerCase() == this.numericQuestionTypeId ||
            masterQuestionTypeId.toLowerCase() == this.timeQuestionTypeId ||
            masterQuestionTypeId.toLowerCase() == this.textQuestionTypeId) {
            this.questionTypeForm.controls["questionTypeScore"].setValidators([Validators.min(-99), Validators.max(99)]);
            this.questionTypeForm.get("questionTypeScore").updateValueAndValidity();
            this.questionTypeForm.get("questionTypeDate").disable();
        }
    }

    upsertQuestionType() {
        if (this.isSaveAndAddForMasterType) {
            this.disableAddAndSave = true;
            this.disabledQuestion = false;
        }
        else if (this.isSaveAndAddForMasterType == false) {
            this.disableAddAndSave = false;
            this.disabledQuestion = true;
        }
        let typeNameError = false;
        let typeNameLengthError = false;
        let optionNameError = false;
        let optionNameLengthError = false;
        let optionNameDuplicateError = false;
        let optionResultError = false;
        let optionOrderError = false;
        let optionOrderEmptyError = false;
        let optionScoreError = false;
        let questionTitleError = false;
        let resultCount = 0;
        let questionTypeModel = new QuestionType();
        questionTypeModel = this.questionTypeForm.getRawValue();
        let questionModel = this.questionForm.getRawValue();
        if (questionModel.questionName == null || questionModel.questionName == '') {
            questionTitleError = true;
        }
        questionTypeModel.masterQuestionTypeId = this.masterQuestionTypeId;
        questionTypeModel.isFromMasterQuestionType = true;
        if (this.isEditQuestion && this.question.masterQuestionTypeId == this.masterQuestionTypeId) {
            // this.questionForm.get('questionTypeScore').setValue(this.questionTypeForm.get('questionTypeScore').value);
            // this.upsertQuestion();
            questionTypeModel.questionTypeId = this.question.questionTypeId;
            questionTypeModel.timeStamp = this.question.questionTypeTimestamp;
        }
        if (questionTypeModel.masterQuestionTypeId == this.dropdownQuestionTypeId || questionTypeModel.masterQuestionTypeId == this.booleanQuestionTypeId) {
            questionTypeModel.questionTypeOptions.forEach(x => {
                if (x.questionTypeOptionName == null || x.questionTypeOptionName == '') {
                    optionNameError = true;
                }
                if (x.questionTypeOptionName && x.questionTypeOptionName.length > 150) {
                    optionNameLengthError = true;
                }
                if (x.questionTypeOptionOrder == null || x.questionTypeOptionOrder == '') {
                    optionOrderEmptyError = true;
                }
                if (x.questionTypeOptionScore == null || x.questionTypeOptionScore == '') {
                    // optionScoreError = true;
                    x.questionTypeOptionScore = 0;
                }
                if (x.questionTypeOptionResult == false) {
                    resultCount = resultCount + 1;
                }
            });
            if (resultCount == questionTypeModel.questionTypeOptions.length) {
                optionResultError = true;
                this.toastr.warning(this.translateService.instant(ConstantVariables.WarningMessageForOptionResult));
            }
            let order = [];
            let optionName = [];
            questionTypeModel.questionTypeOptions.forEach(x => {
                order.push(x.questionTypeOptionOrder);
                if (x.questionTypeOptionName != null && x.questionTypeOptionName != '')
                    optionName.push(x.questionTypeOptionName.trim());
            });
            if ((new Set(order)).size !== order.length) {
                optionOrderError = true;
                this.toastr.warning(this.translateService.instant(ConstantVariables.WarningMessageForOptionOrder));
            }
            if ((new Set(optionName)).size !== optionName.length) {
                optionNameDuplicateError = true;
                this.toastr.warning(this.translateService.instant(ConstantVariables.WarningMessageForOptionNameDuplicte));
            }
            if (optionNameError) {
                this.toastr.warning(this.translateService.instant(ConstantVariables.WarningMessageForOptionName));
            }
            if (optionNameLengthError) {
                this.toastr.warning(this.translateService.instant(ConstantVariables.WarningMessageForOptionNameExceed));
            }
            if (optionOrderEmptyError) {
                this.toastr.warning(this.translateService.instant(ConstantVariables.WarningMessageForOptionOrderEmpty));
            }
        }
        else if (questionTypeModel.masterQuestionTypeId == this.dateQuestionTypeId ||
            questionTypeModel.masterQuestionTypeId == this.numericQuestionTypeId ||
            questionTypeModel.masterQuestionTypeId == this.timeQuestionTypeId ||
            questionTypeModel.masterQuestionTypeId == this.textQuestionTypeId) {
            questionTypeModel.questionTypeOptions = [];
            let dateTypeOption = new QuestionTypeOptions();
            dateTypeOption.questionTypeOptionScore = this.questionTypeForm.get('questionTypeScore').value;
            if (dateTypeOption.questionTypeOptionScore == null || dateTypeOption.questionTypeOptionScore == '') {
                // optionScoreError = true;
                dateTypeOption.questionTypeOptionScore = 0;
            }
            if (this.isEditQuestion && this.originalMasterQuestionTypeId != questionTypeModel.masterQuestionTypeId) {
                dateTypeOption.questionTypeOptionId = null;
            }
            else if (this.isEditQuestion && this.originalMasterQuestionTypeId == questionTypeModel.masterQuestionTypeId) {
                dateTypeOption.questionTypeOptionId = this.questionTypeOptionId;
            }
            questionTypeModel.questionTypeOptions.push(dateTypeOption);
        }
        if (!questionTitleError && !typeNameError && !typeNameLengthError && !optionNameError && !optionNameLengthError && !optionNameDuplicateError && !optionOrderError && !optionOrderEmptyError && !optionScoreError && !optionResultError) {
            this.auditService.upsertQuestionType(questionTypeModel).subscribe((result: any) => {
                if (result.success) {
                    this.anyOperationIsInprogress = false;
                    this.loadQuestionTypeById(result.data);
                    this.cdRef.markForCheck();
                }
                else {
                    this.toastr.error(result.apiResponseMessages[0].message);
                    this.anyOperationIsInprogress = false;
                    this.cdRef.markForCheck();
                }
            });
        }
        else {
            this.anyOperationIsInprogress = false;
            this.disableAddAndSave = false;
            this.disabledQuestion = false;
            this.cdRef.markForCheck();
        }
    }

    addDocumentControl() {
        this.documents = this.documentForm.get('documents') as FormArray;
        let length = this.documents.length;
        if (length < 10) {
            this.documents.insert(length, this.insertDocument());
            if (length == 0) {
                this.documents.at(length).get('documentOrder').setValue(1);
            }
            else {
                let value = this.documents.at(length - 1).get('documentOrder').value;
                this.documents.at(length).get('documentOrder').setValue(value + 1);
            }
        }
        else {
            this.toastr.warning("Exceeded documents list");
        }
    }

    insertDocument() {
        return this.formBuilder.group({
            documentId: new FormControl(null, []),
            isDocumentMandatory: new FormControl(false, []),
            documentName: new FormControl(null, []),
            documentOrder: new FormControl(null, [])
        });
    }

    removeDocument(index) {
        this.documents = this.documentForm.get('documents') as FormArray;
        this.documents.removeAt(index);
    }

    checkRemoveProbabilityForDocuments() {
        this.documents = this.documentForm.get('documents') as FormArray;
        if (this.documents.length > 1)
            return true;
        else
            return false;
    }

    addQuestionTypeOption() {
        this.questionTypeOptions = this.questionTypeForm.get('questionTypeOptions') as FormArray;
        let length = this.questionTypeOptions.length;
        if (length < 10) {
            this.questionTypeOptions.insert(length, this.insertOption());
            if (length == 0) {
                this.questionTypeOptions.at(length).get('questionTypeOptionOrder').setValue(1);
            }
            else {
                let value = this.questionTypeOptions.at(length - 1).get('questionTypeOptionOrder').value;
                this.questionTypeOptions.at(length).get('questionTypeOptionOrder').setValue(value + 1);
            }
        }
        else {
            this.toastr.warning(this.translateService.instant(ConstantVariables.WarningMessageForOptionsExceed));
        }
    }

    insertOption() {
        return this.formBuilder.group({
            questionTypeId: new FormControl(null, []),
            questionTypeOptionId: new FormControl(null, []),
            questionTypeOptionResult: new FormControl(false, []),
            questionTypeOptionName: new FormControl(null, []),
            questionTypeOptionOrder: new FormControl(null, []),
            questionTypeOptionScore: new FormControl(null, []),
            canQuestionTypeOptionDeleted: new FormControl(false, []),
        });
    }

    removeOption(index, value) {
        if (value == true || value == 'true') {
            this.toastr.warning(this.translateService.instant(ConstantVariables.WarningMessageForQuestionTypeOption));
        }
        else {
            this.questionTypeOptions = this.questionTypeForm.get('questionTypeOptions') as FormArray;
            this.questionTypeOptions.removeAt(index);
        }
    }

    checkMaxOptions() {
        this.questionTypeOptions = this.questionTypeForm.get('questionTypeOptions') as FormArray;
        if (this.questionTypeOptions.length > 10)
            return true;
        else
            return false;
    }

    checkRemoveProbability() {
        this.questionTypeOptions = this.questionTypeForm.get('questionTypeOptions') as FormArray;
        if (this.questionTypeOptions.length > 1)
            return true;
        else
            return false;
    }

    loadQuestionTypeById(questionTypeId) {
        let questionTypeModel = new QuestionType();
        questionTypeModel.isArchived = false;
        questionTypeModel.questionTypeId = questionTypeId;
        questionTypeModel.isFromMasterQuestionType = true;
        this.auditService.searchQuestionTypes(questionTypeModel).subscribe((result: any) => {
            if (result.success) {
                let data = result.data[0];
                if (data.masterQuestionTypeId.toLowerCase() == this.dropdownQuestionTypeId || data.masterQuestionTypeId == this.booleanQuestionTypeId) {
                    if (data.questionTypeOptions && data.questionTypeOptions.length > 0) {
                        this.questionOptions = this.questionForm.get('questionOptions') as FormArray;
                        this.questionOptions.controls = [];
                        let details = this.questionTypeForm.value;
                        let options = details.questionTypeOptions;
                        let answers = [];
                        options.forEach(element => {
                            // if (element.questionTypeOptionResult) {
                            answers.push(element);
                            // }
                        });

                        data.questionTypeOptions.forEach(x => {
                            let index = answers.findIndex(y => y.questionTypeOptionOrder == x.questionTypeOptionOrder);
                            let value = false;
                            if (index != -1)
                                value = answers[index].questionTypeOptionResult;
                            this.questionOptions.push(this.formBuilder.group({
                                questionId: x.questionId,
                                questionOptionId: x.questionOptionId,
                                questionTypeOptionId: x.questionTypeOptionId,
                                questionOptionName: x.questionTypeOptionName,
                                questionOptionResult: value,
                                questionOptionScore: x.questionTypeOptionScore,
                                questionOptionOriginalScore: 1
                            }));
                        });

                        data.questionTypeOptions.forEach(element => {
                            if (element.questionTypeOptionOrder == answers[0].questionTypeOptionOrder) {
                                this.questionTypeOptionId = element.questionTypeOptionId;
                                this.questionOptionId = element.questionOptionId;
                            }
                        });

                        this.questionForm.controls["questionTypeScore"].clearValidators();
                        this.questionForm.get("questionTypeScore").updateValueAndValidity();
                        // this.questionForm.controls["questionOptionDate"].clearValidators();
                        // this.questionForm.get("questionOptionDate").updateValueAndValidity();
                    }
                } else if (data.masterQuestionTypeId == this.dateQuestionTypeId ||
                    data.masterQuestionTypeId == this.numericQuestionTypeId ||
                    data.masterQuestionTypeId == this.textQuestionTypeId ||
                    data.masterQuestionTypeId == this.timeQuestionTypeId) {
                    this.questionTypeOptionId = data.questionTypeOptions[0].questionTypeOptionId;
                    this.questionOptionId = data.questionTypeOptions[0].questionOptionId;
                    this.questionForm.get('questionTypeScore').setValue(data.questionTypeOptions[0].questionTypeOptionScore);
                    ;
                }
                this.questionTypeId = questionTypeId;
                this.upsertQuestion();
                this.cdRef.markForCheck();
            }
            else {
                this.toastr.error(result.apiResponseMessages[0].message);
                this.disabledQuestion = false;
                this.disableAddAndSave = false;
                this.cdRef.markForCheck();
            }
        });
    }

    getQuestionTypeControls(): AbstractControl[] {
        return (this.questionTypeForm.get('questionTypeOptions') as FormArray).controls;
    }
    getDocuments(): AbstractControl[] {
        return (this.documentForm && this.documentForm.get('documents') as FormArray).controls;
    }
    // bindQuestionTypeDetails() {
    //     if (this.question.masterQuestionTypeId.toLowerCase() == this.dropdownQuestionTypeId || this.question.masterQuestionTypeId == this.booleanQuestionTypeId) {
    //         if (this.question.questionOptions && this.question.questionOptions.length > 0) {
    //             this.questionOptions = this.questionForm.get('questionOptions') as FormArray;
    //             this.questionOptions.controls = [];
    //             if (!this.question.isMasterQuestionType) {
    //                 this.question.questionOptions.forEach(x => {
    //                     this.questionOptions.push(this.formBuilder.group({
    //                         questionId: x.questionId,
    //                         questionOptionId: x.questionOptionId,
    //                         questionTypeOptionId: x.questionTypeOptionId,
    //                         questionOptionName: x.questionOptionName,
    //                         questionOptionResult: x.questionOptionResult != null ? x.questionOptionResult : false,
    //                         questionOptionScore: x.questionOptionScore,
    //                         questionOptionOriginalScore: 0
    //                     }));
    //                 });
    //             } else if (this.question.isMasterQuestionType) {
    //                 this.questionTypeOptions = this.questionTypeForm.get('questionTypeOptions') as FormArray;
    //                 this.questionTypeOptions.controls = [];
    //                 this.question.questionOptions.forEach(x => {
    //                     this.questionTypeOptions.push(this.formBuilder.group({
    //                         questionTypeId: x.questionId,
    //                         questionTypeOptionId: x.questionTypeOptionId,
    //                         questionTypeOptionResult: x.questionOptionResult,
    //                         questionTypeOptionName: x.questionOptionName,
    //                         questionTypeOptionOrder: x.questionOptionOrder,
    //                         questionTypeOptionScore: x.questionOptionScore,
    //                         canQuestionTypeOptionDeleted: x.canQuestionTypeOptionDeleted
    //                     }));
    //                 });
    //             }
    //             this.questionForm.controls["questionTypeScore"].clearValidators();
    //             this.questionForm.get("questionTypeScore").updateValueAndValidity();
    //         }
    //     } else if (this.question.masterQuestionTypeId == this.dateQuestionTypeId ||
    //         this.question.masterQuestionTypeId == this.numericQuestionTypeId ||
    //         this.question.masterQuestionTypeId == this.textQuestionTypeId ||
    //         this.question.masterQuestionTypeId == this.timeQuestionTypeId) {

    //         this.questionForm.get('questionOptionDate').disable();
    //         this.questionForm.controls["questionTypeScore"].setValidators([Validators.required, Validators.min(-99), Validators.max(99)]);
    //         this.questionForm.get("questionTypeScore").updateValueAndValidity();
    //         if (!this.isMasterQuestionType) {
    //             this.questionForm.get('questionTypeScore').setValue(this.question.questionOptions[0].questionOptionScore);
    //         }
    //         else if (this.isMasterQuestionType) {
    //             this.questionTypeForm.get('questionTypeScore').setValue(this.question.questionOptions[0].questionOptionScore);
    //         }
    //         this.questionTypeOptionId = this.question.questionOptions[0].questionTypeOptionId;
    //         this.questionOptionId = this.question.questionOptions[0].questionOptionId;

    //     }
    // }

    changeEstimatedTime(estimatedTime) {
        if (estimatedTime === 'null') {
            this.estimatedTime = null;
            this.cdRef.markForCheck();
        }
        else {
            this.estimatedTime = estimatedTime;
            this.cdRef.markForCheck();
        }
    }

    public ngOnDestroy() {
        this.ngDestroyed$.next();
    }

    closeintime() {

    }

    onChangeImpactValue(value) {
        this.selectedImapct = value;
    }

    onChangeRiskValue(value) {
        this.selectedRisk = value;
    }

    onChangePriorityValue(value) {
        this.selectedPriority = value;
    }

    openCustomForm() {
        let dialogId = "app-custom-form-component";
        const formsDialog = this.dialog.open(this.customFormsComponent, {
            height: "70%",
            width: "60%",
            hasBackdrop: true,
            direction: "ltr",
            id: dialogId,
            data: {
                moduleTypeId: 90, referenceId: this.questionId, referenceTypeId: this.selectedAudit.auditId,
                customFieldComponent: this.customFormComponent, isButtonVisible: true, formPhysicalId: dialogId, dialogId: dialogId
            },
            disableClose: true,
            panelClass: "custom-modal-box"
        });
    }

    closeDialog(result) {
        result.dialog.close();
        if (!result.emitString) {
            this.isFormType = true;
            const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890,./;'[]\=-)(*&^%$#@!~`";
            this.isreload = "reload" + possible.charAt(Math.floor(Math.random() * possible.length));
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

    editFormComponent() {
        this.openCustomForm();
    }

    loadGenericStatusComponent(type) {
        var moduleJson = localStorage.getItem(LocalStorageProperties.Modules);
        if (!moduleJson || moduleJson == 'null') {
            console.error(`No modules found`);
            return;
        }
        var modules = JSON.parse(moduleJson);
        var module = _.find(modules, function (module: any) {
            var widget = _.find(module.apps, function (app: any) { return app.displayName.toLowerCase() == "generic status" });
            if (widget) {
                return true;
            }
            return false;
        })
        this.displayStatusComponent = !this.displayStatusComponent;
        // this.ngModuleFactoryLoader
        //     .load(module.moduleLazyLoadingPath)
        //     .then((moduleFactory: NgModuleFactory<any>) => {
        //         const componentService = (moduleFactory.moduleType as ModuleWithComponentService).componentService;

        //         var allComponentsInModule = (<any>componentService).components;

        //         this.ngModuleRef = moduleFactory.create(this.injector);

        //         var componentDetails = allComponentsInModule.find(elementInArray =>
        //             elementInArray.name === "Generic status");

                let factory;
                factory = this.ngModuleFactoryLoader.resolveComponentFactory(GenericStatusComponent);


                this.dashboard = {};
                this.dashboard.component = factory;
                this.dashboard.inputs = {
                    referenceId: this.isEditQuestion ? this.question.questionId : null,
                    referenceName: type,
                    status: this.isEditQuestion ? this.question.status : 'Draft',
                    auditDefaultWorkflowId: this.defaultWorkflows ? this.defaultWorkflows.auditDefaultWorkflowId : null,
                    conductDefaultWorkflowId: this.defaultWorkflows ? this.defaultWorkflows.conductDefaultWorkflowId : null,
                    questionDefaultWorkflowId: this.defaultWorkflows ? this.defaultWorkflows.questionDefaultWorkflowId : null
                }
                this.loaded = true;
                this.cdRef.detectChanges();
            // })
    }

    outputs = {
        workFlowSelected: workFlow => {
            if (workFlow.referenceName == 'AuditQuestion') {
                this.workFlow = workFlow.workFlow;
            }
        },
        refreshAudit: referenceId => {
            // var audit = new AuditCompliance();
            // audit.auditId = referenceId;
            // audit.isArchived = false;
            // this.store.dispatch(new LoadAuditByIdTriggered(audit));
            this.getDefaultWorkflows();
          }
    }
    openAddDocumentPopup(popup) {
        popup.openPopover();
    }
    getDefaultWorkflows() {
        this.auditService.getDefaultWorkflows()
                .subscribe((res: any) => {
                  if(res.success && res.data && res.data.length > 0)
                  this.defaultWorkflows = res.data[0];
                })
      }

    GetAllRoles() {
        this.auditService.getRolesData().subscribe(data => {
            if (data) {
                this.rolesDropDown = data;
                this.cdRef.markForCheck();
            }
        });
    }

    toggleEmployeesPerOne() {
        if (this.allEmployeesSelected.selected) {
            this.allEmployeesSelected.deselect();
            const roles = this.questionForm.get("selectedEmployees").value;
            roles.shift();
            this.questionForm.get("selectedEmployees").patchValue(roles);
            return false;
        }
        if (this.questionForm.controls["selectedEmployees"].value.length === this.employeesDropDown.length) {
            this.allEmployeesSelected.select();
        }
    }

    toggleAllEmployeesSelected() {
        if (this.allEmployeesSelected.selected) {
            if (this.employeesDropDown.length === 0) {
                this.questionForm.controls["selectedEmployees"].patchValue([]);
            } else {
                this.questionForm.controls["selectedEmployees"].patchValue([
                    ...this.employeesDropDown.map((item) => item.userId),
                    0
                ]);
            }
        } else {
            this.questionForm.controls["selectedEmployees"].patchValue([]);
            this.questionForm.controls["selectedPermissions"].patchValue([]);
        }
    }

    toggleAllPermissionsSelected() {
        if (this.allPermissionsSelected.selected) {
            if (this.permissions.length === 0) {
                this.questionForm.controls["selectedPermissions"].patchValue([]);
            } else {
                this.questionForm.controls["selectedPermissions"].patchValue([
                    ...this.permissions.map((item) => item.value),
                    0
                ]);
            }
        } else {
            this.questionForm.controls["selectedPermissions"].patchValue([]);
        }
    }

    togglePermissionPerOne(val) {
        if (this.allPermissionsSelected.selected) {
            this.allPermissionsSelected.deselect();
            const roles = this.questionForm.get("selectedPermissions").value;
            roles.shift();
            this.questionForm.get("selectedPermissions").patchValue(roles);
            return false;
        }
        if (this.questionForm.controls["selectedPermissions"].value.length === this.permissions.length) {
            this.allPermissionsSelected.select();
        }
    }

    compareSelectedEmployeesFn(employeeList: any, selectedEmployees: any) {
        if (employeeList === selectedEmployees) {
            return true;
        } else {
            return false;
        }
    }



    toggleRolesPerOne(val) {
        if (this.allSelected.selected) {
            this.allSelected.deselect();
            const roles = this.questionForm.get("selectedRoles").value;
            roles.shift();
            this.questionForm.get("selectedRoles").patchValue(roles);
            this.getEmployeesByRoleId();
            return false;
        }
        if (
            this.questionForm.get("selectedRoles").value.length === this.rolesDropDown.length
        ) {
            this.allSelected.select();
            this.getEmployeesByRoleId();
            return;
        }
        else {
            this.getEmployeesByRoleId();
        }
    }

    toggleAllRolesSelected() {
        if (this.allSelected.selected) {
            this.questionForm.get("selectedRoles").patchValue([
                ...this.rolesDropDown.map((item) => item.roleId),
                0
            ]);
            this.selectedRoleIds = this.rolesDropDown.map((item) => item.roleId);
        } else {
            this.questionForm.get("selectedRoles").patchValue([]);
            this.questionForm.controls["selectedPermissions"].patchValue([]);
        }
        this.getEmployeesByRoleId();
    }

    compareSelectedRolesFn(rolesList: any, selectedRoles: any) {
        if (rolesList === selectedRoles) {
            return true;
        } else {
            return false;
        }
    }

    roleSelectionChange(event) {
        if (this.questionForm.get("selectedRoles").value.length > 0) {
            this.questionForm.get('selectedEmployees').setValidators([Validators.required]);
            this.questionForm.get('selectedEmployees').updateValueAndValidity();
        } else {
            this.questionForm.get('selectedEmployees').clearValidators();
            this.questionForm.get('selectedEmployees').updateValueAndValidity();
        }
    }

    getEmployeesByRoleId() {
        this.employeedLoading = true;
        var roleIds = this.questionForm.get("selectedRoles").value.filter(x => x != "0").toString();
        if (roleIds == '' || roleIds == null || roleIds == undefined) {
            this.employeedLoading = false;
            this.employeesDropDown = null;
            this.questionForm.get("selectedEmployees").patchValue([]);
            this.cdRef.detectChanges();
            return;
        }
        this.userService.getEmployeesByRoleId(roleIds)
            .subscribe((res: any) => {
                if (res.success && res.data && res.data.length > 0 && this.questionForm.get("selectedRoles").value && this.questionForm.get("selectedRoles").value.length > 0) {
                    this.employeesDropDown = res.data;
                    if (this.questionForm.get("selectedEmployees").value && this.questionForm.get("selectedEmployees").value.length === this.employeesDropDown.length) {
                        this.questionForm.get("selectedEmployees").patchValue([
                            ...this.employeesDropDown.map((item) => item.userId),
                            0
                        ]);
                    }
                }
                this.employeedLoading = false;
                this.cdRef.detectChanges();
            })
    }

}