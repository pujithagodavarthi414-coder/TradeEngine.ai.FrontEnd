import { Component, ViewChild, ViewChildren, OnInit, TemplateRef } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, Validators } from "@angular/forms";
import { MatOption, MatSnackBar } from "@angular/material/snack-bar";
import { MatOption } from "@angular/material/core";
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute, Router } from "@angular/router";
import { SatPopover } from "@ncstate/sat-popover";
import * as formUtils from "formiojs/utils/formUtils.js";
import { DragulaService } from "ng2-dragula";
import { ToastrService } from "ngx-toastr";
import { Subscription, Observable } from "rxjs";
import * as _ from "underscore";
import { CustomApplicationModel } from "../models/custom-application-input.model";
import { CustomApplicationKeyModel } from "../models/custom-application-key-input.model";
import { CustomApplicationKeySearchModel } from "../models/custom-application-key-search.model";
import { CustomApplicationSearchModel } from "../models/custom-application-search.model";
import { CustomApplicationWorkflowModel } from "../models/custom-application-workflow";
import { GenericFormKeyModel } from "../models/generic-form-key.model";
import { WorkflowRuleJson } from "../models/workflow-rulejson";
import { GenericFormService } from "../services/generic-form.service";
import { WorkFlowBpmnComponent } from "./workflow-bpmn.component";
import { CustomAppBaseComponent } from "../../../../globaldependencies/components/componentbase";
import { RoleModel } from '../../../models/role.model';
import { ConstantVariables } from '../../../../globaldependencies/constants/constant-variables';
import { Page } from '../../../models/page.model';
import { RoleManagementService } from '../../../services/role-management.service';

@Component({
    selector: "app-fm-component-custom-application-form",
    templateUrl: `custom-application-form.component.html`
})

export class CreateCustomFormComponent extends CustomAppBaseComponent implements OnInit{
    @ViewChildren("workflowTypePopover") workflowTypesPopover;
    @ViewChild("allSelected") private allSelected: MatOption;
    @ViewChild("allKeysSelected") private allKeysSelected: MatOption;
    @ViewChild("addWorkflow") addWorkflowPopup: SatPopover;
    @ViewChild("workflowBpmnComponent") workflowBpmnComponent: TemplateRef<any>;

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
    selectedKeyIds = [];
    selectedPrivateKeyIds = [];
    selectedTagKeyIds = [];
    selectedEnableTrendsKeys = [];
    workflowTypes = [];
    customApplicationsList = [];
    workflowType1Id = ConstantVariables.WorkflowType1Id;
    workflowType2Id = ConstantVariables.WorkflowType2Id;
    workflowType3Id = ConstantVariables.WorkflowType3Id;
    workflowType4Id = ConstantVariables.WorkflowType4Id;
    customApplicationReferenceTypeId = ConstantVariables.CustomApllicationReferenceTypeId.toLowerCase();
    genericFormListDetails: any;
    formIds: any = [];
    formTypes: any;
    selectedWorkflowType: any;
    editBpmnWorkflowId: any;
    editBpmnWorkflowXml: any;
    editBpmnWorkflowName: string;
    editWorkflowTrigger: string;
    applicationId: string;
    gettingCustomApplicationFormInProgress: boolean;
    savingCustomApplicationInProgress: boolean;
    validationMessage: string;
    subs = new Subscription();
    dragulaBoardUniqueId: string;
    gettingCustomApplicationKeysInProgress: boolean;
    availableLogicalOperators: any = [];
    sortBy = "customApplicationName";
    sortDirection = true;
    page = new Page();
    roleFeaturesIsInProgress$: Observable<boolean>;

    addingWorkflow: boolean;
    savingWorkflowInProgress = false;
    editWorkflow = false;
    public workFlowData: WorkflowRuleJson = new WorkflowRuleJson();
    workflowForm: FormGroup;
    workFlowDataList: any = [];
    worflowGridSpinner = true;
    loadWorkflowType = false;
    editBpmnWorkflow = false;
    isType1required = false;
    isType2required = false;
    selectedForms: any = [];
    selectedFormsDetails: any = [];
    selectedFormKeyValues: any = [];
    customApplicationFormId: string;
    customApplicationsFormsList: any = [];
    selectedCustomApplicationForms: any = [];
    @ViewChild("formDirectiveSatPopover") formDirective: FormGroupDirective;
    customApplicationKeySelected: any;

