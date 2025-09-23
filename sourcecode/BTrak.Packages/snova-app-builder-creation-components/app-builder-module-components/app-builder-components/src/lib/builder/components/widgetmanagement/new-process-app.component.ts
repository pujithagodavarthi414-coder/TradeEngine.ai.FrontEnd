import { Component, ViewChild, ViewChildren, OnInit, Input, Output, EventEmitter, ChangeDetectorRef, Inject, TemplateRef, ElementRef } from "@angular/core";
import { FormArray, FormBuilder, FormControl, FormGroup, FormGroupDirective, Validators } from "@angular/forms";
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { MatOption } from "@angular/material/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { SatPopover } from "@ncstate/sat-popover";
import * as formUtils from "formiojs/utils/formUtils.js";
import { DragulaService } from "ng2-dragula";
import { ToastrService } from "ngx-toastr";
import { Observable, Subscription } from "rxjs";
import * as _ from "underscore";
import { ConstantVariables } from "../../../globaldependencies/constants/constant-variables";
import { Page } from "../../models/page.model";
import { RoleModel } from "../../models/role.model";
import { RoleManagementService } from "../../services/role-management.service";
import { CustomApplicationModel } from "../genericform/models/custom-application-input.model";
import { CustomApplicationKeyModel } from "../genericForm/models/custom-application-key-input.model";
import { CustomApplicationKeySearchModel } from "../genericForm/models/custom-application-key-search.model";
import { CustomApplicationSearchModel } from "../genericForm/models/custom-application-search.model";
import { CustomApplicationWorkflowModel } from "../genericForm/models/custom-application-workflow";
import { GenericFormKeyModel } from "../genericForm/models/generic-form-key.model";
import { WorkflowRuleJson } from "../genericForm/models/workflow-rulejson";
import { GenericFormService } from "../genericForm/services/generic-form.service";
import { CustomAppBaseComponent } from "../../../globaldependencies/components/componentbase";
import { Router } from "@angular/router";
import { CustomTagModel } from "../../models/custom-tags.model";
import { CustomTagService } from "../../services/customTag.service";
import { MasterDataManagementService } from '../../services/master-data-management.service';
import { LocalStorageProperties } from "../../../globaldependencies/constants/localstorage-properties";
import { SoftLabelConfigurationModel } from "../../models/softlabels.model";
import { orderBy, process, State } from "@progress/kendo-data-query";
import { DataStateChangeEvent, GridDataResult } from "@progress/kendo-angular-grid";

import { UserService } from "../genericform/services/user.Service";
import { UserModel } from "../genericform/models/user";
import { SearchFilterPipe } from "../../pipes/search-filter.pipe";

@Component({
    selector: "app-new-process-widget",
    templateUrl: `new-process-app.component.html`
})

export class NewProcessWidgetComponent extends CustomAppBaseComponent implements OnInit {

    @ViewChild("shareDocFormTemplate") shareDocFormTemplate: TemplateRef<any>;
    @ViewChildren("configureEmailPopUp") configureEmailPopUps;
    @ViewChild("emailConfigurationTemplate") emailTemplate: TemplateRef<any>;
    selectedTabIndex: number = 0;
    currentDialog: any;
    currentDialogId: any;
    emailCurrentDialog: any;
    emailCurrentDialogId: any;
    selectedScenarioIndex: number;
    selectedScenarioRoles: any[] = [];
    selectedScenarioRolesString: string;
    selectedAppId: string;
    tagSearchText: string;
    fromSearch: string;
    customFormIds: any;
    formKeysList: any[] = [];
    selectedFormIds: any[] = [];
    selectedForms: any[] = [];
    selectedFormTypeId: string;
    enableConfigureFormKeySettings: boolean;
    modulesDropDown: any[];
    selectedModuleIds: string[] = [];
    recordLevelPermissions: any;
    selectedIds: any;
    @ViewChild("addLevelComponent") addLevelComponent: TemplateRef<any>;
    pdfTemplates: any;
    GetAllUsers: any = [];
    userLists: any = [];
    userId: any;
    showFields: boolean = false;
    allowAnnonymous: boolean = false;
    emailsCount: number;
    myFlag = false;
    customApplicationKeySelected: CustomApplicationModel;
    isRedirectToEmail: boolean;
    isArchivedWorkflows: boolean;
    mailWorkflowIds: any;
    configureDetails: any = {};
    workflowIds: any;
    isRecordLevelPermissionEnabled: boolean;
    recordLevelPermissionFieldName: string;
    permissionsDropdown: any[] = [];
    pdfDialogDetails: any = {};




    @Input("selectedAppId")
    set _selectedAppId(data: string) {
        if (data != null && data !== undefined) {
            this.selectedTabIndex = 0;
            this.selectedAppId = data;
            this.applicationId = data;
            this.getCustomApplicationById(this.selectedAppId);
            this.cdRef.detectChanges();
        }
    }

    @Input("fromSearch")
    set _fromSearch(data: string) {
        if (data) {
            this.fromSearch = data;
        }
    }
    @Input("tagSearchText")
    set _tagSearchText(data: string) {
        if (data) {
            this.tagSearchText = data;
        }
    }
    @Input("tagModel")
    set _tagModel(data: CustomTagModel) {
        this.tagModel = data;
    }
    @Input("data")
    set _data(data: any) {
        if (data && data !== undefined) {
            this.matData = data[0];
            this.selectedTabIndex = 0;
            this.selectedAppId = this.matData.selectedAppId;
            this.applicationId = this.matData.selectedAppId;
            if (this.selectedAppId)
                this.getCustomApplicationById(this.selectedAppId);
            this.cdRef.detectChanges();
            this.currentDialogId = this.matData.formPhysicalId;
            this.currentDialog = this.dialog.getDialogById(this.currentDialogId);
        }
    }

    @Output() closeDialog = new EventEmitter<boolean>();

    @ViewChildren("workflowTypePopover") workflowTypesPopover;
    @ViewChild("allSelected") private allSelected: MatOption;
    @ViewChild("allKeysSelected") private allKeysSelected: MatOption;
    @ViewChild("addWorkflow") addWorkflowPopup: SatPopover;
    @ViewChild("workflowBpmnComponent") workflowBpmnComponent: TemplateRef<any>;
    @ViewChild("allModuleSelected") private allModuleSelected: MatOption;
    matData: any;
    shareCurrentDialogId: any;
    shareCurrentDialog: any;
    tagModel: any;
    rolesList: RoleModel[];
    rolesList1: RoleModel[] = [];

    customApplicationByIdData: CustomApplicationModel;
    genericFormKeyList: GenericFormKeyModel[] = [];
    multipleGenericFormKeys: any = [];
    availableGenericFormKeysList: GenericFormKeyModel[] = [];
    availableDestinationFormKeysList: GenericFormKeyModel[];
    customApplicationKeysById: CustomApplicationKeyModel[];
    selectedCustomApplicationKeysById: CustomApplicationKeyModel[];
    customApplicationForm: FormGroup;
    customApplicationConfigureForm: FormGroup;
    selectedKeyIds = [];
    selectedPrivateKeyIds = [];
    selectedTagKeyIds = [];
    selectedEnableTrendsKeys = [];
    workflowTypes = [];
    customApplicationsList = [];
    workflowType3Id = ConstantVariables.WorkflowType3Id;
    workflowType4Id = ConstantVariables.WorkflowType4Id;
    customApplicationReferenceTypeId = ConstantVariables.CustomApllicationReferenceTypeId.toLowerCase();
    formIds: any = [];
    formTypes: any;
    selectedWorkflowType: any;
    editBpmnWorkflowId: any;
    editBpmnWorkflowXml: any;
    editBpmnWorkflowName: string;
    editWorkflowTrigger: string;
    applicationId: string;
    gettingCustomApplicationFormInProgress: boolean;
    validationMessage: string;
    subs = new Subscription();
    dragulaBoardUniqueId: string;
    gettingCustomApplicationKeysInProgress: boolean;
    sortBy = "customApplicationName";
    sortDirection = true;
    page = new Page();

    addingWorkflow: boolean;
    savingWorkflowInProgress = false;
    editWorkflow = false;
    public workFlowData: WorkflowRuleJson = new WorkflowRuleJson();
    workFlowDataList: any = [];
    worflowGridSpinner = true;
    loadWorkflowType = false;
    editBpmnWorkflow = false;
    isType1required = false;
    gettingTagKeysInprogress = false;
    isType2required = false;
    selectedForm: any;
    selectedFormKeyValues: any = [];
    customApplicationFormId: string;
    customApplicationsFormsList: any = [];
    selectedCustomApplicationForms: any = [];
    isAnyOperationIsInprogress: boolean = false;
    isPublished: boolean;
    tagsList: CustomTagModel[] = [];
    softLabels: SoftLabelConfigurationModel[];
    isPdfRequired: boolean;
    conditionalEnum: any;
    gridData: GridDataResult;
    levelsData: any;
    scenarioForm: FormGroup;
    scenarioSteps: FormArray;
    stageApplicationForm: FormGroup;
    stageScenarioSteps: FormArray;
    fields: FormArray;
    state: State = {
        skip: 0,
        take: 15,
    };
    pageable: boolean = false;
    isArchived: boolean = false;

    public initSettings = {
        plugins: 'lists advlist,wordcount,paste',
        //powerpaste_allow_local_images: true,
        //powerpaste_word_import: 'prompt',
        //powerpaste_html_import: 'prompt',
    };

    @ViewChild("formDirectiveSatPopover") formDirective: FormGroupDirective;

    constructor(
        private roleService: RoleManagementService, private router: Router,
        private genericFormService: GenericFormService, private toastr: ToastrService,
        private snackbar: MatSnackBar, private dragulaService: DragulaService, private formBuilder: FormBuilder,
        public dialog: MatDialog, public processDialogRef: MatDialogRef<NewProcessWidgetComponent>,
        private cdRef: ChangeDetectorRef, private customTagsService: CustomTagService,
        private masterDataManagementService: MasterDataManagementService,
        private userService: UserService,
        private searchFilterPipe: SearchFilterPipe,
        @Inject(MAT_DIALOG_DATA) public data: any) {
        super();
        this.getAllUser();
        this.clearScenarioForm();
        this.clearStageApplicationForm();
        this.getSoftLabelConfigurations();
        this.applicationId = this.selectedAppId ? this.selectedAppId : (data && data.selectedAppId ? data.selectedAppId : "");
        this.selectedAppId = this.applicationId;

        if (this.applicationId) {
            this.getCustomApplicationById(this.applicationId);
        } else {
            this.initializeCustomApplicationForm();
            this.getRoles();
        }
        this.initializeWorkFlowTypeForm();
        this.getWorkflowByCustomApplicationId();
        this.permissionsDropdown = [
            {
                "name": "User level",
                "value": 1
            },
            {
                "name": "Role level",
                "value": 2
            },
            {
                "name": "Scenario level",
                "value": 3
            },

        ]
    }

    ngOnInit() {
        super.ngOnInit();
        this.initializeCustomApplicationForm();
        this.GetAllModules();
        this.showFields = false;
        this.allowAnnonymous = false;

    }

    clearScenarioForm() {
        this.scenarioForm = new FormGroup({
            scenarioSteps: this.formBuilder.array([]),
        })
    }

    clearStageApplicationForm() {
        this.stageApplicationForm = new FormGroup({
            stageScenarioSteps: this.formBuilder.array([]),
        })
    }

    get scenario(): FormArray {
        return this.scenarioForm.get("scenarioSteps") as FormArray
    }

    get stageScenario(): FormArray {
        return this.stageApplicationForm.get("stageScenarioSteps") as FormArray
    }

    addNewScenario(index) {
        this.scenarioSteps = this.scenarioForm.get('scenarioSteps') as FormArray;
        this.scenarioSteps.insert(index + 1, this.newScenario());
    }

    addNewStage(index) {
        this.stageScenarioSteps = this.stageApplicationForm.get('stageScenarioSteps') as FormArray;
        this.stageScenarioSteps.insert(index + 1, this.newStageScenario());
    }

    addFields(index, jindex) {
        this.fields = (this.scenarioForm.get('scenarioSteps') as FormArray).at(index).get('fields') as FormArray;
        this.fields.insert(jindex + 1, this.addNewField());
    }
    newScenario(): FormGroup {
        return this.formBuilder.group({
            roleIdsArray: new FormControl('', Validators.compose([])),
            userIdsArray: new FormControl('', Validators.compose([])),
            fields: this.formBuilder.array([]),
        })
    }

    newStageScenario(): FormGroup {
        return this.formBuilder.group({
            fieldName: new FormControl('', Validators.compose([])),
            fieldValue: new FormControl('', Validators.compose([])),
            stage: new FormControl('', Validators.compose([])),
        })
    }

    addNewField(): FormGroup {
        return this.formBuilder.group({
            fieldName: new FormControl('', Validators.compose([])),
            fieldValue: new FormControl('', Validators.compose([])),
            condition: new FormControl('', Validators.compose([])),
        })
    }

    removeScenario(index) {
        this.scenarioSteps.removeAt(index);
    }

    removeStageScenario(index) {
        this.stageScenarioSteps.removeAt(index);
    }

    removeFields(index, subIndex) {
        const scenarioStepsArray = this.scenarioForm.get('scenarioSteps') as FormArray;
        const fieldsArray = (scenarioStepsArray.at(index).get('fields') as FormArray);
        fieldsArray.removeAt(subIndex);
        this.fields = fieldsArray;
    }

    showFormFields(event) {
        this.showFields = event;
    }

    allowAnnonymousChange(event) {
        this.allowAnnonymous = event;
    }

    changeRecordLevelPermission(event) {
        this.isRecordLevelPermissionEnabled = event;
    }

    getScenarioLevelChange(event) {
        let scenarioSteps = this.scenarioForm.get('scenarioSteps')['controls']
        if (scenarioSteps.length == 0) {
            if (event == 3) {
                this.addNewScenario(-1);
            }
        }
    }

    getdocInfo() {
        let id = null;
        let customApplicationId = this.applicationId;
        this.genericFormService.getLevel({ id: id, customApplicationId: customApplicationId, isArchived: this.isArchived }).subscribe((responseData: any) => {
            const success = responseData.success;
            if (success) {
                if (responseData.data) {
                    var data = responseData.data;
                    this.levelsData = [];
                    data.forEach((item: any) => {
                        if (item.dataJson) {
                            item.dataJson.id = item.id;
                            this.levelsData.push(item.dataJson);
                        }
                    })
                    let result = this.levelsData;
                    if (this.state.sort) {
                        result = orderBy(this.levelsData, this.state.sort);
                    }
                    this.gridData = process(result, this.state);
                }
            } else {
                this.validationMessage = responseData.apiResponseMessages[0].message;
                this.toastr.error("", this.validationMessage);
            }
        });
    }

    navigatetocustomwidgets(isReloadRequired) {
        if (this.currentDialog)
            this.currentDialog.close({ data: 'success' });
        this.closeDialog.emit(isReloadRequired);
    }

    checkDisabled() {
        return !this.customApplicationForm.valid || this.isAnyOperationIsInprogress;
    }

    getSoftLabelConfigurations() {
        this.softLabels = JSON.parse(localStorage.getItem(LocalStorageProperties.SoftLabels));
    }

    validateConfigureForm() {
        return !this.customApplicationForm.valid || !this.customApplicationConfigureForm.valid || this.selectedFormIds.length == 0 || this.isAnyOperationIsInprogress;
    }