    constructor(
        private roleService: RoleManagementService, private router: Router,
        private activatedRoute: ActivatedRoute, private genericFormService: GenericFormService, private toastr: ToastrService,
        private snackbar: MatSnackBar, private dragulaService: DragulaService, private formBuilder: FormBuilder,
        public dialog: MatDialog) {
            super();
        this.applicationId = "";
        this.activatedRoute.params.subscribe((routeParams) => {
            this.applicationId = routeParams.id;
        })
        if (this.applicationId) {
            this.getCustomApplicationById(this.applicationId);
        } else {
            this.initializeCustomApplicationForm();
            this.getRoles();
        }
        this.clearForm();
        this.initializeWorkFlowTypeForm();
        this.getAvailableOperators();
        this.getWorkflowByCustomApplicationId();
    }

    ngOnInit() {
        super.ngOnInit();
        this.initializeCustomApplicationForm();
        this.genericFormService.GetFormTypes().subscribe((response: any) => {
            this.formTypes = response.data;
        });
    }

    getAvailableOperators() {
        const operators = [
            { title: "Equals to", value: "=" },
            { title: "Not Equals to", value: "<>" },
            { title: "Greater than", value: ">" },
            { title: "Less than", value: "<" },
            { title: "Greater than and equals to", value: ">=" },
            { title: "Less than and equals to", value: "<=" }
        ];

        this.availableLogicalOperators = operators;
    }

    createWorkflowPopup(addWorkflowPopover) {
        this.initializeWorkFlowTypeForm();
        this.loadWorkflowTypes();
        addWorkflowPopover.openPopover();
        this.addingWorkflow = false;
    }

    saveWorkflow() {
        this.savingWorkflowInProgress = true;
        this.workFlowData = this.workflowForm.value;
        const ruleJson: WorkflowRuleJson = new WorkflowRuleJson();
        const sourceKey = this.workFlowData.sourceKey;
        const sourceColumn = _.find(this.availableGenericFormKeysList, (key) => key.genericFormKeyId == sourceKey);
        ruleJson.sourceKey = sourceColumn.key;
        ruleJson.sourceValue = this.workFlowData.sourceValue;
        ruleJson.logicalOperation = this.workFlowData.logicalOperation;
        let destinationColumn;
        let workflowFormKeyValues;
        if (this.selectedWorkflowType.value == this.workflowType1Id) {
            const destinationKey = this.workFlowData.destinationKey;
            destinationColumn = _.find(this.availableDestinationFormKeysList, (key) =>
                key.genericFormKeyId.toLowerCase() == destinationKey.toLowerCase());
            ruleJson.destinationKey = destinationColumn.key;
            ruleJson.destinationValue = this.workFlowData.destinationValue;
        } else {
            ruleJson.destinationKey = "";
            ruleJson.destinationValue = "";
            workflowFormKeyValues = this.workflowForm.value.customApplicationKeyValues;
            const index = workflowFormKeyValues.indexOf(0);
            if (index > -1) {
                workflowFormKeyValues.splice(index, 1);
            }
        }
        if (this.workFlowData.customApplicationId != "" && this.workFlowData.customApplicationId) {
            ruleJson.customApplicationId = this.workFlowData.customApplicationId;
            const applicationId = this.workFlowData.customApplicationId;
            const customApplicationData = _.find(this.customApplicationsList, (key) => {
                return key.customApplicationId == applicationId
            });
            ruleJson.customApplicationName = customApplicationData.customApplicationName;
            ruleJson.sourceFormName = this.selectedFormsDetails.find((x) => x.id == this.workflowForm.get("selectedFormId").value).formName;
            ruleJson.sourceFormId = this.workflowForm.get("selectedFormId").value;
            ruleJson.destinationFormId = this.workflowForm.get("customApplicationFormId").value;
            ruleJson.destinationFormName = this.selectedCustomApplicationForms.find(x => x.formId == this.workflowForm.get("customApplicationFormId").value).formName;
            ruleJson.customApplicationKeyValues = workflowFormKeyValues.toString();
            const keyValues = workflowFormKeyValues;
            const keyLabels = [];
            const formSrc = JSON.parse(this.customApplicationByIdData.formJson);
            _.each(keyValues, (item: any) => {
                formUtils.eachComponent(formSrc["components"], (x) => {
                    if (x["key"] == item) {
                        keyLabels.push(x["label"]);
                    }
                }, false);
            });
            ruleJson.customApplicationKeyLabels = keyLabels.toString();
        } else {
            ruleJson.customApplicationName = "";
            ruleJson.customApplicationKeyValues = "";
            ruleJson.customApplicationKeyLabels = "";
            ruleJson.sourceFormId = this.workflowForm.get("selectedFormId").value;
            ruleJson.sourceFormName = this.selectedFormsDetails.find(x => x.id == this.workflowForm.get("selectedFormId").value).formName;
        }
        const workflowData = new CustomApplicationWorkflowModel();
        workflowData.customApplicationWorkflowTypeId = this.selectedWorkflowType.value;
        workflowData.customApplicationId = this.workFlowData.customApplicationId == "" ?
            this.applicationId : this.workFlowData.customApplicationId;
        workflowData.customApplicationFormId = this.workflowForm.get("selectedFormId").value;
        workflowData.ruleJson = JSON.stringify(ruleJson);
        this.genericFormService.upsertCustomApplicationWorkflow(workflowData).subscribe((responseData: any) => {
            const success = responseData.success;
            if (success) {
                this.getWorkflowByCustomApplicationId();
                this.loadWorkflowType = false;
                this.initializeWorkFlowTypeForm();
            } else {
                this.validationMessage = responseData.apiResponseMessages[0].message;
                this.toastr.error("", this.validationMessage);
            }
            this.savingWorkflowInProgress = false;
        });
        this.clearForm();
        this.formDirective.resetForm();
        this.addWorkflowPopup.close();
    }