    navigateToMainDetails() {
        this.selectedTabIndex = 0;
    }

    navigateToFormSelection() {
        if (this.isPdfRequired && this.selectedTabIndex != 0) {
            this.selectedTabIndex = 3;
            this.isArchived = false;
            this.getdocInfo();
            this.getPdfTemplates();
        } else if (this.isRecordLevelPermissionEnabled && this.selectedTabIndex != 0) {
            this.selectedTabIndex = 4;
        } else if (this.selectedTabIndex == 5) {
            if (this.isRecordLevelPermissionEnabled) {
                this.selectedTabIndex = 4;
            } else if (this.isPdfRequired) {
                this.selectedTabIndex = 3;
                this.isArchived = false;
                this.getdocInfo();
                this.getPdfTemplates();
            } else {
                this.selectedTabIndex = 2;
                this.getFormKeysList();
            }
        }
        else {
            this.selectedTabIndex = 1;
        }
    }

    navigateFormSelection() {
        if (this.selectedTabIndex == 3) {
            this.selectedTabIndex = 2;
            this.getFormKeysList();
        }
        else if (this.selectedTabIndex == 2) {
            this.selectedTabIndex = 1;
        }
        else {
            this.selectedTabIndex = 2;
            this.getFormKeysList();
        }
    }

    navigateToProcessForm() {
        if (this.selectedTabIndex == 1) {
            this.selectedTabIndex = 2;
            this.clearStageApplicationForm();
            this.getFormKeysList();
        } else if (this.selectedTabIndex == 4) {
            this.selectedTabIndex = 5;
        } else if (this.selectedTabIndex == 2) {
            if (this.isPdfRequired) {
                this.selectedTabIndex = 3;
                this.isArchived = false;
                this.getdocInfo();
                this.getPdfTemplates();
            } else if (this.isRecordLevelPermissionEnabled) {
                this.selectedTabIndex = 4;
            } else {
                this.selectedTabIndex = 5;
            }
        }
        else {
            this.selectedTabIndex = 5;
        }
    }


    toggleDisplayKeys() {
        this.enableConfigureFormKeySettings = !this.enableConfigureFormKeySettings;
    }

    createWorkflowPopup(addWorkflowPopover) {
        this.initializeWorkFlowTypeForm();
        this.loadWorkflowTypes();
        addWorkflowPopover.openPopover();
        this.addingWorkflow = false;
    }


    getTagsList(tags) {
        this.tagsList = tags;
    }

    getWorkflowByCustomApplicationId() {
        if (this.applicationId) {
            const workflowData = new CustomApplicationWorkflowModel();
            workflowData.customApplicationId = this.applicationId;
            this.genericFormService.getCustomApplicationWorkflow(workflowData).subscribe((responseData: any) => {
                const success = responseData.success;
                if (success) {
                    if (responseData.data) {
                        this.formWorkflowGridData(responseData.data);
                    }
                } else {
                    this.validationMessage = responseData.apiResponseMessages[0].message;
                    this.toastr.error("", this.validationMessage);
                }
                this.worflowGridSpinner = false;
            });
        }
    }

    formWorkflowGridData(customApplicationWorkflows: CustomApplicationWorkflowModel[]) {
        const ruleJsons = [];
        _.each(customApplicationWorkflows, (workflow: any, index) => {
            if (workflow.ruleJson) {
                ruleJsons.push(JSON.parse(workflow.ruleJson));
            } else {
                ruleJsons.push({
                    sourceKey: "",
                    logicalOperation: "",
                    sourceValue: "",
                    destinationKey: "",
                    destinationValue: "",
                    customApplicationName: "",
                    customApplicationKeyLabels: "",
                    sourceFormName: "",
                    destinationFormName: ""
                });
            }
            ruleJsons[index]["customApplicationWorkflowTypeId"] = workflow.customApplicationWorkflowTypeId;
            ruleJsons[index]["customApplicationWorkflowId"] = workflow.customApplicationWorkflowId;
            ruleJsons[index]["workflowTypeName"] = workflow.workflowTypeName;
            ruleJsons[index]["workflowName"] = workflow.workflowName;
            ruleJsons[index]["workflowTrigger"] = workflow.workflowTrigger;
            ruleJsons[index]["workflowXml"] = workflow.workflowXml == null ? "" : workflow.workflowXml;
        });
        this.workFlowDataList = ruleJsons;
    }

    getFormValue(key) {
        if (this.customApplicationByIdData && key != "") {
            const formSrc = JSON.parse(this.customApplicationByIdData.formJson);
            // var filteredColumn = _.find(formSrc['components'], function (column) { return column['key'] == key; });
            let filteredColumn;
            formUtils.eachComponent(formSrc["components"], (column) => {
                if (column["key"] == key) {
                    filteredColumn = column["label"];
                }
            }, false);
            return filteredColumn;
        }
        return "";
    }

    getCustomApplicationById(applicationId) {
        const customApplicationSearchModel = new CustomApplicationSearchModel();
        customApplicationSearchModel.customApplicationId = applicationId;
        this.gettingCustomApplicationFormInProgress = true;
        this.genericFormService.getCustomApplication(customApplicationSearchModel)
            .subscribe((responseData: any) => {
                const success = responseData.success;
                this.gettingCustomApplicationFormInProgress = false;
                if (success) {
                    if (responseData.data) {
                        this.customApplicationByIdData = responseData.data[0];
                        this.isRedirectToEmail = this.customApplicationByIdData.isRedirectToEmails;
                        this.isRecordLevelPermissionEnabled = this.customApplicationByIdData.isRecordLevelPermissionEnabled;
                        this.recordLevelPermissionFieldName = this.customApplicationByIdData.recordLevelPermissionFieldName;
                        this.conditionalEnum = this.customApplicationByIdData.conditionalEnum;
                        this.mailWorkflowIds = this.customApplicationByIdData.workflowIds;
                        this.configureDetails.toRoleIds = this.customApplicationByIdData?.toRoleIds;
                        this.configureDetails.toEmails = this.customApplicationByIdData?.toEmails;
                        this.configureDetails.subject = this.customApplicationByIdData?.subject;
                        this.configureDetails.message = this.customApplicationByIdData?.message;
                        this.pdfDialogDetails.subject = this.customApplicationByIdData?.approveSubject;
                        this.pdfDialogDetails.message = this.customApplicationByIdData?.approveMessage;
                        let recordLevelPermissions = this.customApplicationByIdData?.conditionsJson;
                        let stageScenarios = this.customApplicationByIdData?.stageScenariosJson;
                        this.clearScenarioForm();
                        this.clearStageApplicationForm();
                        if (recordLevelPermissions) {
                            let steps = JSON.parse(recordLevelPermissions);
                            if (steps.length > 0) {
                                steps.forEach((step, index) => {
                                    this.scenarioSteps = this.scenarioForm.get('scenarioSteps') as FormArray;
                                    this.scenarioSteps.insert(index, this.updateScenarioStep(step, index));
                                    this.updateFieldsArray(step.Fields, index);
                                })

                            }
                        } else {
                            if (this.conditionalEnum == 3) {
                                this.scenarioSteps = this.scenarioForm.get('scenarioSteps') as FormArray;
                                if (this.scenarioSteps && this.scenarioSteps.length == 0) {
                                    this.addNewScenario(-1);
                                }
                            }
                        }
                        if (stageScenarios) {
                            if (stageScenarios == "[]") {
                                this.stageScenarioSteps = this.stageApplicationForm.get('stageScenarioSteps') as FormArray;
                                this.addNewStage(-1);

                            }
                            let stages = JSON.parse(stageScenarios);
                            stages.forEach((step, index) => {
                                this.stageScenarioSteps = this.stageApplicationForm.get('stageScenarioSteps') as FormArray;
                                this.stageScenarioSteps.insert(index, this.updateStageStep(step, index));
                            })
                        } else {
                            this.stageScenarioSteps = this.stageApplicationForm.get('stageScenarioSteps') as FormArray;
                            if (this.stageScenarioSteps && this.stageScenarioSteps.length == 0) {
                                this.addNewStage(-1);
                            }
                        }
                        let formIds = responseData.data.map(x => x.formId);
                        if (formIds) {
                            this.customFormIds = formIds.toString();
                        }
                        let selectedForms = [];
                        if (responseData.data) {
                            let customApplications = responseData.data;
                            customApplications.forEach((app) => {
                                var formModel: any = {};
                                formModel.Id = app.formId;
                                formModel.formId = app.formId;
                                formModel.formName = app.formName;
                                formModel.formJson = app.formJson;
                                selectedForms.push(formModel);
                            })
                        }

                        this.getRoles();
                        this.getCustomApplicationKeySelected(applicationId, selectedForms);
                        this.patchCustomApplicationForm(this.customApplicationByIdData);
                    }
                } else {
                    this.validationMessage = responseData.apiResponseMessages[0].message;
                    this.toastr.error("", this.validationMessage);
                }
            });
    }