    getWorkflowByCustomApplicationId() {
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

    getLogicalOperatorValue(value) {
        const operator = _.find(this.availableLogicalOperators, (column: any) => column.value == value);
        if (operator) {
            return operator.title;
        }
        return "";
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

    clearForm() {
        this.workflowForm = new FormGroup({
            selectedFormId: new FormControl("",
                Validators.compose([
                    Validators.required
                ])
            ),
            sourceKey: new FormControl("",
                Validators.compose([
                    Validators.required
                ])
            ),
            logicalOperation: new FormControl("",
                Validators.compose([
                    Validators.required
                ])
            ),
            sourceValue: new FormControl("",
                Validators.compose([
                    Validators.required
                ])
            ),
            destinationKey: new FormControl("",
                Validators.compose([
                    Validators.required
                ])
            ),
            destinationValue: new FormControl("",
                Validators.compose([
                    Validators.required
                ])
            ),
            customApplicationId: new FormControl("",
                Validators.compose([
                    Validators.required
                ])
            ),
            customApplicationFormId: new FormControl("",
                Validators.compose([
                    Validators.required
                ])
            ),
            customApplicationKeyValues: new FormControl([],
                Validators.compose([
                    Validators.required
                ])
            )
        })
    }

    closeWorkflowDialog() {
        this.loadWorkflowType = false;
        this.clearForm();
        this.formDirective.resetForm();
        this.addWorkflowPopup.close();
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
                        responseData.data.forEach((element) => {
                            this.formIds.push(element.formId);
                        });
                        this.customApplicationForm.patchValue({ formId: this.formIds });
                        if (this.customApplicationByIdData.formTypeId) {
                            this.getForms(this.customApplicationByIdData.formTypeId);
                        }
                        this.getCustomApplicationKeySelected(applicationId);
                        this.getRoles();
                    }
                } else {
                    this.validationMessage = responseData.apiResponseMessages[0].message;
                    this.toastr.error("", this.validationMessage);
                }
            });
    }

    getCustomApplicationKeySelected(applicationId) {
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
                        this.customApplicationByIdData.selectedEnableTrendsKeys=this.customApplicationKeySelected.selectedEnableTrendsKeys;
                        this.customApplicationByIdData.selectedKeyIds=this.customApplicationKeySelected.selectedKeyIds;
                        this.customApplicationByIdData.selectedPrivateKeyIds=this.customApplicationKeySelected.selectedPrivateKeyIds;
                        this.customApplicationByIdData.selectedTagKeyIds=this.customApplicationKeySelected.selectedTagKeyIds;
  
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

    toggleUserPerOne() {
        if (this.allSelected.selected) {
            this.allSelected.deselect();
            return false;
        }
        if (this.customApplicationForm.controls["roleIds"].value.length === this.rolesList.length) {
            this.allSelected.select();
        }
    }

    compareSelectedRoles(rolesList: any, selectedRoles: any) {
        if (rolesList === selectedRoles) {
            return true;
        } else {
            return false;
        }
    }

    toggleAllKeysSelected() {
        if (this.allKeysSelected.selected) {
            if (this.availableGenericFormKeysList.length === 0) {
                this.workflowForm.controls["customApplicationKeyValues"].patchValue([]);
            } else {
                this.workflowForm.controls["customApplicationKeyValues"].patchValue([
                    ...this.availableGenericFormKeysList.map((item) => item.key),
                    0
                ]);
            }
        } else {
            this.workflowForm.controls["customApplicationKeyValues"].patchValue([]);
        }
    }

    toggleKeyPerOne() {
        if (this.allKeysSelected.selected) {
            this.allKeysSelected.deselect();
            return false;
        }
        if (this.workflowForm.controls["customApplicationKeyValues"].value.length === this.availableGenericFormKeysList.length) {
            this.allKeysSelected.select();
        }
    }

    compareSelectedKeys(rolesList: any, selectedRoles: any) {
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

    initializeFormTypeId() {
        this.customApplicationForm.patchValue({ formId: [] }); // controls["formId"].setValue([]);
    }

    getForms(formTypeId) {
        this.genericFormListDetails = [];
        this.genericFormService.GetGenericFormsByTypeId(formTypeId).subscribe((response: any) => {
            this.genericFormListDetails = response.data;
            this.genericFormKeyList = [];
            if (this.customApplicationByIdData) {
                this.getFormKeysByFormId(this.formIds);
            }
        })
    }

    initializeCustomApplicationForm() {
        this.customApplicationForm = new FormGroup({
            customApplicationName: new FormControl("",
                Validators.compose([
                    Validators.required,
                    Validators.maxLength(50)
                ])
            ),
            publicMessage: new FormControl("",
                Validators.compose([
                    Validators.maxLength(500)
                ])
            ),
            formTypeId: new FormControl("",
                Validators.compose([
                    Validators.required
                ])
            ),
            formId: new FormControl([],
                Validators.compose([
                    Validators.required
                ])
            ),
            roleIds: new FormControl("",
                Validators.compose([
                    Validators.required
                ])
            ),
            selectedKeyIds: this.formBuilder.array([])
        })
    }

    patchCustomApplicationForm(customApplicationByIdData) {
        const selectedKeyIds = customApplicationByIdData.selectedKeyIds != null ? customApplicationByIdData.selectedKeyIds.split(",") : [];
        // tslint:disable-next-line: max-line-length
        const selectedPrivateKeyIds = customApplicationByIdData.selectedPrivateKeyIds != null ? customApplicationByIdData.selectedPrivateKeyIds.split(",") : [];
        const selectedTagKeyIds = customApplicationByIdData.selectedTagKeyIds != null ? customApplicationByIdData.selectedTagKeyIds.split(",") : [];
        this.customApplicationForm = new FormGroup({
            customApplicationName: new FormControl(customApplicationByIdData.customApplicationName,
                Validators.compose([
                    Validators.required,
                    Validators.maxLength(50)
                ])
            ),
            publicMessage: new FormControl(customApplicationByIdData.publicMessage,
                Validators.compose([
                    Validators.maxLength(500)
                ])
            ),
            formTypeId: new FormControl(customApplicationByIdData.formTypeId,
                Validators.compose([
                    Validators.required
                ])
            ),
            formId: new FormControl(this.formIds,
                Validators.compose([
                    Validators.required
                ])
            ),
            roleIds: new FormControl(this.convertStringToArray(customApplicationByIdData.roleIds),
                Validators.compose([
                    Validators.required
                ])
            )
        });
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

    saveCustomApplicationForm() { 
        this.savingCustomApplicationInProgress = true;
        let customApplication = new CustomApplicationModel();
        customApplication = this.customApplicationForm.value;
        const customApplicationRoleIds = this.customApplicationForm.value.roleIds;
        const index = customApplicationRoleIds.indexOf(0);
        if (index > -1) {
            customApplicationRoleIds.splice(index, 1);
        }
        customApplication.domainName = window.location.protocol + "//" + window.location.hostname;
        customApplication.selectedKeyIds = this.selectedKeyIds.toString();
        customApplication.selectedPrivateKeyIds = this.selectedPrivateKeyIds.toString();
        customApplication.selectedEnableTrendsKeys = this.selectedEnableTrendsKeys.toString();
        customApplication.selectedTagKeyIds = this.selectedTagKeyIds.toString();
        customApplication.roleIds = customApplicationRoleIds.join(",");
        customApplication.formId = customApplication.formId.toString();
        if (this.applicationId) {
            customApplication.customApplicationId = this.customApplicationByIdData.customApplicationId;
            customApplication.timeStamp = this.customApplicationByIdData.timeStamp;
        }
        this.genericFormService.upsertCustomApplication(customApplication)
            .subscribe((responseData: any) => {
                const success = responseData.success;
                this.savingCustomApplicationInProgress = false;

                if (success) {
                    this.snackbar.open("Saved successfully", "", { duration: 3000 });
                    this.router.navigate(["applications/custom-applications"]);
                    this.selectedKeyIds = [];
                    this.selectedPrivateKeyIds = [];
                    this.selectedTagKeyIds = [];
                    this.selectedEnableTrendsKeys = [];
                } else {
                    this.validationMessage = responseData.apiResponseMessages[0].message;
                    this.toastr.error("", this.validationMessage);
                }
            });
    }

    goToViewCustomForms() {
        this.router.navigate(["applications/custom-applications"]);
    }

    clearCustomForm(formDirective: FormGroupDirective) {
        formDirective.resetForm();
        if (this.applicationId) {
            this.customApplicationForm.patchValue(this.customApplicationByIdData);
        } else {
            this.initializeCustomApplicationForm();
        }
    }

    getFormKeysByFormId(formId) {
        this.selectedForms = [];
        this.multipleGenericFormKeys = [];
        formId.forEach((element) => {
            const form = this.selectedForms.find((x) => x == element);
            if (!form) {
                this.selectedForms.push(element);

                const formSrc = JSON.parse(_.find(this.genericFormListDetails, (formDetails: any) =>
                    formDetails.id == element).formJson);
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

                            formUtils.eachComponent(formSrc["components"], (column) => {
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
            }
        });
    }

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
        if (value == this.workflowType1Id) {
            this.isType1required = true;
            this.isType2required = false;
            this.workflowForm.controls["customApplicationId"].clearValidators();
            this.workflowForm.get("customApplicationId").updateValueAndValidity();
            this.workflowForm.get("customApplicationFormId").updateValueAndValidity();
            this.workflowForm.controls["customApplicationFormId"].clearValidators();
            this.workflowForm.controls["customApplicationKeyValues"].clearValidators();
            this.workflowForm.get("customApplicationKeyValues").updateValueAndValidity();
        } else if (value == this.workflowType2Id) {
            this.isType1required = false;
            this.isType2required = true;
            this.workflowForm.controls["destinationKey"].clearValidators();
            this.workflowForm.get("destinationKey").updateValueAndValidity();
            this.workflowForm.controls["destinationValue"].clearValidators();
            this.workflowForm.get("destinationValue").updateValueAndValidity();
        }
        this.loadWorkflowType = true;
        this.getSelectedForms();
        this.closeWorkFlowTypeDialog();
        if (value == this.workflowType3Id) {
            this.makeEditOff(this.workflowType3Id);
        }else if(value == this.workflowType4Id){
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
        let formId : string = "workflow-bpmn-dialog";
        const dialogRef = this.dialog.open(this.workflowBpmnComponent, {
            height: "80%",
            width: "90%",
            hasBackdrop: true,
            direction: "ltr",
            data: {
                editBpmnWorkflow: this.editBpmnWorkflow,
                editBpmnWorkflowXml: this.editBpmnWorkflowXml,
                editBpmnWorkflowName: this.editBpmnWorkflowName,
                editWorkflowTrigger : this.editWorkflowTrigger,
                customApplicationId: this.applicationId,
                workflowId: this.editBpmnWorkflow == false ? null : this.editBpmnWorkflowId, 
                workflowTypeId: workflowId,
                formPhysicalId: formId
            },
            id:formId,
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

    getSelectedForms() {
        this.selectedFormsDetails = [];
        this.genericFormListDetails.forEach((genericForm) => {
            this.selectedForms.forEach((selectedForm) => {
                if (genericForm.id == selectedForm) {
                    this.selectedFormsDetails.push(genericForm);
                }
            });
        });
    }

    getFormKeysBySelectedFormId(value) {
        this.multipleGenericFormKeys.forEach(element => {
            if (element[0].genericFormId == value) {
                const keysList = [];
                element.forEach((keyValue) => {
                    keysList.push(keyValue);
                });
                this.genericFormKeyList = _.sortBy(keysList, "label");
                this.availableGenericFormKeysList = JSON.parse(JSON.stringify(this.genericFormKeyList));
                this.availableDestinationFormKeysList = JSON.parse(JSON.stringify(this.genericFormKeyList));
            }
        });
    }

    ngOnDestroy() {
        this.subs.unsubscribe();
        this.dragulaService.destroy("dragulaBoardUniqueId");
    }
}