    updateScenarioStep(step, index) {
        if (step.RoleIds) {
            step.roleIdsArray = step.RoleIds.split(",");
        } else {
            step.roleIdsArray = [];
        }
        if (step.UserIds) {
            step.userIdsArray = step.UserIds.split(",");
        } else {
            step.userIdsArray = [];
        }

        return this.formBuilder.group({
            roleIdsArray: new FormControl(step.roleIdsArray, Validators.compose([])),
            userIdsArray: new FormControl(step.userIdsArray, Validators.compose([])),
            fields: this.formBuilder.array([]),
        });
    }

    updateStageStep(step, index) {
        return this.formBuilder.group({
            fieldName: new FormControl(step.FieldName, Validators.compose([])),
            fieldValue: new FormControl(step.FieldValue, Validators.compose([])),
            stage: new FormControl(step.Stage, Validators.compose([])),
        });
    }

    updateFieldsArray(fields, index) {
        this.fields = (this.scenarioForm.get('scenarioSteps') as FormArray).at(index).get('fields') as FormArray;
        fields.forEach((step1, index) => {
            this.fields.insert(index, this.updateFieldStep(step1));
        });
    }

    updateFieldStep(step) {
        return this.formBuilder.group({
            fieldName: new FormControl(step.FieldName, Validators.compose([])),
            fieldValue: new FormControl(step.FieldValue, Validators.compose([])),
            condition: new FormControl(step.Condition, Validators.compose([]))
        });
    }

    removeRecordLevelPermission() {
        if (this.conditionalEnum == 3) {
            this.scenarioSteps = this.scenarioForm.get('scenarioSteps') as FormArray;
            if (this.scenarioSteps && this.scenarioSteps.length > 0) {
                this.scenarioSteps.clear();
            }
        }
        this.conditionalEnum = null;
        this.recordLevelPermissionFieldName = null;
        this.isRecordLevelPermissionEnabled = false;
    }

    getCustomApplicationKeySelected(applicationId, selectedForms: any) {
        const customApplicationSearchModel = new CustomApplicationSearchModel();
        customApplicationSearchModel.customApplicationId = applicationId;
        this.gettingCustomApplicationFormInProgress = true;
        this.genericFormService.getCustomApplicationKeysSelected(customApplicationSearchModel)
            .subscribe((responseData: any) => {
                const success = responseData.success;
                this.gettingCustomApplicationFormInProgress = false;
                if (success) {
                    if (responseData.data) {
                        this.customApplicationKeySelected = responseData.data;
                        this.customApplicationByIdData.selectedEnableTrendsKeys = this.customApplicationKeySelected.selectedEnableTrendsKeys;
                        this.customApplicationByIdData.selectedKeyIds = this.customApplicationKeySelected.selectedKeyIds;
                        this.customApplicationByIdData.selectedPrivateKeyIds = this.customApplicationKeySelected.selectedPrivateKeyIds;
                        this.customApplicationByIdData.selectedTagKeyIds = this.customApplicationKeySelected.selectedTagKeyIds;

                        this.formSelect(selectedForms);
                        this.patchCustomApplicationForm(this.customApplicationByIdData);
                    }
                } else {
                    this.validationMessage = responseData.apiResponseMessages[0].message;
                    this.toastr.error("", this.validationMessage);
                }
            });
    }

    getCustomApplicationKeysById(applicationId) {
        const customApplicationKeySearchModel = new CustomApplicationKeySearchModel();
        customApplicationKeySearchModel.customApplicationId = applicationId;
        this.gettingCustomApplicationKeysInProgress = true;
        this.genericFormService.getCustomApplicationKeys(customApplicationKeySearchModel)
            .subscribe((responseData: any) => {
                const success = responseData.success;
                this.gettingCustomApplicationKeysInProgress = false;
                if (success) {
                    this.customApplicationKeysById = responseData.data[0];
                    this.selectedCustomApplicationKeysById = responseData.data[0];
                } else {
                    this.validationMessage = responseData.apiResponseMessages[0].message;
                    this.toastr.error("", this.validationMessage);
                }
            });
    }

    toggleAllRolesSelected() {
        if (this.allSelected.selected) {
            if (this.rolesList.length === 0) {
                this.customApplicationForm.controls["roleIds"].patchValue([]);
            } else {
                this.customApplicationForm.controls["roleIds"].patchValue([
                    ...this.rolesList.map((item) => item.roleId),
                    0
                ]);
            }
        } else {
            this.customApplicationForm.controls["roleIds"].patchValue([]);
        }
    }


    toggleAllUserSelected() {
        if (this.allSelected.selected) {
            if (this.userLists.length === 0) {
                this.customApplicationForm.controls["userLists"].patchValue([]);
            } else {
                this.customApplicationForm.controls["userLists"].patchValue([
                    ...this.userLists.map((item) => item.userId),
                    0

                ]);
            }
        } else {
            this.customApplicationForm.controls["userLists"].patchValue([]);
        }
    }


    toggleUserPerOne() {
        if (this.allSelected.selected) {
            this.allSelected.deselect();
            return false;
        }
        if (this.customApplicationForm.controls["roleIds"].value.length === this.rolesList.length) {
            this.allSelected.select();
        }
    }


    toggleUserList() {
        // if (this.allSelected.selected) {
        //     this.allSelected.deselect();
        //     return false;
        // }
        // if (this.customApplicationForm.controls["userLists"].value.length === this.userLists.length) {
        //     this.allSelected.select();
        // } 
    }

    compareSelectedRoles(rolesList: any, selectedRoles: any) {
        if (rolesList === selectedRoles) {
            return true;
        } else {
            return false;
        }
    }

    getRoles() {
        this.roleService.getAllRoles().subscribe((result: any) => {
            if (result.success) {
                this.rolesList = result.data;
                if (this.applicationId) {
                    this.patchCustomApplicationForm(this.customApplicationByIdData);
                }
            }
        });
    }

    getAllUser() {
        var usermodel = new UserModel();
        this.userService.GetAllUsers(usermodel).subscribe((result: any) => {
            if (result.success) {
                this.userLists = result.data;
                this.userLists.forEach((user) => {
                    if (user.roleIds) {
                        user.roleIdsArray = user.roleIds.split(",");
                    }
                })
                if (this.applicationId) {
                    this.patchCustomApplicationForm(this.customApplicationByIdData);
                }
            }
        });
    }

    initializeFormTypeId() {
        this.customApplicationForm.patchValue({ formId: [] });
    }

    formSelect(selectedForms) {
        this.selectedForms = selectedForms;
        this.selectedFormIds = selectedForms.map((item) => item.formId);
        this.customFormIds = this.selectedFormIds.toString();
        this.getFormKeysByFormId(this.selectedFormIds);
        this.cdRef.detectChanges();
    }

    initializeCustomApplicationForm() {
        this.customApplicationForm = new FormGroup({
            customApplicationName: new FormControl("",
                Validators.compose([
                    Validators.required,
                    Validators.maxLength(50)
                ])
            ),
            roleIds: new FormControl("",
                Validators.compose([
                    Validators.required
                ])
            ),
            moduleIds: new FormControl(null,
                Validators.compose([
                    Validators.required
                ])
            ),
            userList: new FormControl(null,
                Validators.compose([
                ])
            ),
            customApplicationDescription: new FormControl("",
                Validators.compose([
                    Validators.maxLength(500)
                ])
            ),
            customApplicationTag: new FormControl("", [])
        })

        this.customApplicationConfigureForm = new FormGroup({
            selectedKeyIds: this.formBuilder.array([]),
            publicMessage: new FormControl("",
                Validators.compose([
                    Validators.maxLength(500)
                ])
            )
        })
    }

    patchCustomApplicationForm(customApplicationByIdData) {
        if (customApplicationByIdData) {
            this.showFields = customApplicationByIdData.isApproveNeeded;
            this.allowAnnonymous = customApplicationByIdData.allowAnnonymous;
            // tslint:disable-next-line: max-line-length
            this.customApplicationForm = new FormGroup({
                customApplicationName: new FormControl(customApplicationByIdData.customApplicationName,
                    Validators.compose([
                        Validators.required,
                        Validators.maxLength(50)
                    ])
                ),
                roleIds: new FormControl(this.convertStringToArray(customApplicationByIdData.roleIds),
                    Validators.compose([
                        Validators.required
                    ])
                ),
                customApplicationDescription: new FormControl(customApplicationByIdData.description,
                    Validators.compose([
                        Validators.maxLength(500)
                    ])
                ),
                moduleIds: new FormControl(this.convertStringToArray(customApplicationByIdData.moduleIds),
                    Validators.compose([
                        Validators.required
                    ])
                ),
                userList: new FormControl(this.convertStringToArrayUserIds(customApplicationByIdData.userIds),
                    Validators.compose([
                    ])
                ),
                customApplicationTag: new FormControl(customApplicationByIdData.tag)
            });

            this.customApplicationConfigureForm = new FormGroup({
                publicMessage: new FormControl(customApplicationByIdData.publicMessage,
                    Validators.compose([
                        Validators.maxLength(500)
                    ])
                )
            })

            this.isPdfRequired = customApplicationByIdData.isPdfRequired;

            this.isPublished = customApplicationByIdData.isPublished;

            this.isRedirectToEmail = customApplicationByIdData.isRedirectToEmails;

            if (customApplicationByIdData.selectedKeyIds) {
                this.selectedKeyIds = this.convertKeyStringToArray(customApplicationByIdData.selectedKeyIds);
            }
            if (customApplicationByIdData.selectedPrivateKeyIds) {
                this.selectedPrivateKeyIds = this.convertKeyStringToArray(customApplicationByIdData.selectedPrivateKeyIds);
            }
            if (customApplicationByIdData.selectedTagKeyIds) {
                this.selectedTagKeyIds = this.convertKeyStringToArray(customApplicationByIdData.selectedTagKeyIds);
            }
            if (customApplicationByIdData.selectedEnableTrendsKeys) {
                this.selectedEnableTrendsKeys = this.convertKeyStringToArray(customApplicationByIdData.selectedEnableTrendsKeys);
            }
        }
    }


    onChange(genericFormKeyId: string, event) {
        if (event.checked) {
            this.selectedKeyIds.push(genericFormKeyId);
        } else {
            const index = this.selectedKeyIds.indexOf(genericFormKeyId)
            this.selectedKeyIds.splice(index, 1);
        }
    }

    onPrivateChange(genericFormKeyId: string, event) {
        if (event.checked) {
            this.selectedPrivateKeyIds.push(genericFormKeyId);
        } else {
            const index = this.selectedPrivateKeyIds.indexOf(genericFormKeyId)
            this.selectedPrivateKeyIds.splice(index, 1);
        }
    }

    onEnableTrendsChange(genericFormKeyId: string, event) {
        if (event.checked) {
            this.selectedEnableTrendsKeys.push(genericFormKeyId);
        } else {
            const index = this.selectedEnableTrendsKeys.indexOf(genericFormKeyId)
            this.selectedEnableTrendsKeys.splice(index, 1);
        }
    }

    onTagChange(genericFormKeyId: string, event) {
        if (event.checked) {
            this.selectedTagKeyIds.push(genericFormKeyId);
        } else {
            const index = this.selectedPrivateKeyIds.indexOf(genericFormKeyId)
            this.selectedTagKeyIds.splice(index, 1);
        }
    }

    convertStringToArray(customApplicationByIdData) {
        if (customApplicationByIdData) {
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

    convertStringToArrayUserIds(customApplicationByIdData) {
        if (customApplicationByIdData) {
            const customApplicationRoleIds = customApplicationByIdData.split(",");
            const selectedRoleIds = [];
            customApplicationRoleIds.forEach((id) => {
                selectedRoleIds.push(id.toLowerCase());
            });
            return selectedRoleIds
        } else {
            return [];
        }
    }

    selectGenericFormKeyId(formKeyId) {
        return _.filter(this.selectedKeyIds, (key) => {
            if (key.toLowerCase() == formKeyId.toLowerCase()) {
                return true;
            } else {
                return false;
            }
        });
    }

    convertKeyStringToArray(customApplicationByIdData) {
        if (customApplicationByIdData) {
            const customApplicationRoleIds = customApplicationByIdData.split(",");
            const selectedRoleIds = [];
            customApplicationRoleIds.forEach((id) => {
                selectedRoleIds.push(id.toLowerCase());
            });
            return selectedRoleIds
        } else {
            return [];
        }
    }


    saveCustomApplicationForm(isPublished) {
        if (!this.workflowIds) {
            this.workflowIds = this.mailWorkflowIds;
        }
        this.isAnyOperationIsInprogress = true;
        let customApplication = new CustomApplicationModel();
        customApplication = this.customApplicationForm.value;
        let customApplicationRoleIds = this.customApplicationForm.value.roleIds;
        const index = customApplicationRoleIds.indexOf(0);
        if (index > -1) {
            customApplicationRoleIds.splice(index, 1);
        }
        let customApplicationModuleIds = this.customApplicationForm.value.moduleIds;
        const index1 = customApplicationModuleIds.indexOf(0);
        if (index1 > -1) {
            customApplicationModuleIds.splice(index, 1);
        }
        let customApplicationuserList = this.customApplicationForm.value.userList;
        customApplication.formId = this.selectedFormIds.toString();
        customApplication.publicMessage = this.customApplicationConfigureForm.get("publicMessage").value;
        customApplication.domainName = window.location.protocol + "//" + window.location.hostname;
        customApplication.selectedKeyIds = this.selectedKeyIds.toString();
        customApplication.selectedPrivateKeyIds = this.selectedPrivateKeyIds.toString();
        customApplication.selectedEnableTrendsKeys = this.selectedEnableTrendsKeys.toString();
        customApplication.selectedTagKeyIds = this.selectedTagKeyIds.toString();
        customApplication.roleIds = customApplicationRoleIds.join(",");
        customApplication.moduleIds = customApplicationModuleIds.join(",");
        customApplication.userList = customApplicationuserList;
        customApplication.formId = customApplication.formId.toString();
        customApplication.selectedForms = this.selectedForms;
        customApplication.description = this.customApplicationForm.get("customApplicationDescription").value;
        customApplication.isPublished = false;
        customApplication.isPdfRequired = this.isPdfRequired ? this.isPdfRequired : false;
        customApplication.isApproveNeeded = this.showFields;
        customApplication.allowAnnonymous = this.allowAnnonymous;
        customApplication.isRecordLevelPermissionEnabled = this.isRecordLevelPermissionEnabled;
        customApplication.recordLevelPermissionFieldName = this.recordLevelPermissionFieldName;
        customApplication.conditionalEnum = this.conditionalEnum;
        customApplication.isRedirectToEmails = this.isRedirectToEmail;
        customApplication.workflowIds = this.workflowIds;
        customApplication.toRoleIds = this.configureDetails.toRoleIds;
        customApplication.toEmails = this.configureDetails.toEmails;
        customApplication.message = this.configureDetails.message;
        customApplication.subject = this.configureDetails.subject;
        customApplication.approveMessage = this.pdfDialogDetails?.message;
        customApplication.approveSubject = this.pdfDialogDetails?.subject;
        customApplication.filters = {};

        let steps = this.scenarioForm.value.scenarioSteps;
        if (steps.length > 0) {
            steps.forEach((step1) => {
                if (step1.roleIdsArray) {
                    step1.roleIds = step1.roleIdsArray.toString();
                } else {
                    step1.roleIds = "";
                }
                if (step1.userIdsArray) {
                    step1.userIds = step1.userIdsArray.toString();
                } else {
                    step1.userIds = "";
                }
            })
            customApplication.filters.scenarioSteps = steps;
        } else {
            customApplication.filters.scenarioSteps = null;
        }
        customApplication.stagesScenarios = this.stageApplicationForm.value.stageScenarioSteps;
        if (this.applicationId) {
            customApplication.isPublished = isPublished == null ? this.customApplicationByIdData.isPublished : isPublished;
            customApplication.customApplicationId = this.customApplicationByIdData.customApplicationId;
            customApplication.timeStamp = this.customApplicationByIdData.timeStamp;
        }
        this.genericFormService.upsertCustomApplication(customApplication)
            .subscribe((responseData: any) => {
                const success = responseData.success;
                if (success) {
                    this.snackbar.open("Saved successfully", "", { duration: 3000 });
                    if (responseData) {
                        this.applicationId = responseData.data;
                        this.getCustomApplicationById(this.applicationId);
                        this.getWorkflowByCustomApplicationId();
                        this.navigateToProcessForm();
                        this.selectedKeyIds = [];
                        this.selectedPrivateKeyIds = [];
                        this.selectedTagKeyIds = [];
                        this.selectedEnableTrendsKeys = [];
                        this.isPublished = isPublished;
                        const customTagsModel = new CustomTagModel();
                        customTagsModel.referenceId = this.applicationId;
                        customTagsModel.tagsList = this.tagsList;
                        this.customTagsService.upsertCustomTag(customTagsModel).subscribe((result: any) => {
                            if (result.success != true) {
                                var validationMessage = result.apiResponseMessages[0].message;
                                this.toastr.error(validationMessage);
                            }
                            this.isAnyOperationIsInprogress = false;
                        });
                    }
                    this.isAnyOperationIsInprogress = false;
                } else {
                    this.validationMessage = responseData.apiResponseMessages[0].message;
                    this.toastr.error("", this.validationMessage);
                    this.isAnyOperationIsInprogress = false;
                }

            });
    }

    goToViewCustomForms() {
        this.router.navigate(["applications/custom-applications"]);
    }

    getFormKeysList() {
        let formIds = this.selectedFormIds;
        this.formKeysList = [];
        formIds.forEach((element) => {
            this.genericFormService.getFormKeysByFormId(element).subscribe((response: any) => {
                if (response.success) {
                    let keys = response.data;
                    keys.forEach((key) => {
                        this.formKeysList.push(key);
                    })
                    this.formKeysList = _.sortBy(this.formKeysList, "label");

                } else {
                    this.validationMessage = response.apiResponseMessages[0].message;
                    this.toastr.error("", this.validationMessage);
                }
            })
        });
    }

    getFormKeysByFormId(formIds) {
        this.multipleGenericFormKeys = [];
        formIds.forEach((element) => {

            const formSrc = JSON.parse(_.find(this.selectedForms, (formDetails: any) =>
                formDetails.formId == element).formJson);
            let updatedNewComponents = [];
            if (formSrc) {
                let components = formSrc.Components;
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
            let form = { components: updatedNewComponents }
            const selectedKeys = this.customApplicationByIdData && this.customApplicationByIdData.selectedKeyIds != null ?
                this.customApplicationByIdData.selectedKeyIds.split(",") : [];
            const selectedPrivateKeys = this.customApplicationByIdData && this.customApplicationByIdData.selectedPrivateKeyIds != null
                ? this.customApplicationByIdData.selectedPrivateKeyIds.split(",") : [];
            const selectedTagKeys = this.customApplicationByIdData && this.customApplicationByIdData.selectedTagKeyIds != null
                ? this.customApplicationByIdData.selectedTagKeyIds.split(",") : [];
            const selectedEnableTrendKeys = this.customApplicationByIdData && this.customApplicationByIdData.selectedEnableTrendsKeys != null
                ? this.customApplicationByIdData.selectedEnableTrendsKeys.split(",") : [];

            this.genericFormService.getFormKeysByFormId(element).subscribe((response: any) => {
                if (response.success) {
                    this.genericFormKeyList = response.data;
                    this.multipleGenericFormKeys.push(this.genericFormKeyList);
                    const keysList = [];
                    _.each(this.genericFormKeyList, (genericFormKey) => {
                        const isActive = _.find(selectedKeys, (key) => key.toLowerCase() ==
                            genericFormKey.genericFormKeyId.toLowerCase());
                        genericFormKey["isActive"] = isActive != null;

                        const isPrivate = _.find(selectedPrivateKeys, (key) => key.toLowerCase() ==
                            genericFormKey.genericFormKeyId.toLowerCase());
                        genericFormKey["isPrivate"] = isPrivate != null;

                        const isTag = _.find(selectedTagKeys, (key) => key.toLowerCase() ==
                            genericFormKey.genericFormKeyId.toLowerCase());
                        genericFormKey["isTag"] = isTag != null;

                        const isEnableTrends = _.find(selectedEnableTrendKeys, (key) => key.toLowerCase() ==
                            genericFormKey.genericFormKeyId.toLowerCase());
                        genericFormKey["isEnableTrends"] = isEnableTrends != null;

                        formUtils.eachComponent(form["components"], (column) => {
                            if (column["key"] == genericFormKey.key) {
                                const title = column["label"];
                                genericFormKey["label"] = title;

                                keysList.push(genericFormKey);
                            }
                        }, false);

                    });
                    this.genericFormKeyList = _.sortBy(keysList, "label");
                    this.availableGenericFormKeysList = JSON.parse(JSON.stringify(this.genericFormKeyList));
                    this.availableDestinationFormKeysList = JSON.parse(JSON.stringify(this.genericFormKeyList));
                } else {
                    this.validationMessage = response.apiResponseMessages[0].message;
                    this.toastr.error("", this.validationMessage);
                }
            })
        });
    }


    // getFormKeysByFormId(formId) {
    //     this.multipleGenericFormKeys = [];
    //     this.gettingTagKeysInprogress = true;

    //     const formSrc = this.selectedForm.formJson;

    //     const selectedKeys = this.customApplicationByIdData && this.customApplicationByIdData.selectedKeyIds != null ?
    //         this.customApplicationByIdData.selectedKeyIds.split(",") : [];
    //     const selectedPrivateKeys = this.customApplicationByIdData && this.customApplicationByIdData.selectedPrivateKeyIds != null
    //         ? this.customApplicationByIdData.selectedPrivateKeyIds.split(",") : [];
    //     const selectedTagKeys = this.customApplicationByIdData && this.customApplicationByIdData.selectedTagKeyIds != null
    //         ? this.customApplicationByIdData.selectedTagKeyIds.split(",") : [];
    //     const selectedEnableTrendKeys = this.customApplicationByIdData && this.customApplicationByIdData.selectedEnableTrendsKeys != null
    //         ? this.customApplicationByIdData.selectedEnableTrendsKeys.split(",") : [];

    //     this.genericFormService.getFormKeysByFormId(formId).subscribe((response: any) => {
    //         if (response.success) {
    //             this.genericFormKeyList = response.data;
    //             this.multipleGenericFormKeys.push(this.genericFormKeyList);
    //             const keysList = [];
    //             _.each(this.genericFormKeyList, (genericFormKey) => {
    //                 const isActive = _.find(selectedKeys, (key) => key.toLowerCase() ==
    //                     genericFormKey.genericFormKeyId.toLowerCase());
    //                 genericFormKey["isActive"] = isActive != null;

    //                 const isPrivate = _.find(selectedPrivateKeys, (key) => key.toLowerCase() ==
    //                     genericFormKey.genericFormKeyId.toLowerCase());
    //                 genericFormKey["isPrivate"] = isPrivate != null;

    //                 const isTag = _.find(selectedTagKeys, (key) => key.toLowerCase() ==
    //                     genericFormKey.genericFormKeyId.toLowerCase());
    //                 genericFormKey["isTag"] = isTag != null;

    //                 const isEnableTrends = _.find(selectedEnableTrendKeys, (key) => key.toLowerCase() ==
    //                     genericFormKey.genericFormKeyId.toLowerCase());
    //                 genericFormKey["isEnableTrends"] = isEnableTrends != null;

    //                 formUtils.eachComponent(formSrc["components"], (column) => {
    //                     if (column["key"] == genericFormKey.key) {
    //                         const title = column["label"];
    //                         genericFormKey["label"] = title;

    //                         keysList.push(genericFormKey);
    //                     }
    //                 }, false);

    //             });
    //             this.genericFormKeyList = _.sortBy(this.genericFormKeyList, "label");
    //             this.availableGenericFormKeysList = JSON.parse(JSON.stringify(this.genericFormKeyList));
    //             this.availableDestinationFormKeysList = JSON.parse(JSON.stringify(this.genericFormKeyList));
    //         } else {
    //             this.validationMessage = response.apiResponseMessages[0].message;
    //             this.toastr.error("", this.validationMessage);
    //         }
    //         this.gettingTagKeysInprogress = false;
    //     })


    // }

    loadWorkflowTypes() {
        this.genericFormService.getCustomApplicationWorkflowTypes().subscribe((response: any) => {
            if (response.success) {
                this.workflowTypes = response.data;
            } else {
                this.validationMessage = response.apiResponseMessages[0].message;
                this.toastr.error("", this.validationMessage);
            }
        })
    }

    loadCustomApplications() {
        const customApplicationSearchModel = new CustomApplicationSearchModel();
        customApplicationSearchModel.sortBy = this.sortBy;
        customApplicationSearchModel.sortDirectionAsc = this.sortDirection;
        customApplicationSearchModel.pageNumber = this.page.pageNumber + 1;
        customApplicationSearchModel.pageSize = 1000;
        customApplicationSearchModel.isArchived = false;
        this.genericFormService.getCustomApplication(customApplicationSearchModel)
            .subscribe((responseData: any) => {
                const success = responseData.success;
                if (success) {
                    this.customApplicationsFormsList = responseData.data;
                    this.customApplicationsList = [];
                    this.customApplicationsFormsList.forEach(element => {
                        if (this.customApplicationsList && this.customApplicationsList.length > 0) {
                            const customApplicationDetails = this.customApplicationsList.find((x) =>
                                x.customApplicationId === element.customApplicationId);
                            if (customApplicationDetails) {
                                this.customApplicationsList.push(customApplicationDetails);
                            }
                        } else {
                            this.customApplicationsList.push(element);
                        }
                    });
                } else {
                    this.validationMessage = responseData.apiResponseMessages[0].message;
                    this.toastr.error("", this.validationMessage);
                }
            });
    }

    getCustomApplicationForms(value) {
        this.customApplicationsFormsList.forEach((element) => {
            if (element.customApplicationId == value) {
                this.selectedCustomApplicationForms.push(element);
            }
        });
    }

    addWorkFlowType(value) {
        this.loadWorkflowType = true;
        this.closeWorkFlowTypeDialog();
        if (value == this.workflowType3Id) {
            this.makeEditOff(this.workflowType3Id);
        } else if (value == this.workflowType4Id) {
            this.makeEditOff(this.workflowType4Id);
        } else {
            this.loadCustomApplications();
            this.addWorkflowPopup.open();
        }
    }

    closeWorkFlowTypeDialog() {
        this.workflowTypesPopover.forEach(p => p.closePopover());
        this.editBpmnWorkflow = false;
        this.editBpmnWorkflowXml = null;
        this.editBpmnWorkflowName = null;
        this.editWorkflowTrigger = null;
        this.editBpmnWorkflowId = null;
    }

    makeEditOff(workflowId) {
        this.editBpmnWorkflow = false;
        this.editBpmnWorkflowXml = null;
        this.editBpmnWorkflowId = null;
        this.editBpmnWorkflowName = null;
        this.editWorkflowTrigger = null;
        this.createWorkflowDialog(workflowId);
    }

    editBpmnWorkflowData(data) {
        this.editBpmnWorkflow = true;
        this.editBpmnWorkflowXml = data.workflowXml == null ? null : data.workflowXml;
        this.editBpmnWorkflowName = data.workflowName == null ? null : data.workflowName;
        this.editWorkflowTrigger = data.workflowTrigger == null ? null : data.workflowTrigger;
        this.editBpmnWorkflowId = data.customApplicationWorkflowId;
        this.createWorkflowDialog(data.customApplicationWorkflowTypeId);
    }

    createWorkflowDialog(workflowId) {
        let formId: string = "workflow-bpmn-dialog";
        const dialogRef = this.dialog.open(this.workflowBpmnComponent, {
            height: "100vh",
            width: "100vw",
            maxWidth: "100vw",
            maxHeight: "100vh",
            hasBackdrop: true,
            direction: "ltr",
            id: formId,
            data: {
                editBpmnWorkflow: this.editBpmnWorkflow,
                editBpmnWorkflowXml: this.editBpmnWorkflowXml,
                editBpmnWorkflowName: this.editBpmnWorkflowName,
                editWorkflowTrigger: this.editWorkflowTrigger,
                customApplicationId: this.applicationId,
                workflowId: this.editBpmnWorkflow == false ? null : this.editBpmnWorkflowId,
                workflowTypeId: workflowId,
                formPhysicalId: formId
            },
            disableClose: true,
            panelClass: "custom-modal-box"
        });
        dialogRef.afterClosed().subscribe((response) => {
            if (response && response.data == "success") {
                this.getWorkflowByCustomApplicationId();
            }
            this.editBpmnWorkflow = false;
            this.editBpmnWorkflowXml = null;
            this.editBpmnWorkflowId = null;
        });
    }

    checkStatusDisabled() {
        if (this.selectedWorkflowType.value) {
            return false;
        } else {
            return true;
        }
    }

    initializeWorkFlowTypeForm() {
        this.selectedWorkflowType = new FormControl("", []);
    }

    // getFormKeysBySelectedFormId(value) {
    //     this.multipleGenericFormKeys.forEach(element => {
    //         if (element[0].genericFormId == value) {
    //             const keysList = [];
    //             element.forEach((keyValue) => {
    //                 keysList.push(keyValue);
    //             });
    //             this.genericFormKeyList = _.sortBy(keysList, "label");
    //             this.availableGenericFormKeysList = JSON.parse(JSON.stringify(this.genericFormKeyList));
    //             this.availableDestinationFormKeysList = JSON.parse(JSON.stringify(this.genericFormKeyList));
    //         }
    //     });
    // }

    ngOnDestroy() {
        this.subs.unsubscribe();
        this.dragulaService.destroy("dragulaBoardUniqueId");
    }

    toggleModulePerOne() {
        if (this.allModuleSelected.selected) {
            this.allModuleSelected.deselect();
            return false;
        }
        if (
            this.customApplicationForm.get("moduleIds").value.length === this.modulesDropDown.length
        ) {
            this.allModuleSelected.select();
        }
    }

    toggleAllModuleSelected() {
        if (this.allModuleSelected.selected && this.modulesDropDown) {
            this.customApplicationForm.get("moduleIds").patchValue([
                ...this.modulesDropDown.map((item) => item.moduleId),
                0
            ]);
            this.selectedModuleIds = this.modulesDropDown.map((item) => item.moduleId);
        } else {
            this.customApplicationForm.get("moduleIds").patchValue([]);
        }
    }

    compareSelectedModuleFn(rolesList: any, moduleIds: any) {
        if (rolesList === moduleIds) {
            return true;
        } else {
            return false;
        }
    }
    GetAllModules() {
        this.masterDataManagementService.getAllModule().subscribe((response: any) => {
            if (response.success === true) {
                this.modulesDropDown = response.data;
                this.patchCustomApplicationForm(this.customApplicationByIdData);
                this.cdRef.detectChanges();
            }
            else {
                this.toastr.error(response.apiResponseMessages[0].message);
            }
        });
    }
    dataStateChange(state: DataStateChangeEvent): void {
        this.cdRef.detectChanges();
        this.state = state;

        let gridData = this.levelsData;
        if (this.state.sort) {
            gridData = orderBy(this.levelsData, this.state.sort);
        }
        this.gridData = process(gridData, this.state);
    }
    archiveLevel(dataItem) {
        const levelModel = dataItem;
        //levelModel.id = dataItem.id;
        levelModel.isArchived = true;
        this.genericFormService.upsertLevel(levelModel).subscribe((result: any) => {
            if (result.success === true) {
                this.toastr.success("Level archived successfully");
                this.getdocInfo();
            } else {
                var validationMessage = result.apiResponseMessages[0].message;
                this.toastr.error(validationMessage);
            }
        });
    }

    unArchiveLevel(dataItem) {
        //const levelModel = dataItem.dataJson;
        const levelModel = dataItem;
        //levelModel.id = dataItem.id;
        levelModel.isArchived = false;
        this.genericFormService.upsertLevel(levelModel).subscribe((result: any) => {
            if (result.success === true) {
                this.toastr.success("Level unarchived successfully");
                this.getdocInfo();
            } else {
                var validationMessage = result.apiResponseMessages[0].message;
                this.toastr.error(validationMessage);
            }
        });
    }

    showgrid() {
        if (!this.isArchived) {
            this.isArchived = true;
        } else {
            this.isArchived = false
        }
        this.getdocInfo();
    }

    getpdfTemplateName(pdfTemplate) {
        let pdf = this.pdfTemplates.find(x => x._id === pdfTemplate);
        if (pdf) {
            return pdf.fileName;
        } else {
            return "";
        }
    }
    isPdfRequiredChange($event) {
        this.isPdfRequired = $event.checked;
    }
    createLevel() {
        let dialogId = "add-level-component-popup";
        const dialogRef = this.dialog.open(this.addLevelComponent, {
            height: "90%",
            width: "90%",
            id: dialogId,
            data: { dataItem: {}, pdfTemplates: this.pdfTemplates, isEdit: false, customApplicationId: this.applicationId, formPhysicalId: dialogId }
        });
        dialogRef.afterClosed().subscribe((response) => {
            this.getdocInfo();
        });
    }
    editTemplate(dataItem) {
        let dialogId = "add-level-component-popup";
        const dialogRef = this.dialog.open(this.addLevelComponent, {
            height: "90%",
            width: "90%",
            id: dialogId,
            data: { dataItem: dataItem, pdfTemplates: this.pdfTemplates, isEdit: true, customApplicationId: this.applicationId, formPhysicalId: dialogId }
        });
        dialogRef.afterClosed().subscribe((response) => {
            this.getdocInfo();
        });
    }
    getPdfTemplates() {
        this.genericFormService.getPdfTemplates().subscribe((responseData: any) => {
            const success = responseData.success;
            if (success) {
                if (responseData.data) {
                    var data = responseData.data;
                    this.pdfTemplates = data;
                }
            } else {
                this.validationMessage = responseData.apiResponseMessages[0].message;
                this.toastr.error("", this.validationMessage);
            }
        });
    }
    saveDocInfo() {
        //this.navigateToProcessForm();
        if (this.isRecordLevelPermissionEnabled) {
            this.selectedTabIndex = 4;
        }
        else {
            this.selectedTabIndex = 5;
        }
    }
    navigateToAssignForm() {
        this.selectedTabIndex = 2;
        this.getFormKeysList();
    }
    submitFinished() {

    }

    getMailAlertsCount(event) {
        console.log(event.detail.mailsCount);
        this.emailsCount = event.detail.mailsCount;
        this.isArchivedWorkflows = event.detail.isArchivedWorkflows;
        this.mailWorkflowIds = event.detail.mailWorkflowIds;
        this.workflowIds = event.detail.mailWorkflowIds;
        console.log(this.mailWorkflowIds);
        this.cdRef.detectChanges();
    }

    openEmailConfigurationPopUp() {
        let dialogId = "email-component-popup";
        const dialogRef = this.dialog.open(this.emailTemplate, {
            height: "90%",
            width: "60%",
            id: dialogId,
            data: { emailDetails: this.configureDetails, formPhysicalId: dialogId, isPdf: true }
        });
        dialogRef.afterClosed().subscribe((response) => {
            console.log(response.data);
            this.configureDetails = response.data;
        });
    }

    openTemplateConfigurationPopUp() {
        let dialogId = "email-template-popup";
        const dialogRef = this.dialog.open(this.emailTemplate, {
            height: "90%",
            width: "60%",
            id: dialogId,
            data: { pdfDetails: this.pdfDialogDetails, formPhysicalId: dialogId, isPdf: false }
        });
        dialogRef.afterClosed().subscribe((response) => {
            console.log(response.data);
            this.pdfDialogDetails = response.data;
        });
    }

    getWizardsList() {
        if (this.isPdfRequired && this.isRecordLevelPermissionEnabled) {
            return 'six-wizards'
        } else if (this.isPdfRequired || this.isRecordLevelPermissionEnabled) {
            return 'five-wizards'
        } else {
            return 'four-wizards'
        }
    }

    compareSelectedUsers(usersList: any, selectedUsers: any) {
        if (usersList === selectedUsers) {
            return true;
        } else {
            return false;
        }
    }

    getSelectedRolesFunction(event, index) {
        this.selectedScenarioRoles = event;
        this.selectedScenarioIndex = index;
        this.selectedScenarioRolesString = this.selectedScenarioRoles.toString();
    }




    // configureEmail() {
    //     let mailConfigureDetails = this.docForm.value;
    //     let configureDetails: any = {};
    //     configureDetails.subject = mailConfigureDetails.subject;
    //     configureDetails.message = mailConfigureDetails.message;
    //     if (this.selectedRoleIds) {
    //         configureDetails.toRoleIds = this.selectedRoleIds.toString();
    //     }
    //     if (this.selectedToUsers) {
    //         configureDetails.toEmails = mailConfigureDetails.toUsers.toString();
    //     }
    //     this.configureDetails = configureDetails;
    //     this.configureEmailPopUps.forEach((p) => p.closePopover());
    // }
}